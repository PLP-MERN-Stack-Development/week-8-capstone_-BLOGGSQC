import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Bell,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalStudents: 2847,
          totalTeachers: 156,
          totalClasses: 48,
          totalSubjects: 24,
          attendanceRate: 94.2,
          avgGrade: 8.7,
          pendingAssignments: 23,
          upcomingEvents: 5,
        });
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  // Sample chart data
  const attendanceData = [
    { name: 'Mon', attendance: 95 },
    { name: 'Tue', attendance: 92 },
    { name: 'Wed', attendance: 96 },
    { name: 'Thu', attendance: 89 },
    { name: 'Fri', attendance: 94 },
    { name: 'Sat', attendance: 88 },
    { name: 'Sun', attendance: 85 },
  ];

  const gradeDistribution = [
    { name: 'A+', value: 25, color: '#00ff88' },
    { name: 'A', value: 35, color: '#00d4ff' },
    { name: 'B+', value: 20, color: '#ffd700' },
    { name: 'B', value: 15, color: '#ff8c00' },
    { name: 'C', value: 5, color: '#ff4444' },
  ];

  const performanceData = [
    { subject: 'Math', score: 92 },
    { subject: 'Science', score: 88 },
    { subject: 'English', score: 94 },
    { subject: 'History', score: 86 },
    { subject: 'Art', score: 90 },
  ];

  const recentActivities = [
    { id: 1, type: 'assignment', message: 'New assignment posted in Mathematics', time: '2 minutes ago', icon: BookOpen },
    { id: 2, type: 'grade', message: 'Grade updated for Physics test', time: '15 minutes ago', icon: Award },
    { id: 3, type: 'attendance', message: 'Attendance marked for Class 10-A', time: '30 minutes ago', icon: CheckCircle },
    { id: 4, type: 'event', message: 'Parent-teacher meeting scheduled', time: '1 hour ago', icon: Calendar },
    { id: 5, type: 'message', message: 'New message from Sarah Johnson', time: '2 hours ago', icon: MessageSquare },
  ];

  const quickActions = [
    { label: 'Mark Attendance', icon: CheckCircle, color: 'from-green-500 to-green-600', href: '/attendance' },
    { label: 'Create Assignment', icon: BookOpen, color: 'from-blue-500 to-blue-600', href: '/assignments' },
    { label: 'Send Announcement', icon: Bell, color: 'from-purple-500 to-purple-600', href: '/announcements' },
    { label: 'View Reports', icon: BarChart3, color: 'from-orange-500 to-orange-600', href: '/analytics' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent Teacher Meeting', date: '2024-01-15', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Science Fair', date: '2024-01-18', time: '9:00 AM', type: 'event' },
    { id: 3, title: 'Mathematics Exam', date: '2024-01-20', time: '11:00 AM', type: 'exam' },
    { id: 4, title: 'Sports Day', date: '2024-01-25', time: '8:00 AM', type: 'sports' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
    loading?: boolean;
  }> = ({ title, value, change, icon: Icon, color, loading = false }) => (
    <motion.div variants={itemVariants} className="metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          {loading ? (
            <div className="h-8 bg-white/10 rounded animate-pulse w-20 mt-2"></div>
          ) : (
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp size={16} className="text-green-400 mr-1" />
              ) : (
                <TrendingDown size={16} className="text-red-400 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-white/10 rounded w-64 mb-2"></div>
            <div className="h-6 bg-white/10 rounded w-96"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening in your school today
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Clock size={16} />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">System Online</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents?.toLocaleString() || '0'}
          change={5.2}
          icon={Users}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers || '0'}
          change={2.1}
          icon={GraduationCap}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Active Classes"
          value={stats.totalClasses || '0'}
          change={0.8}
          icon={BookOpen}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Subjects"
          value={stats.totalSubjects || '0'}
          change={-1.2}
          icon={Target}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Quick Actions */}
      {user?.role === 'admin' || user?.role === 'teacher' ? (
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.a
                key={index}
                href={action.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white text-center hover:shadow-lg transition-all duration-300`}
              >
                <action.icon size={24} className="mx-auto mb-2" />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      ) : null}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <motion.div variants={itemVariants} className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#00BFFF" 
                strokeWidth={3}
                dot={{ fill: '#00BFFF', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#00BFFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div variants={itemVariants} className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {gradeDistribution.map((grade, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: grade.color }}
                ></div>
                <span className="text-gray-300 text-sm">{grade.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            Subject Performance
          </h3>
          <div className="space-y-4">
            {performanceData.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{subject.subject}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-white/10 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-electric-500 rounded-full transition-all duration-1000"
                      style={{ width: `${subject.score}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold w-8 text-right">{subject.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="mr-2" size={20} />
            Recent Activity
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-start space-x-3 p-3 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 p-2 bg-primary-500/20 rounded-lg">
                  <activity.icon size={16} className="text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 text-sm">{activity.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="mr-2" size={20} />
            Upcoming Events
          </div>
          <a href="/calendar" className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
            View all
          </a>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary-500/50 transition-all duration-300"
            >
              <h4 className="text-white font-medium mb-2">{event.title}</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <p className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {event.date}
                </p>
                <p className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {event.time}
                </p>
              </div>
              <div className="mt-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  event.type === 'exam' ? 'bg-red-500/20 text-red-400' :
                  event.type === 'meeting' ? 'bg-blue-500/20 text-blue-400' :
                  event.type === 'sports' ? 'bg-green-500/20 text-green-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {event.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;