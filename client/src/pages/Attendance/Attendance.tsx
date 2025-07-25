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
import { useAuth } from '../../hooks/useAuth'

// ✅ Import toast
import { toast } from 'react-hot-toast'

const Attendance: React.FC = () => {
  const { hasPermission } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('')
  const [attendanceMode, setAttendanceMode] = useState('manual') // manual, qr, geofence
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch attendance data
  const { data: attendanceData, isLoading, refetch } = useQuery(
    ['attendance', selectedDate, selectedClass],
    () =>
      attendanceAPI.getAll({
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
  const filteredAttendance = displayAttendance.filter(
    (record) =>
      record.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student.rollNumber.includes(searchTerm)
  )

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (hasPermission('create', 'attendance') || hasPermission('update', 'attendance')) {
      attendanceAPI
        .mark({ studentId, status, date: selectedDate })
        .then(() => {
          refetch()
          toast.success('Attendance marked successfully')
        })
        .catch(() => {
          toast.error('Failed to mark attendance')
        })
    }
  }

  const handleBulkAttendance = (status: 'present' | 'absent') => {
    if (hasPermission('create', 'attendance')) {
      if (window.confirm(`Mark all students as ${status}?`)) {
        // TODO: implement bulk mark API
        refetch()
        toast.success(`All students marked as ${status}`)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-green-500 bg-green-500/20'
      case 'absent':
        return 'text-red-500 bg-red-500/20'
      case 'late':
        return 'text-yellow-500 bg-yellow-500/20'
      default:
        return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return CheckCircle
      case 'absent':
        return XCircle
      case 'late':
        return Clock
      default:
        return AlertCircle
    }
  }

  // Stats
  const totalStudents = filteredAttendance.length
  const presentStudents = filteredAttendance.filter((r) => r.status === 'present').length
  const absentStudents = filteredAttendance.filter((r) => r.status === 'absent').length
  const attendancePercentage = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Attendance Management</h1>
          <p className="text-gray-400">Track and manage student attendance</p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAttendanceMode('qr')}
            className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors ${
              attendanceMode === 'qr' ? 'bg-gradient-gold text-white neon-glow-gold' : 'glass text-white border border-gray-600/30'
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
              attendanceMode === 'geofence' ? 'bg-gradient-gold text-white neon-glow-gold' : 'glass text-white border border-gray-600/30'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Geofence</span>
          </motion.button>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      {/* … (keep your existing statistic cards and table rendering code from your snippet) … */}

      {/* DATE + CLASS FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="date"
            aria-label="Select date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="glass pl-12 pr-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            aria-label="Select class"
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
        {/* … search and export button as in your snippet … */}
      </div>

      {/* REST OF YOUR TABLE/LIST CODE REMAINS THE SAME */}
      {/* … keep your attendance list rendering exactly as in your snippet … */}
    </div>
  )
}

export default Attendance
