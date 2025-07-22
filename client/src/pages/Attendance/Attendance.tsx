import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  ClipboardCheck, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  QrCode,
  MapPin
} from 'lucide-react'
import { attendanceAPI } from '../../services/api'

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('')
  const [attendanceMode, setAttendanceMode] = useState('manual') // manual, qr, geofence
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch attendance data
  const { data: attendanceData, isLoading, refetch } = useQuery(
    ['attendance', selectedDate, selectedClass],
    () => attendanceAPI.getAll({
      date: selectedDate,
      class: selectedClass
    }),
    {
      keepPreviousData: true
    }
  )

  const attendance = attendanceData?.data?.attendance || []

  // Mock data for demonstration
  const mockAttendance = [
    {
      _id: '1',
      student: {
        _id: 'student1',
        user: { 
          name: 'John Smith',
          avatar: { url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' }
        },
        studentId: 'STU24001',
        rollNumber: '001',
        class: { name: 'Grade 10A' }
      },
      date: selectedDate,
      status: 'present',
      timeIn: '08:15',
      timeOut: null,
      markedBy: { name: 'Dr. Sarah Johnson' }
    },
    {
      _id: '2',
      student: {
        _id: 'student2',
        user: { 
          name: 'Alice Johnson',
          avatar: { url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' }
        },
        studentId: 'STU24002',
        rollNumber: '002',
        class: { name: 'Grade 10A' }
      },
      date: selectedDate,
      status: 'absent',
      timeIn: null,
      timeOut: null,
      markedBy: { name: 'Dr. Sarah Johnson' },
      reason: 'Sick leave'
    },
    {
      _id: '3',
      student: {
        _id: 'student3',
        user: { 
          name: 'Bob Wilson',
          avatar: { url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' }
        },
        studentId: 'STU24003',
        rollNumber: '003',
        class: { name: 'Grade 10A' }
      },
      date: selectedDate,
      status: 'late',
      timeIn: '08:45',
      timeOut: null,
      markedBy: { name: 'Dr. Sarah Johnson' }
    }
  ]

  const displayAttendance = attendance.length > 0 ? attendance : mockAttendance

  // Filter attendance based on search
  const filteredAttendance = displayAttendance.filter(record =>
    record.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.student.rollNumber.includes(searchTerm)
  )

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    console.log('Mark attendance:', studentId, status)
    // API call to mark attendance
  }

  const handleBulkAttendance = (status: 'present' | 'absent') => {
    console.log('Bulk mark attendance:', status)
    // API call for bulk attendance
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-500 bg-green-500/20'
      case 'absent': return 'text-red-500 bg-red-500/20'
      case 'late': return 'text-yellow-500 bg-yellow-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return CheckCircle
      case 'absent': return XCircle
      case 'late': return Clock
      default: return AlertCircle
    }
  }

  // Calculate statistics
  const totalStudents = filteredAttendance.length
  const presentStudents = filteredAttendance.filter(r => r.status === 'present').length
  const absentStudents = filteredAttendance.filter(r => r.status === 'absent').length
  const lateStudents = filteredAttendance.filter(r => r.status === 'late').length
  const attendancePercentage = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Attendance Management</h1>
          <p className="text-gray-400">Track and manage student attendance with multiple methods</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAttendanceMode('qr')}
            className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors ${
              attendanceMode === 'qr' 
                ? 'bg-gradient-gold text-white neon-glow-gold' 
                : 'glass text-white border border-gray-600/30'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>QR Code</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAttendanceMode('geofence')}
            className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors ${
              attendanceMode === 'geofence' 
                ? 'bg-gradient-gold text-white neon-glow-gold' 
                : 'glass text-white border border-gray-600/30'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Geofence</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-strong rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white">{totalStudents}</div>
          <div className="text-sm text-gray-400">Total Students</div>
        </div>
        
        <div className="glass-strong rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white">{presentStudents}</div>
          <div className="text-sm text-gray-400">Present</div>
        </div>
        
        <div className="glass-strong rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-white">{absentStudents}</div>
          <div className="text-sm text-gray-400">Absent</div>
        </div>
        
        <div className="glass-strong rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-5 w-5 text-primary-500" />
          </div>
          <div className="text-2xl font-bold text-white">{attendancePercentage}%</div>
          <div className="text-sm text-gray-400">Attendance Rate</div>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Date Picker */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass pl-12 pr-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
          </div>

          {/* Class Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Classes</option>
              <option value="grade-10a">Grade 10A</option>
              <option value="grade-10b">Grade 10B</option>
              <option value="grade-11a">Grade 11A</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
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

        {/* Bulk Actions */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBulkAttendance('present')}
            className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-green-500/30 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark All Present</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBulkAttendance('absent')}
            className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-red-500/30 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            <span>Mark All Absent</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Attendance List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="space-y-4">
          {filteredAttendance.map((record, index) => {
            const StatusIcon = getStatusIcon(record.status)
            
            return (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={record.student.user.avatar?.url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={record.student.user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-600/30"
                  />
                  
                  <div>
                    <h3 className="text-white font-medium">{record.student.user.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>ID: {record.student.studentId}</span>
                      <span>Roll: {record.student.rollNumber}</span>
                      <span>{record.student.class.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Time Info */}
                  {record.timeIn && (
                    <div className="text-right">
                      <div className="text-sm text-white">In: {record.timeIn}</div>
                      {record.timeOut && (
                        <div className="text-sm text-gray-400">Out: {record.timeOut}</div>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(record.status)}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-sm font-medium capitalize">{record.status}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMarkAttendance(record.student._id, 'present')}
                      className="w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center hover:bg-green-500/30 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMarkAttendance(record.student._id, 'absent')}
                      className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMarkAttendance(record.student._id, 'late')}
                      className="w-8 h-8 bg-yellow-500/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-500/30 transition-colors"
                    >
                      <Clock className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

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
        {!isLoading && filteredAttendance.length === 0 && (
          <div className="text-center py-12">
            <ClipboardCheck className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No attendance records found</h3>
            <p className="text-gray-500">Select a date and class to view attendance records</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Attendance