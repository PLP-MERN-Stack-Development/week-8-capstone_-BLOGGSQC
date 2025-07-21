import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  BookOpen,
  BarChart3,
  Download,
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  examType: 'quiz' | 'midterm' | 'final' | 'assignment';
  marks: number;
  totalMarks: number;
  grade: string;
  date: string;
  class: string;
}

const Grades: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterExamType, setFilterExamType] = useState('');
  const [filterClass, setFilterClass] = useState('');
  
  const [grades] = useState<Grade[]>([
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Alex Johnson',
      subject: 'Mathematics',
      examType: 'midterm',
      marks: 85,
      totalMarks: 100,
      grade: 'A',
      date: '2024-02-05',
      class: '10-A',
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Emma Davis',
      subject: 'Physics',
      examType: 'quiz',
      marks: 92,
      totalMarks: 100,
      grade: 'A+',
      date: '2024-02-03',
      class: '10-A',
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Michael Brown',
      subject: 'Chemistry',
      examType: 'assignment',
      marks: 78,
      totalMarks: 100,
      grade: 'B+',
      date: '2024-02-01',
      class: '11-A',
    },
    {
      id: '4',
      studentId: 'STU001',
      studentName: 'Alex Johnson',
      subject: 'English',
      examType: 'final',
      marks: 88,
      totalMarks: 100,
      grade: 'A',
      date: '2024-01-28',
      class: '10-A',
    },
  ]);

  const filteredGrades = grades.filter((grade) => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === '' || grade.subject === filterSubject;
    const matchesExamType = filterExamType === '' || grade.examType === filterExamType;
    const matchesClass = filterClass === '' || grade.class === filterClass;
    
    return matchesSearch && matchesSubject && matchesExamType && matchesClass;
  });

  // Calculate statistics
  const stats = {
    averageGrade: (filteredGrades.reduce((sum, grade) => sum + (grade.marks / grade.totalMarks) * 100, 0) / filteredGrades.length).toFixed(1),
    highestScore: Math.max(...filteredGrades.map(g => (g.marks / g.totalMarks) * 100)).toFixed(1),
    lowestScore: Math.min(...filteredGrades.map(g => (g.marks / g.totalMarks) * 100)).toFixed(1),
    totalStudents: new Set(filteredGrades.map(g => g.studentId)).size,
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-green-500/20 text-green-400';
      case 'A':
        return 'bg-blue-500/20 text-blue-400';
      case 'B+':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'B':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-red-500/20 text-red-400';
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-purple-500/20 text-purple-400';
      case 'midterm':
        return 'bg-blue-500/20 text-blue-400';
      case 'final':
        return 'bg-red-500/20 text-red-400';
      case 'assignment':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Performance trend data
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Score',
        data: [82, 85, 88, 86, 90, 89],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
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
            <h1 className="text-3xl font-bold text-white">Grades & Performance</h1>
            <p className="text-gray-400 mt-1">Track student academic performance and progress</p>
          </div>
          <div className="flex space-x-3">
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

      {/* Statistics Cards */}
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
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+5%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.averageGrade}%</h3>
          <p className="text-gray-400">Average Grade</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+2%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.highestScore}%</h3>
          <p className="text-gray-400">Highest Score</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex items-center text-red-400">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">-1%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.lowestScore}%</h3>
          <p className="text-gray-400">Lowest Score</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+8</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.totalStudents}</h3>
          <p className="text-gray-400">Students Evaluated</p>
        </motion.div>
      </motion.div>

      {/* Performance Trend Chart */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Performance Trend</h2>
        <div className="h-64">
          <Line
            data={performanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
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

      {/* Filters */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="English">English</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          <div>
            <select
              value={filterExamType}
              onChange={(e) => setFilterExamType(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Exams</option>
              <option value="quiz">Quiz</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Classes</option>
              <option value="9-A">Class 9-A</option>
              <option value="10-A">Class 10-A</option>
              <option value="11-A">Class 11-A</option>
              <option value="12-A">Class 12-A</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Grades Table */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Grades</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Exam Type</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Score</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Grade</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade) => (
                <motion.tr
                  key={grade.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{grade.studentName}</p>
                      <p className="text-gray-400 text-sm">{grade.studentId} • {grade.class}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen size={16} className="text-primary-400" />
                      <span className="text-white">{grade.subject}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm capitalize ${getExamTypeColor(grade.examType)}`}>
                      {grade.examType}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">
                      {grade.marks}/{grade.totalMarks} ({((grade.marks / grade.totalMarks) * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">{new Date(grade.date).toLocaleDateString()}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGrades.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No grades found</h3>
            <p className="text-gray-400">
              {searchTerm || filterSubject || filterExamType || filterClass
                ? 'Try adjusting your search or filters'
                : 'Grades will appear here once assessments are completed'
              }
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Grades;