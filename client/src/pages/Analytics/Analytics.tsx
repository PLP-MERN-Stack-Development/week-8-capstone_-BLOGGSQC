import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Award,
  Clock,
  Target,
  AlertTriangle
} from 'lucide-react'
import { analyticsAPI } from '../../services/api'

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('performance')

  // Fetch analytics data
  const { data: analyticsData, isLoading, refetch } = useQuery(
    ['analytics', selectedPeriod, selectedMetric],
    () => analyticsAPI.getDashboardStats(),
    {
      refetchInterval: 60000 // Refresh every minute
    }
  )

  // Mock data for comprehensive analytics
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
    },
    insights: [
      {
        type: 'success',
        title: 'Excellent Performance',
        description: 'Mathematics scores improved by 15% this month',
        icon: TrendingUp,
        color: 'text-green-500'
      },
      {
        type: 'warning',
        title: 'Attention Needed',
        description: 'Chemistry attendance dropped by 3% in Grade 11B',
        icon: AlertTriangle,
        color: 'text-yellow-500'
      },
      {
        type: 'info',
        title: 'Achievement Unlocked',
        description: '25 students achieved perfect attendance this month',
        icon: Award,
        color: 'text-blue-500'
      }
    ]
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleExport = () => {
    console.log('Export analytics data')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive insights into academic performance and trends</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="glass text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 border border-gray-600/30 hover:border-primary-500/50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="bg-gradient-gold text-white px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="performance">Academic Performance</option>
              <option value="attendance">Attendance Trends</option>
              <option value="engagement">Student Engagement</option>
              <option value="teacher">Teacher Analytics</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {[
          { 
            title: 'Total Students', 
            value: mockAnalytics.overview.totalStudents.toLocaleString(), 
            icon: Users, 
            color: 'from-blue-500 to-blue-600',
            change: '+5.2%'
          },
          { 
            title: 'Teachers', 
            value: mockAnalytics.overview.totalTeachers.toString(), 
            icon: GraduationCap, 
            color: 'from-green-500 to-green-600',
            change: '+2.1%'
          },
          { 
            title: 'Classes', 
            value: mockAnalytics.overview.totalClasses.toString(), 
            icon: BarChart3, 
            color: 'from-purple-500 to-purple-600',
            change: '+1'
          },
          { 
            title: 'Attendance', 
            value: `${mockAnalytics.overview.averageAttendance}%`, 
            icon: Clock, 
            color: 'from-orange-500 to-orange-600',
            change: '+2.3%'
          },
          { 
            title: 'Avg Grade', 
            value: `${mockAnalytics.overview.averageGrade}%`, 
            icon: Award, 
            color: 'from-pink-500 to-pink-600',
            change: '+4.1%'
          },
          { 
            title: 'Improvement', 
            value: `${mockAnalytics.overview.improvementRate}%`, 
            icon: TrendingUp, 
            color: 'from-cyan-500 to-cyan-600',
            change: '+8.7%'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="glass-strong rounded-xl p-4 hover:neon-glow transition-all duration-300"
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400 mb-1">{stat.title}</div>
            <div className="text-xs text-green-500">{stat.change}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary-500" />
            <span>Grade Distribution</span>
          </h2>
          
          <div className="space-y-4">
            {mockAnalytics.performance.gradeDistribution.map((grade, index) => (
              <div key={grade.grade} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-white">{grade.grade}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">{grade.count} students</span>
                    <span className="text-sm text-white">{grade.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${grade.percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subject Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary-500" />
            <span>Subject Performance</span>
          </h2>
          
          <div className="space-y-4">
            {mockAnalytics.performance.subjectPerformance.map((subject, index) => (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 glass rounded-lg"
              >
                <div>
                  <h3 className="text-white font-medium">{subject.subject}</h3>
                  <p className="text-sm text-gray-400">Average Score</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{subject.average}%</div>
                  <div className={`text-xs flex items-center space-x-1 ${
                    subject.trend === 'up' ? 'text-green-500' : 
                    subject.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${
                      subject.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    <span>{subject.trend}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Attendance Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Clock className="h-6 w-6 text-primary-500" />
          <span>Attendance Trends</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Trend</h3>
            <div className="space-y-3">
              {mockAnalytics.attendance.monthlyTrend.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-gray-400">{month.month}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${month.rate}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      ></motion.div>
                    </div>
                    <span className="text-white font-medium w-12">{month.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class-wise Attendance */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Class-wise Attendance</h3>
            <div className="space-y-3">
              {mockAnalytics.attendance.classWiseAttendance.map((classData, index) => (
                <motion.div
                  key={classData.class}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 glass rounded-lg"
                >
                  <div>
                    <h4 className="text-white font-medium">{classData.class}</h4>
                    <p className="text-xs text-gray-400">{classData.students} students</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{classData.rate}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-strong rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Key Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAnalytics.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${insight.color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{insight.title}</h3>
                  <p className="text-gray-400 text-sm">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  )
}

export default Analytics