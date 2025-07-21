import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('attendance');

  // Sample data for charts
  const attendanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendance Rate',
        data: [88, 92, 87, 94, 91, 95],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const gradeDistributionData = {
    labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    datasets: [
      {
        data: [15, 25, 20, 18, 12, 7, 2, 1],
        backgroundColor: [
          '#10B981',
          '#059669',
          '#F59E0B',
          '#D97706',
          '#EF4444',
          '#DC2626',
          '#8B5CF6',
          '#7C3AED',
        ],
      },
    ],
  };

  const subjectPerformanceData = {
    labels: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'],
    datasets: [
      {
        label: 'Average Score',
        data: [85, 78, 82, 91, 87],
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  };

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
            <h1 className="text-3xl font-bold text-white">Analytics & Insights</h1>
            <p className="text-gray-400 mt-1">Comprehensive data analysis and performance metrics</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export Report</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">1,247</h3>
          <p className="text-gray-400">Active Students</p>
          <div className="mt-2 text-xs text-gray-400">
            Increased by 134 this month
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+5%</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">92.5%</h3>
          <p className="text-gray-400">Avg Attendance</p>
          <div className="mt-2 text-xs text-gray-400">
            Above target by 2.5%
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+3%</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">86.2%</h3>
          <p className="text-gray-400">Avg Grade</p>
          <div className="mt-2 text-xs text-gray-400">
            Improved from last quarter
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-red-400">
                <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                <span className="text-sm font-medium">-2%</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">89.1%</h3>
          <p className="text-gray-400">Assignment Completion</p>
          <div className="mt-2 text-xs text-gray-400">
            Slightly below target
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Attendance Trend</h2>
            <div className="flex items-center space-x-2">
              <Activity size={18} className="text-primary-400" />
              <span className="text-sm text-gray-400">6-Month View</span>
            </div>
          </div>
          <div className="h-64">
            <Line
              data={attendanceTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  },
                  y: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Grade Distribution</h2>
            <div className="flex items-center space-x-2">
              <PieChart size={18} className="text-primary-400" />
              <span className="text-sm text-gray-400">Current Semester</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={gradeDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: '#9ca3af',
                      padding: 20,
                      usePointStyle: true,
                    },
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Subject Performance */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Subject Performance</h2>
          <div className="flex space-x-3">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="attendance">Attendance Rate</option>
              <option value="grades">Average Grades</option>
              <option value="assignments">Assignment Completion</option>
            </select>
          </div>
        </div>
        <div className="h-80">
          <Bar
            data={subjectPerformanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  ticks: { color: '#9ca3af' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                },
                y: {
                  ticks: { color: '#9ca3af' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                },
              },
            }}
          />
        </div>
      </motion.div>

      {/* Performance Insights */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-6">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="font-semibold text-green-400">Top Performing</h3>
            </div>
            <p className="text-white font-medium">Mathematics Department</p>
            <p className="text-gray-400 text-sm">95% average attendance, 88% grade average</p>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-yellow-400">Needs Attention</h3>
            </div>
            <p className="text-white font-medium">Physics Department</p>
            <p className="text-gray-400 text-sm">78% average attendance, improvement needed</p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-400">Improvement</h3>
            </div>
            <p className="text-white font-medium">Overall Grades</p>
            <p className="text-gray-400 text-sm">3% increase from last semester</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;