import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Bell,
  Award,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { analyticsAPI } from '../../services/api'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  // Fetch dashboard stats
  const { data: statsData, isLoading } = useQuery(
    'dashboard-stats',
    analyticsAPI.getDashboardStats,
    {
      refetchInterval: 30000 // Refresh every 30 seconds
    }
  )

  const stats = statsData?.data?.stats || {}

  // Mock data for demonstration
  const mockStats = {
    totalStudents: 1247,
    totalTeachers: 89,
    totalClasses: 45,
    attendanceRate: 94.2,
    recentActivities: [
      {
        id: 1,
        type: 'assignment',
        message: 'New assignment posted in Mathematics',
        time: '2 minutes ago',
        icon: BookOpen,
        color: 'text-blue-500'
      },
      {
        id: 2,
        type: 'student',
        message: 'Alice Johnson submitted Physics report',
        time: '15 minutes ago',
        icon: Users,
        color: 'text-green-500'
      },
      {
        id: 3,
        type: 'announcement',
        message: 'Parent-Teacher meeting scheduled',
        time: '1 hour ago',
        icon: Bell,
        color: 'text-yellow-500'
      },
      {
        id: 4,
        type: 'grade',
        message: '25 students received excellent grades',
        time: '2 hours ago',
        icon: Award,
        color: 'text-purple-500'
      }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Science Fair',
        date: 'Tomorrow',
        time: '9:00 AM',
        type: 'event'
      },
      {
        id: 2,
        title: 'Parent-Teacher Meeting',
        date: 'Friday',
        time: '2:00 PM',
        type: 'meeting'
      },
      {
        id: 3,
        title: 'Math Quiz',
        date: 'Next Monday',
        time: '10:00 AM',
        type: 'assessment'
      }
    ]
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const dashboardCards = [
    {
      title: 'Total Students',
      value: mockStats.totalStudents.toLocaleString(),
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Active enrolled students'
    },
    {
      title: 'Teachers',
      value: mockStats.totalTeachers.toString(),
      change: '+5%',
      changeType: 'increase',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      description: 'Faculty members'
    },
    {
      title: 'Classes',
      value: mockStats.totalClasses.toString(),
      change: '+2',
      changeType: 'increase',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      description: 'Active classes'
    },
    {
      title: 'Attendance Rate',
      value: `${mockStats.attendanceRate}%`,
      change: '+2.1%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      description: 'This week average'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-8 neon-glow"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-gray-300">
              Welcome to your {user?.role} dashboard. Here's what's happening today.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Today's Date</p>
              <p className="text-lg font-semibold text-white">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                card.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
              }`}>
                {card.changeType === 'increase' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{card.change}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">{card.value}</h3>
              <p className="text-sm font-medium text-gray-300">{card.title}</p>
              <p className="text-xs text-gray-400">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary-500" />
              <span>Recent Activities</span>
            </h2>
            <button className="text-primary-500 hover:text-primary-400 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {mockStats.recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 p-3 glass rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 ${activity.color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {activity.message}
                  </p>
                  <p className="text-gray-400 text-xs flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary-500" />
              <span>Upcoming Events</span>
            </h2>
            <button className="text-primary-500 hover:text-primary-400 text-sm font-medium transition-colors">
              View Calendar
            </button>
          </div>
          
          <div className="space-y-4">
            {mockStats.upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-lg p-4 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{event.title}</h3>
                    <p className="text-gray-400 text-sm">{event.date} at {event.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Add Student', icon: Users, color: 'from-blue-500 to-blue-600' },
            { name: 'Create Assignment', icon: BookOpen, color: 'from-green-500 to-green-600' },
            { name: 'Take Attendance', icon: Clock, color: 'from-purple-500 to-purple-600' },
            { name: 'Send Message', icon: Bell, color: 'from-orange-500 to-orange-600' }
          ].map((action, index) => (
            <motion.button
              key={action.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-r ${action.color} rounded-xl p-4 text-white font-medium flex flex-col items-center space-y-2 hover:shadow-lg transition-all`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard