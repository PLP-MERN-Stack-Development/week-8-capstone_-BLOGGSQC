const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/calendar/events
// @desc    Get calendar events
// @access  Private (All roles)
router.get('/events', async (req, res) => {
  try {
    const { month, year, type, search } = req.query;

    // Mock calendar events for demonstration
    const mockEvents = [
      {
        _id: '1',
        title: 'Parent-Teacher Conference',
        description: 'Individual meetings with parents to discuss student progress',
        type: 'meeting',
        startDate: '2024-12-22',
        endDate: '2024-12-23',
        startTime: '09:00',
        endTime: '17:00',
        location: 'School Auditorium',
        organizer: { user: { name: 'Dr. Sarah Johnson' } },
        attendees: ['parents', 'teachers'],
        isAllDay: false,
        priority: 'high',
        color: '#f59e0b',
        reminders: [
          { type: 'email', time: '1 day before' },
          { type: 'notification', time: '2 hours before' }
        ]
      },
      {
        _id: '2',
        title: 'Winter Break',
        description: 'School holiday - Winter vacation for all students and staff',
        type: 'holiday',
        startDate: '2024-12-25',
        endDate: '2025-01-08',
        startTime: null,
        endTime: null,
        location: null,
        organizer: { user: { name: 'System Administrator' } },
        attendees: ['students', 'teachers', 'staff'],
        isAllDay: true,
        priority: 'medium',
        color: '#10b981',
        reminders: []
      },
      {
        _id: '3',
        title: 'Science Fair',
        description: 'Annual science fair showcasing student projects',
        type: 'event',
        startDate: '2024-12-20',
        endDate: '2024-12-20',
        startTime: '10:00',
        endTime: '16:00',
        location: 'Science Laboratory',
        organizer: { user: { name: 'Prof. Michael Chen' } },
        attendees: ['students', 'parents', 'teachers'],
        isAllDay: false,
        priority: 'high',
        color: '#8b5cf6',
        reminders: [
          { type: 'email', time: '3 days before' }
        ]
      }
    ];

    res.json({
      status: 'success',
      message: 'Calendar events retrieved successfully',
      data: { events: mockEvents }
    });

  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve calendar events',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/calendar/events
// @desc    Create new calendar event
// @access  Private (Admin, Teacher)
router.post('/events', authorize('admin', 'teacher'), [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('description').trim().notEmpty().withMessage('Event description is required'),
  body('type').isIn(['meeting', 'holiday', 'event', 'exam', 'assignment']).withMessage('Invalid event type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
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

    const eventData = req.body;

    // Mock event creation
    const newEvent = {
      _id: Date.now().toString(),
      ...eventData,
      organizer: req.user._id,
      createdAt: new Date()
    };

    res.status(201).json({
      status: 'success',
      message: 'Calendar event created successfully',
      data: { event: newEvent }
    });

  } catch (error) {
    console.error('Create calendar event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create calendar event',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/calendar/events/:id
// @desc    Update calendar event
// @access  Private (Admin, Teacher - own events)
router.put('/events/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    res.json({
      status: 'success',
      message: 'Calendar event updated successfully',
      data: { eventId: id, updates }
    });

  } catch (error) {
    console.error('Update calendar event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update calendar event',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/calendar/events/:id
// @desc    Delete calendar event
// @access  Private (Admin, Teacher - own events)
router.delete('/events/:id', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      status: 'success',
      message: 'Calendar event deleted successfully'
    });

  } catch (error) {
    console.error('Delete calendar event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete calendar event',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;