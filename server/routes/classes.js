const express = require('express');
const { body, validationResult } = require('express-validator');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/classes
// @desc    Get all classes with filtering and pagination
// @access  Private (Admin, Teacher)
router.get('/', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      grade,
      academicYear,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (grade) filter.grade = grade;
    if (academicYear) filter.academicYear = academicYear;

    // Build aggregation pipeline
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'teachers',
          localField: 'classTeacher',
          foreignField: '_id',
          as: 'classTeacher',
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
      },
      {
        $lookup: {
          from: 'students',
          localField: 'students',
          foreignField: '_id',
          as: 'students'
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subjects.subject',
          foreignField: '_id',
          as: 'subjectDetails'
        }
      },
      {
        $unwind: '$classTeacher'
      }
    ];

    // Add search filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { grade: { $regex: search, $options: 'i' } },
            { section: { $regex: search, $options: 'i' } },
            { 'classTeacher.user.name': { $regex: search, $options: 'i' } }
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
    const totalResult = await Class.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Execute query
    const classes = await Class.aggregate(pipeline);

    res.json({
      status: 'success',
      message: 'Classes retrieved successfully',
      data: {
        classes,
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
    console.error('Get classes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve classes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/classes/:id
// @desc    Get single class by ID
// @access  Private (Admin, Teacher)
router.get('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;

    const classData = await Class.findById(id)
      .populate({
        path: 'classTeacher',
        populate: {
          path: 'user',
          select: '-password'
        }
      })
      .populate({
        path: 'students',
        populate: {
          path: 'user',
          select: '-password'
        }
      })
      .populate('subjects.subject')
      .populate({
        path: 'subjects.teacher',
        populate: {
          path: 'user',
          select: '-password'
        }
      });

    if (!classData) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Class retrieved successfully',
      data: { class: classData }
    });

  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve class',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/classes
// @desc    Create new class
// @access  Private (Admin only)
router.post('/', authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Class name is required'),
  body('grade').notEmpty().withMessage('Grade is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required'),
  body('classTeacher').isMongoId().withMessage('Valid class teacher ID is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
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

    const classData = req.body;

    // Check if class teacher exists
    const teacher = await Teacher.findById(classData.classTeacher);
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Class teacher not found'
      });
    }

    // Check if class with same grade, section, and academic year already exists
    const existingClass = await Class.findOne({
      grade: classData.grade,
      section: classData.section,
      academicYear: classData.academicYear
    });

    if (existingClass) {
      return res.status(400).json({
        status: 'error',
        message: 'Class with same grade, section, and academic year already exists'
      });
    }

    // Create new class
    const newClass = new Class({
      ...classData,
      metadata: {
        createdBy: req.user._id
      }
    });

    await newClass.save();

    // Populate the response
    await newClass.populate([
      {
        path: 'classTeacher',
        populate: {
          path: 'user',
          select: '-password'
        }
      },
      'subjects.subject',
      {
        path: 'subjects.teacher',
        populate: {
          path: 'user',
          select: '-password'
        }
      }
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Class created successfully',
      data: { class: newClass }
    });

  } catch (error) {
    console.error('Create class error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Class with this grade, section, and academic year already exists'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create class',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/classes/:id
// @desc    Update class
// @access  Private (Admin only)
router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find class
    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }

    // Update class
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        ...updates,
        'metadata.updatedBy': req.user._id
      },
      { new: true, runValidators: true }
    )
    .populate({
      path: 'classTeacher',
      populate: {
        path: 'user',
        select: '-password'
      }
    })
    .populate({
      path: 'students',
      populate: {
        path: 'user',
        select: '-password'
      }
    })
    .populate('subjects.subject')
    .populate({
      path: 'subjects.teacher',
      populate: {
        path: 'user',
        select: '-password'
      }
    });

    res.json({
      status: 'success',
      message: 'Class updated successfully',
      data: { class: updatedClass }
    });

  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update class',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/classes/:id
// @desc    Delete/deactivate class
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }

    if (permanent) {
      // Check if class has students
      if (classData.students && classData.students.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete class with enrolled students'
        });
      }

      // Permanent deletion
      await Class.findByIdAndDelete(id);

      res.json({
        status: 'success',
        message: 'Class permanently deleted'
      });
    } else {
      // Soft delete (deactivate)
      await Class.findByIdAndUpdate(id, { isActive: false });

      res.json({
        status: 'success',
        message: 'Class deactivated successfully'
      });
    }

  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete class',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/classes/stats/overview
// @desc    Get class statistics overview
// @access  Private (Admin)
router.get('/stats/overview', authorize('admin'), async (req, res) => {
  try {
    const { academicYear } = req.query;

    const stats = await Class.getClassStats(academicYear);

    res.json({
      status: 'success',
      message: 'Class statistics retrieved successfully',
      data: { stats }
    });

  } catch (error) {
    console.error('Get class stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve class statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/classes/:id/students
// @desc    Add student to class
// @access  Private (Admin)
router.post('/:id/students', authorize('admin'), [
  body('studentId').isMongoId().withMessage('Valid student ID is required')
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
    const { studentId } = req.body;

    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({
        status: 'error',
        message: 'Class not found'
      });
    }

    await classData.addStudent(studentId);

    res.json({
      status: 'success',
      message: 'Student added to class successfully'
    });

  } catch (error) {
    console.error('Add student to class error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to add student to class',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;