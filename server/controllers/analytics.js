import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';
import Grade from '../models/Grade.js';
import Assignment from '../models/Assignment.js';

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin/Teacher
export const getDashboardStats = async (req, res) => {
  try {
    // Basic counts
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const totalTeachers = await Teacher.countDocuments({ status: 'active' });
    const totalClasses = await Class.countDocuments({ isActive: true });

    // Attendance statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    });

    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
    const lateToday = todayAttendance.filter(a => a.status === 'late').length;

    const attendanceRate = totalStudents > 0 ? 
      Math.round((presentToday / totalStudents) * 100) : 0;

    // Recent grades
    const recentGrades = await Grade.find()
      .populate('student', 'user')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('subject', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Chart data for attendance over the last 7 days
    const attendanceChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayAttendance = await Attendance.find({
        date: { $gte: date, $lt: nextDay }
      });

      const presentCount = dayAttendance.filter(a => a.status === 'present').length;
      const attendancePercentage = totalStudents > 0 ? 
        Math.round((presentCount / totalStudents) * 100) : 0;

      attendanceChart.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: attendancePercentage
      });
    }

    // Grade distribution chart
    const allGrades = await Grade.find();
    const gradeChart = [
      { name: 'A (90-100)', value: allGrades.filter(g => g.percentage >= 90).length },
      { name: 'B (80-89)', value: allGrades.filter(g => g.percentage >= 80 && g.percentage < 90).length },
      { name: 'C (70-79)', value: allGrades.filter(g => g.percentage >= 70 && g.percentage < 80).length },
      { name: 'D (60-69)', value: allGrades.filter(g => g.percentage >= 60 && g.percentage < 70).length },
      { name: 'F (0-59)', value: allGrades.filter(g => g.percentage < 60).length }
    ];

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalClasses,
        attendanceRate,
        presentToday,
        absentToday,
        lateToday,
        recentGrades,
        attendanceChart,
        gradeChart
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/analytics/attendance
// @access  Private/Admin/Teacher
export const getAttendanceStats = async (req, res) => {
  try {
    const { timeRange } = req.query;
    
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'term':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const attendance = await Attendance.find({
      date: { $gte: startDate }
    }).populate('student', 'user')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    const totalRecords = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;

    const averageAttendance = totalRecords > 0 ? 
      Math.round((presentCount / totalRecords) * 100) : 0;

    // Chart data
    const chartData = [];
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayAttendance = attendance.filter(a => 
        a.date >= date && a.date < nextDay
      );

      const dayPresent = dayAttendance.filter(a => a.status === 'present').length;
      const dayTotal = dayAttendance.length;
      const percentage = dayTotal > 0 ? Math.round((dayPresent / dayTotal) * 100) : 0;

      chartData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: percentage
      });
    }

    res.status(200).json({
      success: true,
      data: {
        averageAttendance,
        presentToday: presentCount,
        absentToday: absentCount,
        lateToday: lateCount,
        chartData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get grade statistics
// @route   GET /api/analytics/grades
// @access  Private/Admin/Teacher
export const getGradeStats = async (req, res) => {
  try {
    const { timeRange } = req.query;
    
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'term':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const grades = await Grade.find({
      createdAt: { $gte: startDate }
    }).populate('student', 'user')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('subject', 'name');

    const classAverage = grades.length > 0 ? 
      Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length) : 0;

    const topPerformers = grades.filter(g => g.percentage >= 90).length;
    const failing = grades.filter(g => g.percentage < 60).length;
    const graded = grades.length;

    // Chart data
    const chartData = [
      { name: 'A (90-100)', value: grades.filter(g => g.percentage >= 90).length },
      { name: 'B (80-89)', value: grades.filter(g => g.percentage >= 80 && g.percentage < 90).length },
      { name: 'C (70-79)', value: grades.filter(g => g.percentage >= 70 && g.percentage < 80).length },
      { name: 'D (60-69)', value: grades.filter(g => g.percentage >= 60 && g.percentage < 70).length },
      { name: 'F (0-59)', value: grades.filter(g => g.percentage < 60).length }
    ];

    res.status(200).json({
      success: true,
      data: {
        classAverage,
        topPerformers,
        failing,
        graded,
        chartData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get performance statistics
// @route   GET /api/analytics/performance
// @access  Private/Admin/Teacher
export const getPerformanceStats = async (req, res) => {
  try {
    const { timeRange } = req.query;
    
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'term':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const grades = await Grade.find({
      createdAt: { $gte: startDate }
    });

    const assignments = await Assignment.find({
      createdAt: { $gte: startDate }
    });

    const overallPerformance = grades.length > 0 ? 
      Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length) : 0;

    const improvementRate = 75; // This would need more complex calculation
    const atRisk = grades.filter(g => g.percentage < 60).length;
    const starPerformers = grades.filter(g => g.percentage >= 95).length;

    // Chart data
    const chartData = [];
    const days = 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayGrades = grades.filter(g => 
        g.createdAt >= date && g.createdAt < nextDay
      );

      const dayAverage = dayGrades.length > 0 ? 
        Math.round(dayGrades.reduce((sum, g) => sum + g.percentage, 0) / dayGrades.length) : 0;

      chartData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: dayAverage
      });
    }

    res.status(200).json({
      success: true,
      data: {
        overallPerformance,
        improvementRate,
        atRisk,
        starPerformers,
        chartData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};