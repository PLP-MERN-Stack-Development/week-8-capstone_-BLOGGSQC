const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/notes
// @desc    Get all notes with filtering
// @access  Private (Admin, Teacher, Student)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject,
      class: classId,
      teacher,
      type,
      search
    } = req.query;

    // Mock notes data for demonstration
    const mockNotes = [
      {
        _id: '1',
        title: 'Quadratic Equations - Complete Guide',
        description: 'Comprehensive notes covering all methods of solving quadratic equations',
        content: 'A quadratic equation is a polynomial equation of degree 2...',
        subject: { name: 'Mathematics', code: 'MATH101' },
        class: { name: 'Grade 10A' },
        teacher: { 
          user: { 
            name: 'Dr. Sarah Johnson',
            avatar: { url: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100' }
          }
        },
        type: 'lesson',
        tags: ['algebra', 'equations', 'mathematics'],
        attachments: [
          { name: 'quadratic-formulas.pdf', type: 'pdf', size: '2.5 MB' }
        ],
        views: 156,
        likes: 23,
        comments: 8,
        isPublic: true,
        createdAt: '2024-12-10',
        updatedAt: '2024-12-15'
      },
      {
        _id: '2',
        title: 'Newton\'s Laws of Motion',
        description: 'Detailed explanation of Newton\'s three laws of motion',
        content: 'Newton\'s first law states that an object at rest stays at rest...',
        subject: { name: 'Physics', code: 'PHY101' },
        class: { name: 'Grade 10A' },
        teacher: { 
          user: { 
            name: 'Prof. Michael Chen',
            avatar: { url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100' }
          }
        },
        type: 'lecture',
        tags: ['physics', 'motion', 'laws'],
        attachments: [
          { name: 'newton-laws-presentation.pptx', type: 'presentation', size: '5.8 MB' }
        ],
        views: 203,
        likes: 31,
        comments: 12,
        isPublic: true,
        createdAt: '2024-12-08',
        updatedAt: '2024-12-12'
      }
    ];

    res.json({
      status: 'success',
      message: 'Notes retrieved successfully',
      data: {
        notes: mockNotes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: 1,
          totalRecords: mockNotes.length
        }
      }
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve notes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get single note by ID
// @access  Private (Admin, Teacher, Student)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock note data
    const mockNote = {
      _id: id,
      title: 'Quadratic Equations - Complete Guide',
      description: 'Comprehensive notes covering all methods of solving quadratic equations',
      content: 'A quadratic equation is a polynomial equation of degree 2. The general form is ax² + bx + c = 0...',
      subject: { name: 'Mathematics', code: 'MATH101' },
      class: { name: 'Grade 10A' },
      teacher: { user: { name: 'Dr. Sarah Johnson' } },
      type: 'lesson',
      tags: ['algebra', 'equations', 'mathematics'],
      attachments: [],
      views: 156,
      likes: 23,
      comments: 8,
      isPublic: true,
      createdAt: '2024-12-10'
    };

    res.json({
      status: 'success',
      message: 'Note retrieved successfully',
      data: { note: mockNote }
    });

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/notes
// @desc    Create new note
// @access  Private (Admin, Teacher)
router.post('/', authorize('admin', 'teacher'), [
  body('title').trim().notEmpty().withMessage('Note title is required'),
  body('description').trim().notEmpty().withMessage('Note description is required'),
  body('content').trim().notEmpty().withMessage('Note content is required'),
  body('subjectId').isMongoId().withMessage('Valid subject ID is required'),
  body('classId').isMongoId().withMessage('Valid class ID is required'),
  body('type').isIn(['lesson', 'lecture', 'study-guide', 'assignment']).withMessage('Invalid note type')
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

    const noteData = req.body;

    // Mock note creation
    const newNote = {
      _id: Date.now().toString(),
      ...noteData,
      teacher: req.user._id,
      views: 0,
      likes: 0,
      comments: 0,
      isPublic: noteData.isPublic || false,
      createdAt: new Date()
    };

    res.status(201).json({
      status: 'success',
      message: 'Note created successfully',
      data: { note: newNote }
    });

  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private (Admin, Teacher - own notes)
router.put('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    res.json({
      status: 'success',
      message: 'Note updated successfully',
      data: { noteId: id, updates }
    });

  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private (Admin, Teacher - own notes)
router.delete('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      status: 'success',
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/notes/subject/:subjectId
// @desc    Get notes by subject
// @access  Private (Admin, Teacher, Student)
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Mock subject notes
    const mockNotes = [
      {
        _id: '1',
        title: 'Chapter 1: Introduction to Algebra',
        description: 'Basic concepts and fundamentals',
        type: 'lesson',
        createdAt: '2024-12-10'
      }
    ];

    res.json({
      status: 'success',
      message: 'Subject notes retrieved successfully',
      data: { notes: mockNotes }
    });

  } catch (error) {
    console.error('Get subject notes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve subject notes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;