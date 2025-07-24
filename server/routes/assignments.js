const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/assignments
// @desc    Get all assignments with filtering
// @access  Private (Admin, Teacher, Student)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject,
      class: classId,
      teacher,
      status,
      search
    } = req.query;

    // Mock assignments data for demonstration
    const mockAssignments = [
      {
        _id: '1',
        title: 'Quadratic Equations Problem Set',
        description: 'Solve the given quadratic equations using different methods',
        subject: { name: 'Mathematics', code: 'MATH101' },
        class: { name: 'Grade 10A' },
        teacher: { user: { name: 'Dr. Sarah Johnson' } },
        dueDate: '2024-12-20',
        maxMarks: 100,
        type: 'homework',
        status: 'active',
        totalStudents: 28,
        submittedCount: 15,
        gradedCount: 8,
        createdAt: '2024-12-10'
      },
      {
        _id: '2',
        title: 'Physics Lab Report',
        description: 'Write a comprehensive lab report on pendulum experiment',
        subject: { name: 'Physics', code: 'PHY101' },
        class: { name: 'Grade 10A' },
        teacher: { user: { name: 'Prof. Michael Chen' } },
        dueDate: '2024-12-25',
        maxMarks: 50,
        type: 'lab-report',
        status: 'active',
        totalStudents: 28,
        submittedCount: 8,
        gradedCount: 3,
        createdAt: '2024-12-12'
      }
    ];

    res.json({
      status: 'success',
      message: 'Assignments retrieved successfully',
      data: {
        assignments: mockAssignments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: 1,
          totalRecords: mockAssignments.length
        }
      }
    });

  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve assignments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get single assignment by ID
// @access  Private (Admin, Teacher, Student)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock assignment data
    const mockAssignment = {
      _id: id,
      title: 'Quadratic Equations Problem Set',
      description: 'Solve the given quadratic equations using different methods including factoring, completing the square, and quadratic formula.',
      content: 'Complete problems 1-20 from Chapter 5. Show all work and explain your reasoning.',
      subject: { name: 'Mathematics', code: 'MATH101' },
      class: { name: 'Grade 10A' },
      teacher: { user: { name: 'Dr. Sarah Johnson' } },
      dueDate: '2024-12-20',
      maxMarks: 100,
      type: 'homework',
      status: 'active',
      attachments: [
        { name: 'problem-set.pdf', type: 'pdf', size: '2.5 MB' }
      ],
      submissions: [],
      createdAt: '2024-12-10'
    };

    res.json({
      status: 'success',
      message: 'Assignment retrieved successfully',
      data: { assignment: mockAssignment }
    });

  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve assignment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Private (Admin, Teacher)
router.post('/', authorize('admin', 'teacher'), [
  body('title').trim().notEmpty().withMessage('Assignment title is required'),
  body('description').trim().notEmpty().withMessage('Assignment description is required'),
  body('subjectId').isMongoId().withMessage('Valid subject ID is required'),
  body('classId').isMongoId().withMessage('Valid class ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('maxMarks').isInt({ min: 1 }).withMessage('Max marks must be at least 1')
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

    const assignmentData = req.body;

    // Mock assignment creation
    const newAssignment = {
      _id: Date.now().toString(),
      ...assignmentData,
      teacher: req.user._id,
      status: 'active',
      createdAt: new Date(),
      submissions: []
    };

    res.status(201).json({
      status: 'success',
      message: 'Assignment created successfully',
      data: { assignment: newAssignment }
    });

  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create assignment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Private (Admin, Teacher - own assignments)
router.put('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    res.json({
      status: 'success',
      message: 'Assignment updated successfully',
      data: { assignmentId: id, updates }
    });

  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update assignment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private (Admin, Teacher - own assignments)
router.delete('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      status: 'success',
      message: 'Assignment deleted successfully'
    });

  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete assignment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit assignment
// @access  Private (Student)
router.post('/:id/submit', authorize('student'), [
  body('content').optional().trim(),
  body('attachments').optional().isArray()
], async (req, res) => {
  try {
    const { id } = req.params;
    const { content, attachments = [] } = req.body;

    res.json({
      status: 'success',
      message: 'Assignment submitted successfully',
      data: {
        assignmentId: id,
        studentId: req.user._id,
        submittedAt: new Date(),
        content,
        attachments
      }
    });

  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit assignment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;