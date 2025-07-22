import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  MapPin,
  TrendingUp
} from 'lucide-react'
import { classesAPI } from '../../services/api'

const Classes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch classes data
  const { data: classesData, isLoading, refetch } = useQuery(
    ['classes', currentPage, searchTerm, selectedGrade],
    () => classesAPI.getAll({
      page: currentPage,
      search: searchTerm,
      grade: selectedGrade
    }),
    {
      keepPreviousData: true
    }
  )

  const classes = classesData?.data?.classes || []

  // Mock data for demonstration
  const mockClasses = [
    {
      _id: '1',
      name: 'Grade 10A',
      grade: 'Grade 10',
      section: 'A',
      academicYear: '2024-2025',
      classTeacher: {
        user: { name: 'Dr. Sarah Johnson' }
      },
      students: new Array(28),
      capacity: 30,
      subjects: [
        { subject: { name: 'Mathematics' } },
        { subject: { name: 'Physics' } },
        { subject: { name: 'Chemistry' } },
        { subject: { name: 'English' } },
        { subject: { name: 'History' } }
      ],
      room: {
        number: '101',
        building: 'Main Block',
        floor: '1st Floor'
      },
      performance: {
        averageGrade: 85.5,
        attendanceRate: 94.2
      },
      isActive: true
    },
    {
      _id: '2',
      name: 'Grade 10B',
      grade: 'Grade 10',
      section: 'B',
      academicYear: '2024-2025',
      classTeacher: {
        user: { name: 'Prof. Michael Chen' }
      },
      students: new Array(25),
      capacity: 30,
      subjects: [
        { subject: { name: 'Mathematics' } },
        { subject: { name: 'Physics' } },
        { subject: { name: 'Chemistry' } },
        { subject: { name: 'English' } },
        { subject: { name: 'History' } }
      ],
      room: {
        number: '102',
        building: 'Main Block',
        floor: '1st Floor'
      },
      performance: {
        averageGrade: 82.3,
        attendanceRate: 91.8
      },
      isActive: true
    },
    {
      _id: '3',
      name: 'Grade 11A',
      grade: 'Grade 11',
      section: 'A',
      academicYear: '2024-2025',
      classTeacher: {
        user: { name: 'Emma Thompson' }
      },
      students: new Array(22),
      capacity: 25,
      subjects: [
        { subject: { name: 'Advanced Mathematics' } },
        { subject: { name: 'Physics' } },
        { subject: { name: 'Chemistry' } },
        { subject: { name: 'English Literature' } },
        { subject: { name: 'Computer Science' } }
      ],
      room: {
        number: '201',
        building: 'Science Block',
        floor: '2nd Floor'
      },
      performance: {
        averageGrade: 88.7,
        attendanceRate: 96.1
      },
      isActive: true
    }
  ]

  const displayClasses = classes.length > 0 ? classes : mockClasses

  const handleAddClass = () => {
    setShowAddModal(true)
  }

  const handleEditClass = (classId: string) => {
    console.log('Edit class:', classId)
  }

  const handleDeleteClass = (classId: string) => {
    console.log('Delete class:', classId)
  }

  const handleViewClass = (classId: string) => {
    console.log('View class:', classId)
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
          <h1 className="text-3xl font-bold text-white mb-2">Classes Management</h1>
          <p className="text-gray-400">Manage class schedules, assignments, and student enrollment</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClass}
          className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold mt-4 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Class</span>
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
              placeholder="Search classes by name, grade, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
          </div>

          {/* Grade Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Grades</option>
              <option value="grade-9">Grade 9</option>
              <option value="grade-10">Grade 10</option>
              <option value="grade-11">Grade 11</option>
              <option value="grade-12">Grade 12</option>
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

      {/* Classes Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displayClasses.map((classItem, index) => (
          <motion.div
            key={classItem._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300"
          >
            {/* Class Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{classItem.name}</h3>
                <p className="text-sm text-gray-400">{classItem.academicYear}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Class Teacher */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Class Teacher:</span>
              </div>
              <p className="text-white font-medium ml-6">{classItem.classTeacher.user.name}</p>
            </div>

            {/* Room Info */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Room:</span>
              </div>
              <p className="text-white text-sm ml-6">
                {classItem.room.number}, {classItem.room.building}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center glass rounded-lg p-3">
                <div className="text-lg font-bold text-white">{classItem.students.length}/{classItem.capacity}</div>
                <div className="text-xs text-gray-400">Students</div>
              </div>
              <div className="text-center glass rounded-lg p-3">
                <div className="text-lg font-bold text-white">{classItem.subjects.length}</div>
                <div className="text-xs text-gray-400">Subjects</div>
              </div>
            </div>

            {/* Performance */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Average Grade</span>
                <span className="text-sm text-white font-medium">{classItem.performance.averageGrade}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Attendance</span>
                <span className="text-sm text-white font-medium">{classItem.performance.attendanceRate}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewClass(classItem._id)}
                className="flex-1 glass text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-white/10 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditClass(classItem._id)}
                className="flex-1 bg-primary-500/20 text-primary-400 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-primary-500/30 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteClass(classItem._id)}
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
      {!isLoading && displayClasses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No classes found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first class</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddClass}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto neon-glow-gold"
          >
            <Plus className="h-5 w-5" />
            <span>Create First Class</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Classes