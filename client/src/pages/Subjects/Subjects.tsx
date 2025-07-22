import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Clock,
  Award,
  GraduationCap,
  FileText
} from 'lucide-react'
import { subjectsAPI } from '../../services/api'

const Subjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch subjects data
  const { data: subjectsData, isLoading, refetch } = useQuery(
    ['subjects', currentPage, searchTerm, selectedDepartment],
    () => subjectsAPI.getAll({
      page: currentPage,
      search: searchTerm,
      department: selectedDepartment
    }),
    {
      keepPreviousData: true
    }
  )

  const subjects = subjectsData?.data?.subjects || []

  // Mock data for demonstration
  const mockSubjects = [
    {
      _id: '1',
      name: 'Advanced Mathematics',
      code: 'MATH101',
      description: 'Advanced Mathematics including Algebra, Geometry, and Calculus',
      department: 'Mathematics',
      credits: 4,
      grade: 'Grade 10',
      type: 'core',
      teachers: [
        { teacher: { user: { name: 'Dr. Sarah Johnson' } } }
      ],
      schedule: {
        hoursPerWeek: 5,
        totalHours: 180
      },
      performance: {
        averageScore: 85.5,
        passRate: 92.3,
        difficulty: 'medium'
      },
      syllabus: [
        { unit: 1, title: 'Algebra', topics: ['Linear Equations', 'Quadratic Equations'] },
        { unit: 2, title: 'Geometry', topics: ['Triangles', 'Circles'] },
        { unit: 3, title: 'Statistics', topics: ['Mean, Median, Mode', 'Probability'] }
      ],
      isActive: true
    },
    {
      _id: '2',
      name: 'Physics',
      code: 'PHY101',
      description: 'Fundamental principles of Physics with laboratory work',
      department: 'Science',
      credits: 4,
      grade: 'Grade 10',
      type: 'core',
      teachers: [
        { teacher: { user: { name: 'Prof. Michael Chen' } } }
      ],
      schedule: {
        hoursPerWeek: 5,
        totalHours: 180,
        practicalHours: 60
      },
      performance: {
        averageScore: 78.9,
        passRate: 88.7,
        difficulty: 'hard'
      },
      syllabus: [
        { unit: 1, title: 'Mechanics', topics: ['Motion', 'Force', 'Energy'] },
        { unit: 2, title: 'Thermodynamics', topics: ['Heat', 'Temperature'] },
        { unit: 3, title: 'Waves', topics: ['Sound', 'Light'] }
      ],
      isActive: true
    },
    {
      _id: '3',
      name: 'English Literature',
      code: 'ENG101',
      description: 'English Language and Literature studies',
      department: 'English',
      credits: 3,
      grade: 'Grade 10',
      type: 'core',
      teachers: [
        { teacher: { user: { name: 'Emma Thompson' } } }
      ],
      schedule: {
        hoursPerWeek: 4,
        totalHours: 144
      },
      performance: {
        averageScore: 82.1,
        passRate: 94.5,
        difficulty: 'easy'
      },
      syllabus: [
        { unit: 1, title: 'Poetry', topics: ['Romantic Poetry', 'Modern Poetry'] },
        { unit: 2, title: 'Drama', topics: ['Shakespeare', 'Modern Drama'] },
        { unit: 3, title: 'Prose', topics: ['Short Stories', 'Novels'] }
      ],
      isActive: true
    }
  ]

  const displaySubjects = subjects.length > 0 ? subjects : mockSubjects

  const handleAddSubject = () => {
    setShowAddModal(true)
  }

  const handleEditSubject = (subjectId: string) => {
    console.log('Edit subject:', subjectId)
  }

  const handleDeleteSubject = (subjectId: string) => {
    console.log('Delete subject:', subjectId)
  }

  const handleViewSubject = (subjectId: string) => {
    console.log('View subject:', subjectId)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'hard': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-blue-500/20 text-blue-400'
      case 'elective': return 'bg-green-500/20 text-green-400'
      case 'optional': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Subjects Management</h1>
          <p className="text-gray-400">Manage curriculum, syllabus, and subject assignments</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddSubject}
          className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold mt-4 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Subject</span>
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
              placeholder="Search subjects by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Departments</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="social-studies">Social Studies</option>
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

      {/* Subjects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displaySubjects.map((subject, index) => (
          <motion.div
            key={subject._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300"
          >
            {/* Subject Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{subject.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(subject.type)}`}>
                    {subject.type}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">{subject.code}</p>
                <p className="text-sm text-primary-500">{subject.department}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Subject Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Grade Level</span>
                <span className="text-sm text-white font-medium">{subject.grade}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Credits</span>
                <span className="text-sm text-white font-medium">{subject.credits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Hours/Week</span>
                <span className="text-sm text-white font-medium">{subject.schedule.hoursPerWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Difficulty</span>
                <span className={`text-sm font-medium capitalize ${getDifficultyColor(subject.performance.difficulty)}`}>
                  {subject.performance.difficulty}
                </span>
              </div>
            </div>

            {/* Teachers */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Teachers</span>
              </div>
              <div className="space-y-1">
                {subject.teachers.map((teacherAssignment, idx) => (
                  <p key={idx} className="text-sm text-white ml-6">
                    {teacherAssignment.teacher.user.name}
                  </p>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center glass rounded-lg p-2">
                <div className="text-lg font-bold text-white">{subject.performance.averageScore}%</div>
                <div className="text-xs text-gray-400">Avg Score</div>
              </div>
              <div className="text-center glass rounded-lg p-2">
                <div className="text-lg font-bold text-white">{subject.performance.passRate}%</div>
                <div className="text-xs text-gray-400">Pass Rate</div>
              </div>
            </div>

            {/* Syllabus Preview */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Syllabus Units: {subject.syllabus.length}</span>
              </div>
              <div className="space-y-1">
                {subject.syllabus.slice(0, 2).map((unit) => (
                  <p key={unit.unit} className="text-xs text-gray-300 ml-6">
                    Unit {unit.unit}: {unit.title}
                  </p>
                ))}
                {subject.syllabus.length > 2 && (
                  <p className="text-xs text-gray-400 ml-6">
                    +{subject.syllabus.length - 2} more units
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewSubject(subject._id)}
                className="flex-1 glass text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-white/10 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditSubject(subject._id)}
                className="flex-1 bg-primary-500/20 text-primary-400 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-primary-500/30 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteSubject(subject._id)}
                className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
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
      {!isLoading && displaySubjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No subjects found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first subject</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddSubject}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto neon-glow-gold"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Subject</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Subjects