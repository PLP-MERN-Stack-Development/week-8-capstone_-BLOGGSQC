const express = require('express');
const { body, validationResult } = require('express-validator');
const Subject = require('../models/Subject');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/subjects
// @desc    Get all subjects with filtering and pagination
// @access  Private (Admin, Teacher, Student)
router.get('/', authorize('admin', 'teacher', 'student'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      department,
      grade,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (department) filter.department = department;
    if (grade) filter.grade = grade;
    if (type) filter.type = type;

    // Build aggregation pipeline
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'teachers',
          localField: 'teachers.teacher',
          foreignField: '_id',
          as: 'teacherDetails',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' }
          ]
        }
      }
    ];

    // Add search filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add sorting
    pipeline.push({
      $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    });

    // Get total count for pagination
    const totalPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await Subject.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Execute query
    const subjects = await Subject.aggregate(pipeline);

    res.json({
      status: 'success',
      message: 'Subjects retrieved successfully',
      data: {
        subjects,
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
    console.error('Get subjects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve subjects',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/subjects/:id
// @desc    Get single subject by ID
// @access  Private (Admin, Teacher, Student)
router.get('/:id', authorize('admin', 'teacher', 'student'), async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id)
      .populate({
        path: 'teachers.teacher',
        populate: {
          path: 'user',
          select: '-password'
        }
      })
      .populate('prerequisites');

    if (!subject) {
      return res.status(404).json({
        status: 'error',
        message: 'Subject not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Subject retrieved successfully',
      data: { subject }
    });

  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve subject',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/subjects
// @desc    Create new subject
// @access  Private (Admin only)
router.post('/', authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Subject name is required'),
  body('code').trim().notEmpty().withMessage('Subject code is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('credits').isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
  body('grade').notEmpty().withMessage('Grade level is required'),
  body('schedule.hoursPerWeek').isInt({ min: 1 }).withMessage('Hours per week must be at least 1'),
  body('schedule.totalHours').isInt({ min: 1 }).withMessage('Total hours must be at least 1')
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

    const subjectData = req.body;

    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ code: subjectData.code });
    if (existingSubject) {
      return res.status(400).json({
        status: 'error',
        message: 'Subject code already exists'
      });
    }

    // Create new subject
    const subject = new Subject({
      ...subjectData,
      metadata: {
        createdBy: req.user._id
      }
    });

    await subject.save();

    // Populate the response
    await subject.populate([
      {
        path: 'teachers.teacher',
        populate: {
          path: 'user',
          select: '-password'
        }
      },
      'prerequisites'
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Subject created successfully',
      data: { subject }
    });

  } catch (error) {
    console.error('Create subject error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Subject code already exists'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create subject',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/subjects/:id
// @desc    Update subject
// @access  Private (Admin only)
router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find subject
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        status: 'error',
        message: 'Subject not found'
      });
    }

    // Update subject
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        ...updates,
        'metadata.updatedBy': req.user._id
      },
      { new: true, runValidators: true }
    )
    .populate({
      path: 'teachers.teacher',
      populate: {
        path: 'user',
        select: '-password'
      }
    })
    .populate('prerequisites');

    res.json({
      status: 'success',
      message: 'Subject updated successfully',
      data: { subject: updatedSubject }
    });

  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update subject',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/subjects/:id
// @desc    Delete/deactivate subject
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        status: 'error',
        message: 'Subject not found'
      });
    }

    if (permanent) {
      // Permanent deletion
      await Subject.findByIdAndDelete(id);

      res.json({
        status: 'success',
        message: 'Subject permanently deleted'
      });
    } else {
      // Soft delete (deactivate)
      await Subject.findByIdAndUpdate(id, { isActive: false });

      res.json({
        status: 'success',
        message: 'Subject deactivated successfully'
      });
    }

  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete subject',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/subjects/stats/department/:department
// @desc    Get subject statistics by department
// @access  Private (Admin)
router.get('/stats/department/:department', authorize('admin'), async (req, res) => {
  try {
    const { department } = req.params;

    const stats = await Subject.getDepartmentStats(department);

    res.json({
      status: 'success',
      message: 'Subject statistics retrieved successfully',
      data: { stats }
    });

  } catch (error) {
    console.error('Get subject stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve subject statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/subjects/:id/teachers
// @desc    Assign teacher to subject
// @access  Private (Admin)
router.post('/:id/teachers', authorize('admin'), [
  body('teacherId').isMongoId().withMessage('Valid teacher ID is required'),
  body('classIds').optional().isArray().withMessage('Class IDs must be an array')
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
    const { teacherId, classIds = [] } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        status: 'error',
        message: 'Subject not found'
      });
    }

    await subject.assignTeacher(teacherId, classIds);

    res.json({
      status: 'success',
      message: 'Teacher assigned to subject successfully'
    });

  } catch (error) {
    console.error('Assign teacher error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to assign teacher to subject',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/subjects/:id/teachers/:teacherId
// @desc    Remove teacher from subject
// @access  Private (Admin)
router.delete('/:id/teachers/:teacherId', authorize('admin'), async (req, res) => {
  try {
    const { id, teacherId } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        status: 'error',
        message: 'Subject not found'
      });
    }

    await subject.removeTeacher(teacherId);

    res.json({
      status: 'success',
      message: 'Teacher removed from subject successfully'
    });

  } catch (error) {
    console.error('Remove teacher error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove teacher from subject',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;