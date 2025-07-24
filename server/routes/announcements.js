const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/announcements
// @desc    Get all announcements with filtering
// @access  Private (All roles)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      priority,
      search,
      targetAudience
    } = req.query;

    // Mock announcements data for demonstration
    const mockAnnouncements = [
      {
        _id: '1',
        title: 'Parent-Teacher Conference Scheduled',
        content: 'We are pleased to announce that the Parent-Teacher Conference for this semester will be held on December 22-23, 2024.',
        type: 'event',
        priority: 'high',
        author: {
          user: { 
            name: 'Dr. Sarah Johnson',
            avatar: { url: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100' }
          },
          role: 'admin'
        },
        targetAudience: ['parents', 'teachers'],
        isPinned: true,
        isPublished: true,
        publishDate: '2024-12-15',
        expiryDate: '2024-12-25',
        views: 342,
        likes: 28,
        attachments: [
          { name: 'conference-schedule.pdf', type: 'pdf', size: '1.2 MB' }
        ],
        createdAt: '2024-12-15'
      },
      {
        _id: '2',
        title: 'Winter Break Holiday Notice',
        content: 'School will be closed for Winter Break from December 25, 2024 to January 8, 2025.',
        type: 'holiday',
        priority: 'medium',
        author: {
          user: { 
            name: 'System Administrator',
            avatar: { url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100' }
          },
          role: 'admin'
        },
        targetAudience: ['students', 'parents', 'teachers'],
        isPinned: true,
        isPublished: true,
        publishDate: '2024-12-10',
        expiryDate: '2025-01-10',
        views: 567,
        likes: 45,
        attachments: [],
        createdAt: '2024-12-10'
      }
    ];

    res.json({
      status: 'success',
      message: 'Announcements retrieved successfully',
      data: {
        announcements: mockAnnouncements,
        pagination: {
          currentPage: parseInt(page),
          totalPages: 1,
          totalRecords: mockAnnouncements.length
        }
      }
    });

  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve announcements',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/announcements/:id
// @desc    Get single announcement by ID
// @access  Private (All roles)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock announcement data
    const mockAnnouncement = {
      _id: id,
      title: 'Parent-Teacher Conference Scheduled',
      content: 'We are pleased to announce that the Parent-Teacher Conference for this semester will be held on December 22-23, 2024. Please check your email for your scheduled appointment time.',
      type: 'event',
      priority: 'high',
      author: { user: { name: 'Dr. Sarah Johnson' } },
      targetAudience: ['parents', 'teachers'],
      isPinned: true,
      isPublished: true,
      publishDate: '2024-12-15',
      views: 342,
      likes: 28,
      createdAt: '2024-12-15'
    };

    res.json({
      status: 'success',
      message: 'Announcement retrieved successfully',
      data: { announcement: mockAnnouncement }
    });

  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve announcement',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Private (Admin, Teacher)
router.post('/', authorize('admin', 'teacher'), [
  body('title').trim().notEmpty().withMessage('Announcement title is required'),
  body('content').trim().notEmpty().withMessage('Announcement content is required'),
  body('type').isIn(['event', 'holiday', 'academic', 'general']).withMessage('Invalid announcement type'),
  body('priority').isIn(['high', 'medium', 'low']).withMessage('Invalid priority level'),
  body('targetAudience').isArray().withMessage('Target audience must be an array')
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

    const announcementData = req.body;

    // Mock announcement creation
    const newAnnouncement = {
      _id: Date.now().toString(),
      ...announcementData,
      author: req.user._id,
      views: 0,
      likes: 0,
      isPinned: false,
      isPublished: true,
      publishDate: new Date(),
      createdAt: new Date()
    };

    res.status(201).json({
      status: 'success',
      message: 'Announcement created successfully',
      data: { announcement: newAnnouncement }
    });

  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create announcement',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private (Admin, Teacher - own announcements)
router.put('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    res.json({
      status: 'success',
      message: 'Announcement updated successfully',
      data: { announcementId: id, updates }
    });

  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update announcement',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (Admin, Teacher - own announcements)
router.delete('/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      status: 'success',
      message: 'Announcement deleted successfully'
    });

  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete announcement',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;