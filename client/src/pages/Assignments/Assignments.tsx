import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  BookOpen
} from 'lucide-react'
import { assignmentsAPI } from '../../services/api'

const Assignments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch assignments data
  const { data: assignmentsData, isLoading, refetch } = useQuery(
    ['assignments', currentPage, searchTerm, selectedSubject, selectedStatus],
    () => assignmentsAPI.getAll({
      page: currentPage,
      search: searchTerm,
      subject: selectedSubject,
      status: selectedStatus
    }),
    {
      keepPreviousData: true
    }
  )

  const assignments = assignmentsData?.data?.assignments || []

  // Mock data for demonstration
  const mockAssignments = [
    {
      _id: '1',
      title: 'Quadratic Equations Problem Set',
      description: 'Solve the given quadratic equations using different methods including factoring, completing the square, and quadratic formula.',
      subject: { name: 'Mathematics', code: 'MATH101' },
      class: { name: 'Grade 10A' },
      teacher: { user: { name: 'Dr. Sarah Johnson' } },
      dueDate: '2024-12-20',
      maxMarks: 100,
      type: 'homework',
      status: 'active',
      submissions: [
        { student: { user: { name: 'John Smith' } }, status: 'submitted', submittedAt: '2024-12-15', marks: 85 },
        { student: { user: { name: 'Alice Johnson' } }, status: 'submitted', submittedAt: '2024-12-16', marks: 92 }
      ],
      totalStudents: 28,
      submittedCount: 15,
      gradedCount: 8,
      createdAt: '2024-12-10'
    },
    {
      _id: '2',
      title: 'Physics Lab Report - Pendulum Experiment',
      description: 'Write a comprehensive lab report on the simple pendulum experiment conducted in class.',
      subject: { name: 'Physics', code: 'PHY101' },
      class: { name: 'Grade 10A' },
      teacher: { user: { name: 'Prof. Michael Chen' } },
      dueDate: '2024-12-25',
      maxMarks: 50,
      type: 'lab-report',
      status: 'active',
      submissions: [
        { student: { user: { name: 'Bob Wilson' } }, status: 'submitted', submittedAt: '2024-12-17', marks: null }
      ],
      totalStudents: 28,
      submittedCount: 8,
      gradedCount: 3,
      createdAt: '2024-12-12'
    },
    {
      _id: '3',
      title: 'English Essay - Climate Change',
      description: 'Write a 500-word essay on the impact of climate change on global ecosystems.',
      subject: { name: 'English', code: 'ENG101' },
      class: { name: 'Grade 10B' },
      teacher: { user: { name: 'Emma Thompson' } },
      dueDate: '2024-12-18',
      maxMarks: 75,
      type: 'essay',
      status: 'overdue',
      submissions: [
        { student: { user: { name: 'Maria Garcia' } }, status: 'late', submittedAt: '2024-12-19', marks: 68 }
      ],
      totalStudents: 25,
      submittedCount: 20,
      gradedCount: 18,
      createdAt: '2024-12-08'
    }
  ]

  const displayAssignments = assignments.length > 0 ? assignments : mockAssignments

  const handleAddAssignment = () => {
    setShowAddModal(true)
  }

  const handleEditAssignment = (assignmentId: string) => {
    console.log('Edit assignment:', assignmentId)
  }

  const handleDeleteAssignment = (assignmentId: string) => {
    console.log('Delete assignment:', assignmentId)
  }

  const handleViewAssignment = (assignmentId: string) => {
    console.log('View assignment:', assignmentId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/20'
      case 'overdue': return 'text-red-500 bg-red-500/20'
      case 'draft': return 'text-yellow-500 bg-yellow-500/20'
      case 'completed': return 'text-blue-500 bg-blue-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'bg-blue-500/20 text-blue-400'
      case 'lab-report': return 'bg-purple-500/20 text-purple-400'
      case 'essay': return 'bg-green-500/20 text-green-400'
      case 'project': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
          <h1 className="text-3xl font-bold text-white mb-2">Assignments Management</h1>
          <p className="text-gray-400">Create, manage, and grade student assignments</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddAssignment}
          className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold mt-4 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create Assignment</span>
        </motion.button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search assignments by title, subject, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="english">English</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 border border-gray-600/30 hover:border-primary-500/50 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Assignments Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {displayAssignments.map((assignment, index) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate)
          const submissionRate = Math.round((assignment.submittedCount / assignment.totalStudents) * 100)
          
          return (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300"
            >
              {/* Assignment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-white">{assignment.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(assignment.type)}`}>
                      {assignment.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{assignment.subject.name} • {assignment.class.name}</p>
                  <p className="text-sm text-gray-300">{assignment.teacher.user.name}</p>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                  {assignment.status}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{assignment.description}</p>

              {/* Due Date & Marks */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {isOverdue(assignment.dueDate) ? (
                    <div className="flex items-center space-x-1 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">Overdue</span>
                    </div>
                  ) : daysUntilDue <= 3 ? (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">{daysUntilDue} days left</span>
                    </div>
                  ) : null}
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-white font-medium">Max: {assignment.maxMarks} pts</div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center glass rounded-lg p-2">
                  <div className="text-lg font-bold text-white">{assignment.submittedCount}</div>
                  <div className="text-xs text-gray-400">Submitted</div>
                </div>
                <div className="text-center glass rounded-lg p-2">
                  <div className="text-lg font-bold text-white">{assignment.gradedCount}</div>
                  <div className="text-xs text-gray-400">Graded</div>
                </div>
                <div className="text-center glass rounded-lg p-2">
                  <div className="text-lg font-bold text-white">{submissionRate}%</div>
                  <div className="text-xs text-gray-400">Rate</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Submission Progress</span>
                  <span className="text-xs text-gray-400">{assignment.submittedCount}/{assignment.totalStudents}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${submissionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewAssignment(assignment._id)}
                  className="flex-1 glass text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-white/10 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditAssignment(assignment._id)}
                  className="flex-1 bg-primary-500/20 text-primary-400 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-primary-500/30 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteAssignment(assignment._id)}
                  className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )
        })}
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

      {/* Empty State */}
      {!isLoading && displayAssignments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No assignments found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first assignment</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddAssignment}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto neon-glow-gold"
          >
            <Plus className="h-5 w-5" />
            <span>Create First Assignment</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Assignments