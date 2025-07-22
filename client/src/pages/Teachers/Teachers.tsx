import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  BookOpen,
  Users,
  Award,
  Calendar
} from 'lucide-react'
import { teachersAPI } from '../../services/api'

const Teachers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch teachers data
  const { data: teachersData, isLoading, refetch } = useQuery(
    ['teachers', currentPage, searchTerm, selectedDepartment],
    () => teachersAPI.getAll({
      page: currentPage,
      search: searchTerm,
      department: selectedDepartment
    }),
    {
      keepPreviousData: true
    }
  )

  const teachers = teachersData?.data?.teachers || []

  // Mock data for demonstration
  const mockTeachers = [
    {
      _id: '1',
      user: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@edutech-pro.com',
        phone: '+1-555-0002',
        avatar: { url: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      employeeId: 'EMP24001',
      department: 'Mathematics',
      position: 'Head of Department',
      subjects: [{ name: 'Advanced Mathematics' }, { name: 'Statistics' }],
      classes: [{ name: 'Grade 10A' }, { name: 'Grade 11A' }],
      experience: { totalYears: 8 },
      performance: { rating: 4.8 },
      joiningDate: '2020-08-01',
      isActive: true
    },
    {
      _id: '2',
      user: {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@edutech-pro.com',
        phone: '+1-555-0003',
        avatar: { url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      employeeId: 'EMP24002',
      department: 'Science',
      position: 'Senior Teacher',
      subjects: [{ name: 'Physics' }, { name: 'Chemistry' }],
      classes: [{ name: 'Grade 10B' }, { name: 'Grade 11B' }],
      experience: { totalYears: 12 },
      performance: { rating: 4.9 },
      joiningDate: '2018-08-01',
      isActive: true
    },
    {
      _id: '3',
      user: {
        name: 'Emma Thompson',
        email: 'emma.thompson@edutech-pro.com',
        phone: '+1-555-0004',
        avatar: { url: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      employeeId: 'EMP24003',
      department: 'English',
      position: 'Teacher',
      subjects: [{ name: 'English Literature' }, { name: 'Creative Writing' }],
      classes: [{ name: 'Grade 9A' }, { name: 'Grade 10A' }],
      experience: { totalYears: 6 },
      performance: { rating: 4.7 },
      joiningDate: '2021-08-01',
      isActive: true
    }
  ]

  const displayTeachers = teachers.length > 0 ? teachers : mockTeachers

  const handleAddTeacher = () => {
    setShowAddModal(true)
  }

  const handleEditTeacher = (teacherId: string) => {
    console.log('Edit teacher:', teacherId)
  }

  const handleDeleteTeacher = (teacherId: string) => {
    console.log('Delete teacher:', teacherId)
  }

  const handleViewTeacher = (teacherId: string) => {
    console.log('View teacher:', teacherId)
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
          <h1 className="text-3xl font-bold text-white mb-2">Teachers Management</h1>
          <p className="text-gray-400">Manage faculty members, assignments, and performance</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddTeacher}
          className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold mt-4 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Teacher</span>
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
              placeholder="Search teachers by name, email, or employee ID..."
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

      {/* Teachers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displayTeachers.map((teacher, index) => (
          <motion.div
            key={teacher._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300"
          >
            {/* Teacher Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <img
                  src={teacher.user.avatar?.url || 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={teacher.user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/30"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-950 ${
                  teacher.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{teacher.user.name}</h3>
                <p className="text-sm text-gray-400">{teacher.employeeId}</p>
                <p className="text-sm text-primary-500">{teacher.position}</p>
              </div>
            </div>

            {/* Department & Experience */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Department</span>
                <span className="text-sm text-white font-medium">{teacher.department}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Experience</span>
                <span className="text-sm text-white font-medium">{teacher.experience.totalYears} years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Rating</span>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-white font-medium">{teacher.performance.rating}/5</span>
                </div>
              </div>
            </div>

            {/* Subjects & Classes */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Subjects: {teacher.subjects.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Classes: {teacher.classes.length}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{teacher.user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{teacher.user.phone}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewTeacher(teacher._id)}
                className="flex-1 glass text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-white/10 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditTeacher(teacher._id)}
                className="flex-1 bg-primary-500/20 text-primary-400 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-primary-500/30 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteTeacher(teacher._id)}
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
      {!isLoading && displayTeachers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <GraduationCap className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No teachers found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first teacher</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddTeacher}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto neon-glow-gold"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Teacher</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Teachers