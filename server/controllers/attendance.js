import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendance = async (req, res) => {
  try {
    const { date, class: classId, subject, student, viewType } = req.query;
    
    const query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    if (classId) query.class = classId;
    if (subject) query.subject = subject;
    if (student) query.student = student;

    const attendance = await Attendance.find(query)
      .populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('class', 'name grade section')
      .populate('subject', 'name code')
      .populate('teacher', 'firstName lastName')
      .sort({ date: -1, 'student.rollNumber': 1 });

    // Calculate statistics
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      excused: attendance.filter(a => a.status === 'excused').length
    };

    res.status(200).json({
      success: true,
      count: attendance.length,
      stats,
      records: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private/Admin/Teacher
export const createAttendance = async (req, res) => {
  try {
    const attendanceData = {
      ...req.body,
      markedBy: req.user.id
    };

    const attendance = await Attendance.create(attendanceData);

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('class', 'name grade section')
      .populate('subject', 'name code')
      .populate('teacher', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: populatedAttendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create attendance record',
      error: error.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin/Teacher
export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('student', 'user studentId rollNumber')
     .populate({
       path: 'student',
       populate: {
         path: 'user',
         select: 'firstName lastName'
       }
     })
     .populate('class', 'name grade section')
     .populate('subject', 'name code')
     .populate('teacher', 'firstName lastName');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update attendance record',
      error: error.message
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin/Teacher
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark bulk attendance
// @route   POST /api/attendance/bulk
// @access  Private/Admin/Teacher
export const markBulkAttendance = async (req, res) => {
  try {
    const { classId, subjectId, date, attendanceData } = req.body;

    const attendanceRecords = [];

    for (const record of attendanceData) {
      const attendanceRecord = {
        student: record.studentId,
        class: classId,
        subject: subjectId,
        teacher: req.user.id,
        date: new Date(date),
        status: record.status,
        timeIn: record.timeIn,
        timeOut: record.timeOut,
        remarks: record.remarks,
        markedBy: req.user.id
      };

      // Check if attendance already exists for this student, date, and subject
      const existingAttendance = await Attendance.findOne({
        student: record.studentId,
        date: new Date(date),
        subject: subjectId
      });

      if (existingAttendance) {
        // Update existing record
        await Attendance.findByIdAndUpdate(existingAttendance._id, attendanceRecord);
        attendanceRecords.push(existingAttendance._id);
      } else {
        // Create new record
        const newAttendance = await Attendance.create(attendanceRecord);
        attendanceRecords.push(newAttendance._id);
      }
    }

    const populatedRecords = await Attendance.find({
      _id: { $in: attendanceRecords }
    }).populate('student', 'user studentId rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('class', 'name grade section')
      .populate('subject', 'name code');

    res.status(200).json({
      success: true,
      message: 'Bulk attendance marked successfully',
      count: populatedRecords.length,
      data: populatedRecords
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to mark bulk attendance',
      error: error.message
    });
  }
};