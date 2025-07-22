const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics based on user role
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const { role } = req.user;
    let stats = {};

    switch (role) {
      case 'admin':
        stats = await getAdminStats();
        break;
      case 'teacher':
        stats = await getTeacherStats(req.user._id);
        break;
      case 'student':
        stats = await getStudentStats(req.user._id);
        break;
      case 'parent':
        stats = await getParentStats(req.user._id);
        break;
      default:
        return res.status(403).json({
          status: 'error',
          message: 'Invalid user role'
        });
    }

    res.json({
      status: 'success',
      message: 'Dashboard statistics retrieved successfully',
      data: { stats }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Admin dashboard statistics
const getAdminStats = async () => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalUsers,
      activeStudents,
      inactiveStudents,
      recentStudents,
      attendanceStats,
      performanceStats,
      gradeDistribution
    ] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Teacher.countDocuments({ isActive: true }),
      Class.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Student.countDocuments({ isActive: true }),
      Student.countDocuments({ isActive: false }),
      Student.find({ isActive: true })
        .populate('user', 'name email')
        .populate('class', 'name grade')
        .sort({ createdAt: -1 })
        .limit(5),
      getAttendanceOverview(),
      getPerformanceOverview(),
      getGradeDistribution()
    ]);

    return {
      overview: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalUsers,
        activeStudents,
        inactiveStudents
      },
      recentActivity: {
        recentStudents
      },
      attendance: attendanceStats,
      performance: performanceStats,
      gradeDistribution
    };
  } catch (error) {
    throw new Error(`Failed to get admin stats: ${error.message}`);
  }
};

// Teacher dashboard statistics
const getTeacherStats = async (teacherId) => {
  try {
    const teacher = await Teacher.findOne({ user: teacherId })
      .populate('classes subjects');

    if (!teacher) {
      throw new Error('Teacher profile not found');
    }

    const teacherClasses = teacher.classes.map(cls => cls._id);

    const [
      totalStudents,
      totalClasses,
      totalSubjects,
      recentAssignments,
      attendanceStats,
      upcomingEvents
    ] = await Promise.all([
      Student.countDocuments({
        class: { $in: teacherClasses },
        isActive: true
      }),
      teacher.classes.length,
      teacher.subjects.length,
      // You would implement Assignment model and query here
      [],
      getTeacherAttendanceStats(teacherClasses),
      // You would implement events query here
      []
    ]);

    return {
      overview: {
        totalStudents,
        totalClasses,
        totalSubjects,
        totalAssignments: recentAssignments.length
      },
      classes: teacher.classes,
      subjects: teacher.subjects,
      attendance: attendanceStats,
      recentActivity: {
        assignments: recentAssignments
      },
      upcomingEvents
    };
  } catch (error) {
    throw new Error(`Failed to get teacher stats: ${error.message}`);
  }
};

// Student dashboard statistics
const getStudentStats = async (userId) => {
  try {
    const student = await Student.findOne({ user: userId })
      .populate('class', 'name grade section')
      .populate('user', 'name email');

    if (!student) {
      throw new Error('Student profile not found');
    }

    const [
      assignments,
      attendance,
      grades,
      upcomingEvents
    ] = await Promise.all([
      // You would implement Assignment queries here
      [],
      student.attendance,
      student.academicRecord,
      // You would implement events query here
      []
    ]);

    return {
      profile: {
        studentId: student.studentId,
        name: student.user.name,
        class: student.class,
        rollNumber: student.rollNumber
      },
      overview: {
        totalAssignments: assignments.length,
        pendingAssignments: assignments.filter(a => !a.submitted).length,
        attendancePercentage: attendance.percentage,
        currentGPA: grades.gpa || 0
      },
      attendance,
      academicRecord: grades,
      recentActivity: {
        assignments: assignments.slice(0, 5)
      },
      upcomingEvents
    };
  } catch (error) {
    throw new Error(`Failed to get student stats: ${error.message}`);
  }
};

// Parent dashboard statistics
const getParentStats = async (userId) => {
  try {
    const students = await Student.find({
      'parents.user': userId,
      isActive: true
    })
    .populate('class', 'name grade section')
    .populate('user', 'name email');

    if (!students.length) {
      throw new Error('No student records found for this parent');
    }

    const studentStats = await Promise.all(
      students.map(async (student) => {
        const [
          assignments,
          recentGrades
        ] = await Promise.all([
          // You would implement Assignment queries here
          [],
          // You would implement Grade queries here
          []
        ]);

        return {
          student: {
            id: student._id,
            name: student.user.name,
            studentId: student.studentId,
            class: student.class,
            rollNumber: student.rollNumber
          },
          overview: {
            attendancePercentage: student.attendance.percentage,
            currentGPA: student.academicRecord.gpa || 0,
            totalAssignments: assignments.length,
            pendingAssignments: assignments.filter(a => !a.submitted).length
          },
          recentActivity: {
            assignments: assignments.slice(0, 3),
            grades: recentGrades.slice(0, 3)
          }
        };
      })
    );

    return {
      overview: {
        totalChildren: students.length,
        avgAttendance: students.reduce((sum, s) => sum + s.attendance.percentage, 0) / students.length,
        avgGPA: students.reduce((sum, s) => sum + (s.academicRecord.gpa || 0), 0) / students.length
      },
      children: studentStats
    };
  } catch (error) {
    throw new Error(`Failed to get parent stats: ${error.message}`);
  }
};

