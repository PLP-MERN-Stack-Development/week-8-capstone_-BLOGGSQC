const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (Admin, Teacher)
router.get('/dashboard', authorize('admin', 'teacher'), async (req, res) => {
  try {
    // Mock analytics data for demonstration
    const mockAnalytics = {
      overview: {
        totalStudents: 1247,
        totalTeachers: 89,
        totalClasses: 45,
        averageAttendance: 94.2,
        averageGrade: 85.7,
        improvementRate: 12.5
      },
      performance: {
        gradeDistribution: [
          { grade: 'A+', count: 156, percentage: 12.5 },
          { grade: 'A', count: 298, percentage: 23.9 },
          { grade: 'B+', count: 342, percentage: 27.4 },
          { grade: 'B', count: 267, percentage: 21.4 },
          { grade: 'C+', count: 134, percentage: 10.7 },
          { grade: 'C', count: 50, percentage: 4.0 }
        ],
        subjectPerformance: [
          { subject: 'Mathematics', average: 87.5, trend: 'up' },
          { subject: 'Physics', average: 82.3, trend: 'up' },
          { subject: 'Chemistry', average: 79.8, trend: 'down' },
          { subject: 'English', average: 88.9, trend: 'up' },
          { subject: 'History', average: 85.2, trend: 'stable' }
        ]
      },
      attendance: {
        monthlyTrend: [
          { month: 'Aug', rate: 92.1 },
          { month: 'Sep', rate: 94.5 },
          { month: 'Oct', rate: 93.8 },
          { month: 'Nov', rate: 95.2 },
          { month: 'Dec', rate: 94.2 }
        ],
        classWiseAttendance: [
          { class: 'Grade 10A', rate: 96.5, students: 30 },
          { class: 'Grade 10B', rate: 94.2, students: 28 },
          { class: 'Grade 11A', rate: 93.8, students: 25 },
          { class: 'Grade 11B', rate: 95.1, students: 27 }
        ]
      }
    };

    res.json({
      status: 'success',
      message: 'Dashboard analytics retrieved successfully',
      data: mockAnalytics
    });

  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve dashboard analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/student-performance
// @desc    Get student performance analytics
// @access  Private (Admin, Teacher)
router.get('/student-performance', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { classId, subjectId, period = 'month' } = req.query;

    // Mock student performance data
    const mockPerformance = {
      averageGPA: 3.45,
      topPerformers: [
        { name: 'Alice Johnson', gpa: 3.95, improvement: '+0.15' },
        { name: 'John Smith', gpa: 3.87, improvement: '+0.08' },
        { name: 'Bob Wilson', gpa: 3.76, improvement: '+0.22' }
      ],
      needsAttention: [
        { name: 'Maria Garcia', gpa: 2.45, decline: '-0.12' }
      ],
      subjectWisePerformance: [
        { subject: 'Mathematics', average: 87.5, students: 28 },
        { subject: 'Physics', average: 82.3, students: 28 },
        { subject: 'English', average: 88.9, students: 28 }
      ]
    };

    res.json({
      status: 'success',
      message: 'Student performance analytics retrieved successfully',
      data: mockPerformance
    });

  } catch (error) {
    console.error('Get student performance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve student performance analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/attendance
// @desc    Get attendance analytics
// @access  Private (Admin, Teacher)
router.get('/attendance', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { period = 'month', classId } = req.query;

    // Mock attendance analytics
    const mockAttendance = {
      overallRate: 94.2,
      trends: [
        { date: '2024-12-01', rate: 95.1 },
        { date: '2024-12-02', rate: 93.8 },
        { date: '2024-12-03', rate: 96.2 },
        { date: '2024-12-04', rate: 94.5 },
        { date: '2024-12-05', rate: 92.7 }
      ],
      classComparison: [
        { class: 'Grade 10A', rate: 96.5 },
        { class: 'Grade 10B', rate: 94.2 },
        { class: 'Grade 11A', rate: 93.8 }
      ]
    };

    res.json({
      status: 'success',
      message: 'Attendance analytics retrieved successfully',
      data: mockAttendance
    });

  } catch (error) {
    console.error('Get attendance analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve attendance analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/grades
// @desc    Get grade distribution analytics
// @access  Private (Admin, Teacher)
router.get('/grades', authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { subjectId, classId, period = 'semester' } = req.query;

    // Mock grade analytics
    const mockGrades = {
      distribution: [
        { grade: 'A+', count: 45, percentage: 15.2 },
        { grade: 'A', count: 78, percentage: 26.4 },
        { grade: 'B+', count: 89, percentage: 30.1 },
        { grade: 'B', count: 56, percentage: 18.9 },
        { grade: 'C+', count: 18, percentage: 6.1 },
        { grade: 'C', count: 10, percentage: 3.4 }
      ],
      trends: [
        { month: 'Sep', average: 82.1 },
        { month: 'Oct', average: 84.3 },
        { month: 'Nov', average: 85.7 },
        { month: 'Dec', average: 86.2 }
      ],
      subjectComparison: [
        { subject: 'Mathematics', average: 87.5 },
        { subject: 'Physics', average: 82.3 },
        { subject: 'English', average: 88.9 }
      ]
    };

    res.json({
      status: 'success',
      message: 'Grade analytics retrieved successfully',
      data: mockGrades
    });

  } catch (error) {
    console.error('Get grade analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve grade analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;