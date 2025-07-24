const express = require('express');
const { body, validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/teachers
// @desc    Get all teachers with filtering and pagination
// @access  Private (Admin, Teacher)
router.get('/', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      department,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (department) filter.department = department;

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
          from: 'subjects',
          localField: 'subjects',
          foreignField: '_id',
          as: 'subjects'
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: 'classes',
          foreignField: '_id',
          as: 'classes'
        }
      },
      {
        $unwind: '$user'
      }
    ];

    // Add search filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'user.name': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } },
            { employeeId: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } }
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
    const totalResult = await Teacher.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Execute query
    const teachers = await Teacher.aggregate(pipeline);

    res.json({
      status: 'success',
      message: 'Teachers retrieved successfully',
      data: {
        teachers,
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
    console.error('Get teachers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve teachers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/teachers/:id
// @desc    Get single teacher by ID
// @access  Private (Admin, Teacher - own record)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id)
      .populate('user', '-password')
      .populate('subjects')
      .populate('classes');

    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found'
      });
    }

    // Check if user has permission to view this teacher
    if (req.user.role === 'teacher' && teacher.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You can only view your own record.'
      });
    }

    res.json({
      status: 'success',
      message: 'Teacher retrieved successfully',
      data: { teacher }
    });

  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve teacher',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/teachers
// @desc    Create new teacher
// @access  Private (Admin only)
router.post('/', authorize('admin'), [
  body('user.name').trim().notEmpty().withMessage('Teacher name is required'),
  body('user.email').isEmail().withMessage('Valid email is required'),
  body('user.password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('department').notEmpty().withMessage('Department is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required')
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

    const { user: userData, ...teacherData } = req.body;

    // Create user account for teacher
    const user = new User({
      ...userData,
      role: 'teacher'
    });
    await user.save();

    // Create teacher record
    const teacher = new Teacher({
      ...teacherData,
      user: user._id,
      metadata: {
        createdBy: req.user._id
      }
    });

    await teacher.save();

    // Populate the response
    await teacher.populate([
      { path: 'user', select: '-password' },
      { path: 'subjects' },
      { path: 'classes' }
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Teacher created successfully',
      data: { teacher }
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: 'error',
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create teacher',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/teachers/:id
// @desc    Update teacher
// @access  Private (Admin, Teacher - own record)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find teacher
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found'
      });
    }

    // Check permissions
    if (req.user.role === 'teacher' && teacher.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You can only update your own record.'
      });
    }

    // Update teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        ...updates,
        'metadata.updatedBy': req.user._id
      },
      { new: true, runValidators: true }
    )
    .populate('user', '-password')
    .populate('subjects')
    .populate('classes');

    res.json({
      status: 'success',
      message: 'Teacher updated successfully',
      data: { teacher: updatedTeacher }
    });

  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update teacher',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/teachers/:id
// @desc    Delete/deactivate teacher
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found'
      });
    }

    if (permanent) {
      // Permanent deletion
      await Teacher.findByIdAndDelete(id);
      await User.findByIdAndDelete(teacher.user);

      res.json({
        status: 'success',
        message: 'Teacher permanently deleted'
      });
    } else {
      // Soft delete (deactivate)
      await Teacher.findByIdAndUpdate(id, { isActive: false });
      await User.findByIdAndUpdate(teacher.user, { isActive: false });

      res.json({
        status: 'success',
        message: 'Teacher deactivated successfully'
      });
    }

  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete teacher',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/teachers/stats/overview
// @desc    Get teacher statistics overview
// @access  Private (Admin)
router.get('/stats/overview', authorize('admin'), async (req, res) => {
  try {
    const stats = await Teacher.getDepartmentStats();

    const totalTeachers = await Teacher.countDocuments({ isActive: true });
    const avgRating = await Teacher.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgRating: { $avg: '$performance.rating' } } }
    ]);

    res.json({
      status: 'success',
      message: 'Teacher statistics retrieved successfully',
      data: {
        totalTeachers,
        averageRating: avgRating[0]?.avgRating || 0,
        departmentStats: stats
      }
    });

  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve teacher statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;