// Helper functions for statistics
const getAttendanceOverview = async () => {
  try {
    const attendanceStats = await Student.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          avgAttendance: { $avg: '$attendance.percentage' },
          excellentAttendance: {
            $sum: {
              $cond: [{ $gte: ['$attendance.percentage', 95] }, 1, 0]
            }
          },
          goodAttendance: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$attendance.percentage', 85] },
                    { $lt: ['$attendance.percentage', 95] }
                  ]
                },
                1, 0
              ]
            }
          },
          poorAttendance: {
            $sum: {
              $cond: [{ $lt: ['$attendance.percentage', 75] }, 1, 0]
            }
          }
        }
      }
    ]);

    return attendanceStats[0] || {
      totalStudents: 0,
      avgAttendance: 0,
      excellentAttendance: 0,
      goodAttendance: 0,
      poorAttendance: 0
    };
  } catch (error) {
    console.error('Attendance overview error:', error);
    return {
      totalStudents: 0,
      avgAttendance: 0,
      excellentAttendance: 0,
      goodAttendance: 0,
      poorAttendance: 0
    };
  }
};

const getPerformanceOverview = async () => {
  try {
    const performanceStats = await Student.aggregate([
      { $match: { isActive: true, 'academicRecord.gpa': { $exists: true } } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          avgGPA: { $avg: '$academicRecord.gpa' },
          excellent: {
            $sum: {
              $cond: [{ $gte: ['$academicRecord.gpa', 3.5] }, 1, 0]
            }
          },
          good: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$academicRecord.gpa', 2.5] },
                    { $lt: ['$academicRecord.gpa', 3.5] }
                  ]
                },
                1, 0
              ]
            }
          },
          needsImprovement: {
            $sum: {
              $cond: [{ $lt: ['$academicRecord.gpa', 2.5] }, 1, 0]
            }
          }
        }
      }
    ]);

    return performanceStats[0] || {
      totalStudents: 0,
      avgGPA: 0,
      excellent: 0,
      good: 0,
      needsImprovement: 0
    };
  } catch (error) {
    console.error('Performance overview error:', error);
    return {
      totalStudents: 0,
      avgGPA: 0,
      excellent: 0,
      good: 0,
      needsImprovement: 0
    };
  }
};

const getGradeDistribution = async () => {
  try {
    const distribution = await Student.aggregate([
      { $match: { isActive: true } },
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
          _id: '$classInfo.grade',
          count: { $sum: 1 },
          avgGPA: { $avg: '$academicRecord.gpa' },
          avgAttendance: { $avg: '$attendance.percentage' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return distribution;
  } catch (error) {
    console.error('Grade distribution error:', error);
    return [];
  }
};

const getTeacherAttendanceStats = async (classIds) => {
  try {
    const stats = await Student.aggregate([
      {
        $match: {
          class: { $in: classIds },
          isActive: true
        }
      },
      {
        $group: {
          _id: '$class',
          totalStudents: { $sum: 1 },
          avgAttendance: { $avg: '$attendance.percentage' },
          presentToday: {
            $sum: {
              $cond: [{ $gte: ['$attendance.percentage', 90] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      {
        $unwind: '$classInfo'
      }
    ]);

    return stats;
  } catch (error) {
    console.error('Teacher attendance stats error:', error);
    return [];
  }
};

// @route   GET /api/dashboard/recent-activity
// @desc    Get recent activity feed
// @access  Private
router.get('/recent-activity', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const { role, _id: userId } = req.user;

    let activities = [];

    // Get different activity types based on user role
    if (role === 'admin' || role === 'teacher') {
      // Recent student registrations
      const recentStudents = await Student.find({ isActive: true })
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit) / 2);

      activities = [
        ...recentStudents.map(student => ({
          type: 'student_registration',
          message: `New student ${student.user.name} registered`,
          timestamp: student.createdAt,
          data: { studentId: student._id, studentName: student.user.name }
        }))
      ];
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    activities = activities.slice(0, parseInt(limit));

    res.json({
      status: 'success',
      message: 'Recent activity retrieved successfully',
      data: { activities }
    });

  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve recent activity',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/dashboard/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', async (req, res) => {
  try {
    const { unread = false } = req.query;
    const userId = req.user._id;

    // This would typically come from a Notifications model
    // For now, return mock notifications based on user role
    const notifications = getMockNotifications(req.user.role);

    res.json({
      status: 'success',
      message: 'Notifications retrieved successfully',
      data: { notifications }
    });

  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Mock notifications helper
const getMockNotifications = (role) => {
  const baseNotifications = [
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight from 2-4 AM',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ];

  switch (role) {
    case 'admin':
      return [
        ...baseNotifications,
        {
          id: '2',
          title: 'New Teacher Registration',
          message: 'John Smith has registered as a new teacher',
          type: 'user',
          read: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ];
    case 'teacher':
      return [
        ...baseNotifications,
        {
          id: '3',
          title: 'Assignment Due',
          message: '5 students haven\'t submitted Math homework',
          type: 'assignment',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000)
        }
      ];
    case 'student':
      return [
        ...baseNotifications,
        {
          id: '4',
          title: 'New Assignment',
          message: 'Science project due next Friday',
          type: 'assignment',
          read: false,
          createdAt: new Date(Date.now() - 15 * 60 * 1000)
        }
      ];
    default:
      return baseNotifications;
  }
};

module.exports = router;