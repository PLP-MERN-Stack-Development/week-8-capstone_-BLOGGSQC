import { Response } from 'express';
import User from '../models/User';
import Class from '../models/Class';
import { AuthRequest } from '../middleware/auth';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;

    // Base stats for all roles
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalTeachers = await User.countDocuments({ role: 'teacher', isActive: true });
    const totalClasses = await Class.countDocuments({ isActive: true });

    let stats: any = {
      totalStudents,
      totalTeachers,
      totalClasses,
      attendanceRate: 92.5, // Mock data - would come from attendance records
      averageGrade: 86.2, // Mock data - would come from grade records
    };

    // Role-specific stats
    if (userRole === 'admin') {
      const totalParents = await User.countDocuments({ role: 'parent', isActive: true });
      const totalUsers = await User.countDocuments({ isActive: true });
      
      stats = {
        ...stats,
        totalParents,
        totalUsers,
        systemHealth: 'Good',
        activeUsers: 1156, // Mock data
        pendingApprovals: 23, // Mock data
      };
    } else if (userRole === 'teacher') {
      // Teacher-specific stats
      const myClasses = await Class.countDocuments({ 
        teacher: req.user?.userId, 
        isActive: true 
      });
      
      stats = {
        ...stats,
        myClasses,
        myStudents: 85, // Mock data - would calculate from teacher's classes
        pendingAssignments: 12, // Mock data
        gradingQueue: 8, // Mock data
      };
    } else if (userRole === 'student') {
      // Student-specific stats
      stats = {
        totalSubjects: 6, // Mock data
        completedAssignments: 24, // Mock data
        pendingAssignments: 3, // Mock data
        currentGrade: 'A-', // Mock data
        attendanceRate: 94.2, // Mock data
      };
    } else if (userRole === 'parent') {
      // Parent-specific stats
      stats = {
        children: 2, // Mock data
        upcomingEvents: 4, // Mock data
        recentGrades: 8, // Mock data
        attendanceAlerts: 1, // Mock data
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/recent-activity
// @access  Private
export const getRecentActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;

    // Mock recent activity data - in real app, this would come from various collections
    let activities: any[] = [];

    if (userRole === 'admin') {
      activities = [
        {
          id: '1',
          type: 'user_registration',
          title: 'New teacher registered',
          description: 'Dr. Sarah Johnson joined as Mathematics teacher',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          icon: 'user-plus',
          priority: 'medium'
        },
        {
          id: '2',
          type: 'system_alert',
          title: 'System backup completed',
          description: 'Daily backup completed successfully',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          icon: 'database',
          priority: 'low'
        },
        {
          id: '3',
          type: 'fee_payment',
          title: 'Fee payment received',
          description: 'Payment of $1,500 received from John Doe',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          icon: 'dollar-sign',
          priority: 'high'
        }
      ];
    } else if (userRole === 'teacher') {
      activities = [
        {
          id: '1',
          type: 'assignment_submission',
          title: 'New assignment submission',
          description: 'Alex Johnson submitted Mathematics homework',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          icon: 'file-text',
          priority: 'medium'
        },
        {
          id: '2',
          type: 'attendance_marked',
          title: 'Attendance marked',
          description: 'Attendance marked for Class 10-A',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          icon: 'check-circle',
          priority: 'low'
        }
      ];
    } else if (userRole === 'student') {
      activities = [
        {
          id: '1',
          type: 'grade_updated',
          title: 'Grade updated',
          description: 'Mathematics quiz grade: A-',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          icon: 'award',
          priority: 'high'
        },
        {
          id: '2',
          type: 'assignment_due',
          title: 'Assignment due reminder',
          description: 'English essay due tomorrow',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          icon: 'clock',
          priority: 'medium'
        }
      ];
    } else if (userRole === 'parent') {
      activities = [
        {
          id: '1',
          type: 'attendance_alert',
          title: 'Attendance alert',
          description: 'Emma was marked absent today',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          icon: 'alert-triangle',
          priority: 'high'
        },
        {
          id: '2',
          type: 'grade_notification',
          title: 'New grade posted',
          description: 'Emma received A+ in Science test',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          icon: 'star',
          priority: 'medium'
        }
      ];
    }

    res.json({
      success: true,
      data: activities
    });
  } catch (error: any) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};