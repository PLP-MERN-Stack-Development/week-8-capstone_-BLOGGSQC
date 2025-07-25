import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'
import { studentsAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const Students: React.FC = () => {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  const { data: studentsData, isLoading, refetch } = useQuery(
    ['students', currentPage, searchTerm, selectedClass],
    () =>
      studentsAPI.getAll({
        page: currentPage,
        search: searchTerm,
        class: selectedClass
      }),
    {
      keepPreviousData: true
    }
  )

  const students = studentsData?.data?.students || []

  // Mock data if no API data
  const mockStudents = [
    {
      _id: '1',
      user: {
        name: 'John Smith',
        email: 'john.smith@student.edutech-pro.com',
        phone: '+1-555-1001',
        avatar: { url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      studentId: 'STU24001',
      rollNumber: '001',
      class: { name: 'Grade 10A', grade: 'Grade 10', section: 'A' },
      attendance: { percentage: 94.5 },
      academicRecord: { gpa: 3.8 },
      admissionDate: '2024-08-01',
      isActive: true
    },
    {
      _id: '2',
      user: {
        name: 'Alice Johnson',
        email: 'alice.johnson@student.edutech-pro.com',
        phone: '+1-555-1002',
        avatar: { url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      studentId: 'STU24002',
      rollNumber: '002',
      class: { name: 'Grade 10A', grade: 'Grade 10', section: 'A' },
      attendance: { percentage: 96.2 },
      academicRecord: { gpa: 3.9 },
      admissionDate: '2024-08-01',
      isActive: true
    },
    {
      _id: '3',
      user: {
        name: 'Bob Wilson',
        email: 'bob.wilson@student.edutech-pro.com',
        phone: '+1-555-1003',
        avatar: { url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' }
      },
      studentId: 'STU24003',
      rollNumber: '003',
      class: { name: 'Grade 10B', grade: 'Grade 10', section: 'B' },
      attendance: { percentage: 89.7 },
      academicRecord: { gpa: 3.5 },
      admissionDate: '2024-08-01',
      isActive: true
    }
  ]

  const displayStudents = students.length > 0 ? students : mockStudents

  const handleAddStudent = () => {
    if (hasPermission('create', 'students')) setShowAddModal(true)
  }

  const handleEditStudent = (studentId: string) => {
    if (hasPermission('update', 'students')) {
      console.log('Edit student:', studentId)
    }
  }

  const handleDeleteStudent = (studentId: string) => {
    if (hasPermission('delete', 'students')) {
      if (window.confirm('Are you sure you want to delete this student?')) {
        console.log('Delete student:', studentId)
        refetch()
      }
    }
  }

  const handleViewStudent = (studentId: string) => {
    console.log('View student:', studentId)
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Students Management</h1>
          <p className="text-gray-400">Manage student records, attendance, and academic performance</p>
        </div>
        {hasPermission('create', 'students') && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddStudent}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold mt-4 md:mt-0"
          >
            <Plus className="h-5 w-5" />
            <span>Add Student</span>
          </motion.button>
        )}
      </motion.div>

      {/* FILTERS */}
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
              placeholder="Search students by name, email, or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
          </div>

          {/* Class Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              title="Select class"              // ✅ added title for accessibility
              aria-label="Select class filter" // ✅ added aria-label
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Classes</option>
              <option value="grade-10a">Grade 10A</option>
              <option value="grade-10b">Grade 10B</option>
              <option value="grade-11a">Grade 11A</option>
              <option value="grade-11b">Grade 11B</option>
            </select>
          </div>

          {/* Export */}
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

      {/* STUDENT CARDS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displayStudents.map((student, index) => (
          <motion.div
            key={student._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300"
          >
            {/* HEADER */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <img
                  src={student.user.avatar?.url}
                  alt={student.user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/30"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-950 ${
                    student.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{student.user.name}</h3>
                <p className="text-sm text-gray-400">{student.studentId}</p>
                <p className="text-sm text-primary-500">{student.class.name}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{student.academicRecord.gpa}</div>
                <div className="text-xs text-gray-400">GPA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{student.attendance.percentage}%</div>
                <div className="text-xs text-gray-400">Attendance</div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{student.user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{student.user.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Roll: {student.rollNumber}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewStudent(student._id)}
                className="flex-1 glass text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-white/10 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.button>
              {hasPermission('update', 'students') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditStudent(student._id)}
                  className="flex-1 bg-primary-500/20 text-primary-400 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-primary-500/30 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </motion.button>
              )}
              {hasPermission('delete', 'students') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteStudent(student._id)}
                  className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {!isLoading && displayStudents.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No students found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first student</p>
          {hasPermission('create', 'students') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddStudent}
              className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto neon-glow-gold"
            >
              <Plus className="h-5 w-5" />
              <span>Add First Student</span>
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Students
