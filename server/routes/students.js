const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Student = require('../models/Student');
const User = require('../models/User');
const Class = require('../models/Class');
const { auth, authorize } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/students
// @desc    Get all students with filtering and pagination
// @access  Private (Admin, Teacher)
router.get('/', checkPermission('students', 'read'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('class').optional().isMongoId().withMessage('Class must be a valid ID'),
  query('search').optional().isLength({ min: 1 }).withMessage('Search term required'),
  query('grade').optional().isString().withMessage('Grade must be a string'),
  query('academicYear').optional().isString().withMessage('Academic year must be a string')
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

    const {
      page = 1,
      limit = 10,
      class: classId,
      search,
      grade,
      academicYear,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (classId) filter.class = classId;
    if (grade) filter['class.grade'] = grade;
    if (academicYear) filter.academicYear = academicYear;

    // Build aggregation pipeline
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: 'class',
          foreignField: '_id',
          as: 'class'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $unwind: '$class'
      }
    ];

    // Add search filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'user.name': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } },
            { rollNumber: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add sorting
    const sortField = sortBy === 'name' ? 'user.name' : sortBy;
    pipeline.push({
      $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 }
    });

    // Get total count for pagination
    const totalPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await Student.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Execute query
    const students = await Student.aggregate(pipeline);

    res.json({
      status: 'success',
      message: 'Students retrieved successfully',
      data: {
        students,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRecords: total,
          hasNext: skip + parseInt(limit) < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve students',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student by ID
// @access  Private (Admin, Teacher, Student - own record)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate('user', '-password')
      .populate('class')
      .populate('parents.user', '-password')
      .populate('academicRecord.awards');

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Check if user has permission to view this student
    if (req.user.role === 'student' && student.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You can only view your own record.'
      });
    }

    if (req.user.role === 'parent') {
      const isParent = student.parents.some(parent => 
        parent.user._id.toString() === req.user._id.toString()
      );
      if (!isParent) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. You can only view your child\'s record.'
        });
      }
    }

    res.json({
      status: 'success',
      message: 'Student retrieved successfully',
      data: { student }
    });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve student',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/students
// @desc    Create new student
// @access  Private (Admin only)
router.post('/', checkPermission('students', 'create'), [
  body('user.name').trim().notEmpty().withMessage('Student name is required'),
  body('user.email').isEmail().withMessage('Valid email is required'),
  body('user.password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('class').isMongoId().withMessage('Valid class ID is required'),
  body('rollNumber').notEmpty().withMessage('Roll number is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required'),
  body('admissionDate').isISO8601().withMessage('Valid admission date is required')
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

    const { user: userData, ...studentData } = req.body;

    // Check if class exists
    const classExists = await Class.findById(studentData.class);
    if (!classExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }

    // Check class capacity
    if (classExists.students.length >= classExists.capacity) {
      return res.status(400).json({
        status: 'error',
        message: 'Class is at full capacity'
      });
    }

    // Check if roll number already exists in the class
    const existingStudent = await Student.findOne({
      class: studentData.class,
      rollNumber: studentData.rollNumber
    });

    if (existingStudent) {
      return res.status(400).json({
        status: 'error',
        message: 'Roll number already exists in this class'
      });
    }

    // Create user account for student
    const user = new User({
      ...userData,
      role: 'student'
    });
    await user.save();

    // Create student record
    const student = new Student({
      ...studentData,
      user: user._id,
      metadata: {
        createdBy: req.user._id
      }
    });

    await student.save();

    // Add student to class
    await Class.findByIdAndUpdate(
      studentData.class,
      { $push: { students: student._id } }
    );

    // Populate the response
    await student.populate([
      { path: 'user', select: '-password' },
      { path: 'class' }
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Student created successfully',
      data: { student }
    });

  } catch (error) {
    console.error('Create student error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: 'error',
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create student',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin, Teacher - limited fields)
router.put('/:id', checkPermission('students', 'update'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Restrict what teachers can update
    if (req.user.role === 'teacher') {
      const allowedFields = ['notes', 'academicRecord', 'attendance', 'extracurricular'];
      const updateFields = Object.keys(updates);
      const isValidUpdate = updateFields.every(field => allowedFields.includes(field));
      
      if (!isValidUpdate) {
        return res.status(403).json({
          status: 'error',
          message: 'Teachers can only update academic records, attendance, and notes'
        });
      }
    }

    // Find student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Handle class change
    if (updates.class && updates.class !== student.class.toString()) {
      const newClass = await Class.findById(updates.class);
      if (!newClass) {
        return res.status(404).json({
          status: 'error',
          message: 'New class not found'
        });
      }

      if (newClass.students.length >= newClass.capacity) {
        return res.status(400).json({
          status: 'error',
          message: 'New class is at full capacity'
        });
      }

      // Remove from old class and add to new class
      await Class.findByIdAndUpdate(student.class, { $pull: { students: id } });
      await Class.findByIdAndUpdate(updates.class, { $push: { students: id } });
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        ...updates,
        'metadata.updatedBy': req.user._id
      },
      { new: true, runValidators: true }
    )
    .populate('user', '-password')
    .populate('class');

    res.json({
      status: 'success',
      message: 'Student updated successfully',
      data: { student: updatedStudent }
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update student',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete/deactivate student
// @access  Private (Admin only)
router.delete('/:id', checkPermission('students', 'delete'), async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    if (permanent) {
      // Permanent deletion
      await Student.findByIdAndDelete(id);
      await User.findByIdAndDelete(student.user);
      
      // Remove from class
      await Class.findByIdAndUpdate(
        student.class,
        { $pull: { students: id } }
      );

      res.json({
        status: 'success',
        message: 'Student permanently deleted'
      });
    } else {
      // Soft delete (deactivate)
      await Student.findByIdAndUpdate(id, { isActive: false });
      await User.findByIdAndUpdate(student.user, { isActive: false });

      res.json({
        status: 'success',
        message: 'Student deactivated successfully'
      });
    }

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete student',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/students/stats/overview
// @desc    Get student statistics overview
// @access  Private (Admin, Teacher)
router.get('/stats/overview', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { academicYear, classId } = req.query;

    const matchFilter = { isActive: true };
    if (academicYear) matchFilter.academicYear = academicYear;
    if (classId) matchFilter.class = mongoose.Types.ObjectId(classId);

    const stats = await Student.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: 'classes',
          localField: 'class',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      {
        $unwind: '$classInfo'
      },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          averageGPA: { $avg: '$academicRecord.gpa' },
          averageAttendance: { $avg: '$attendance.percentage' },
          maleStudents: {
            $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] }
          },
          femaleStudents: {
            $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] }
          },
          gradeDistribution: {
            $push: '$classInfo.grade'
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalStudents: 0,
      averageGPA: 0,
      averageAttendance: 0,
      maleStudents: 0,
      femaleStudents: 0,
      gradeDistribution: []
    };

    res.json({
      status: 'success',
      message: 'Student statistics retrieved successfully',
      data: { stats: result }
    });

  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve student statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/students/:id/attendance
// @desc    Update student attendance
// @access  Private (Admin, Teacher)
router.post('/:id/attendance', authorize('admin', 'teacher'), [
  body('isPresent').isBoolean().withMessage('isPresent must be boolean'),
  body('date').optional().isISO8601().withMessage('Date must be valid ISO date')
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

    const { id } = req.params;
    const { isPresent, date = new Date() } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Update attendance
    await student.updateAttendance(isPresent);

    res.json({
      status: 'success',
      message: 'Attendance updated successfully',
      data: {
        attendance: student.attendance
      }
    });

  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;