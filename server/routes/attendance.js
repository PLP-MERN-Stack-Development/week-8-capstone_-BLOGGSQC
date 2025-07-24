const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/attendance
// @desc    Get attendance records with filtering
// @access  Private (Admin, Teacher)
router.get('/', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      date,
      class: classId,
      student: studentId,
      status
    } = req.query;

    // Build filter object
    const filter = {};
    if (date) filter.date = new Date(date);
    if (classId) filter.class = classId;
    if (studentId) filter.student = studentId;
    if (status) filter.status = status;

    // For demonstration, we'll return mock attendance data
    // In a real implementation, you'd have an Attendance model
    const mockAttendance = [
      {
        _id: '1',
        student: {
          _id: 'student1',
          user: { name: 'John Smith' },
          studentId: 'STU24001',
          rollNumber: '001',
          class: { name: 'Grade 10A' }
        },
        date: date || new Date().toISOString().split('T')[0],
        status: 'present',
        timeIn: '08:15',
        timeOut: null,
        markedBy: { name: 'Dr. Sarah Johnson' }
      }
    ];

    res.json({
      status: 'success',
      message: 'Attendance records retrieved successfully',
      data: {
        attendance: mockAttendance,
        pagination: {
          currentPage: parseInt(page),
          totalPages: 1,
          totalRecords: mockAttendance.length
        }
      }
    });

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve attendance records',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/attendance
// @desc    Mark attendance for students
// @access  Private (Admin, Teacher)
router.post('/', authorize('admin', 'teacher'), [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('status').isIn(['present', 'absent', 'late']).withMessage('Invalid attendance status'),
  body('date').optional().isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { studentId, status, date = new Date() } = req.body;

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Update student attendance
    const isPresent = status === 'present';
    await student.updateAttendance(isPresent);

    res.json({
      status: 'success',
      message: 'Attendance marked successfully',
      data: {
        studentId,
        status,
        date,
        markedBy: req.user.name
      }
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/attendance/class/:classId
// @desc    Get attendance for a specific class
// @access  Private (Admin, Teacher)
router.get('/class/:classId', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { classId } = req.params;
    const { date = new Date().toISOString().split('T')[0] } = req.query;

    // Find class
    const classData = await Class.findById(classId).populate('students');
    if (!classData) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }

    // Get students in class with attendance data
    const studentsWithAttendance = await Student.find({
      class: classId,
      isActive: true
    }).populate('user', 'name email avatar');

    res.json({
      status: 'success',
      message: 'Class attendance retrieved successfully',
      data: {
        class: classData,
        students: studentsWithAttendance,
        date
      }
    });

  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve class attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/attendance/student/:studentId
// @desc    Get attendance history for a specific student
// @access  Private (Admin, Teacher, Student - own record)
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Find student
    const student = await Student.findById(studentId)
      .populate('user', 'name email')
      .populate('class', 'name grade section');

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Check permissions
    if (req.user.role === 'student' && student.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You can only view your own attendance.'
      });
    }

    res.json({
      status: 'success',
      message: 'Student attendance retrieved successfully',
      data: {
        student,
        attendance: student.attendance,
        period: { startDate, endDate }
      }
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve student attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/attendance/bulk
// @desc    Mark attendance for multiple students
// @access  Private (Admin, Teacher)
router.post('/bulk', authorize('admin', 'teacher'), [
  body('classId').isMongoId().withMessage('Valid class ID is required'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('attendanceData').isArray().withMessage('Attendance data must be an array'),
  body('attendanceData.*.studentId').isMongoId().withMessage('Valid student ID is required'),
  body('attendanceData.*.status').isIn(['present', 'absent', 'late']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { classId, date = new Date(), attendanceData } = req.body;

    // Verify class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }

    // Process bulk attendance
    const results = [];
    for (const record of attendanceData) {
      try {
        const student = await Student.findById(record.studentId);
        if (student) {
          const isPresent = record.status === 'present';
          await student.updateAttendance(isPresent);
          results.push({
            studentId: record.studentId,
            status: record.status,
            success: true
          });
        }
      } catch (error) {
        results.push({
          studentId: record.studentId,
          status: record.status,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      status: 'success',
      message: 'Bulk attendance processed successfully',
      data: {
        classId,
        date,
        results,
        processed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('Bulk attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process bulk attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;