import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Search,
  Filter,
  UserCheck,
  UserX,
  Clock,
  Users,
  Download,
  QrCode,
  MapPin,
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  remarks?: string;
}

interface ClassAttendance {
  class: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
}

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [viewMode, setViewMode] = useState<'mark' | 'view'>('view');
  
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Alex Johnson',
      class: '10-A',
      date: '2024-02-10',
      status: 'present',
      checkInTime: '08:45',
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Emma Davis',
      class: '10-A',
      date: '2024-02-10',
      status: 'late',
      checkInTime: '09:15',
      remarks: 'Traffic jam',
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Michael Brown',
      class: '10-A',
      date: '2024-02-10',
      status: 'absent',
      remarks: 'Sick',
    },
  ]);

  const [classAttendance] = useState<ClassAttendance[]>([
    {
      class: '10-A',
      date: '2024-02-10',
      totalStudents: 32,
      presentCount: 28,
      absentCount: 3,
      lateCount: 1,
      attendanceRate: 87.5,
    },
    {
      class: '10-B',
      date: '2024-02-10',
      totalStudents: 30,
      presentCount: 27,
      absentCount: 2,
      lateCount: 1,
      attendanceRate: 90.0,
    },
    {
      class: '11-A',
      date: '2024-02-10',
      totalStudents: 28,
      presentCount: 26,
      absentCount: 1,
      lateCount: 1,
      attendanceRate: 92.9,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/20 text-green-400';
      case 'absent':
        return 'bg-red-500/20 text-red-400';
      case 'late':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <UserCheck size={16} />;
      case 'absent':
        return <UserX size={16} />;
      case 'late':
        return <Clock size={16} />;
      default:
        return <Users size={16} />;
    }
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
            <h1 className="text-3xl font-bold text-white">Attendance</h1>
            <p className="text-gray-400 mt-1">Track and manage student attendance records</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button flex items-center space-x-2"
            >
              <QrCode size={18} />
              <span>QR Code</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button flex items-center space-x-2"
            >
              <MapPin size={18} />
              <span>Location</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* View Mode Toggle and Filters */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* View Mode Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('view')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'view'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              View Attendance
            </button>
            <button
              onClick={() => setViewMode('mark')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'mark'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mark Attendance
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Classes</option>
                <option value="10-A">Class 10-A</option>
                <option value="10-B">Class 10-B</option>
                <option value="11-A">Class 11-A</option>
                <option value="11-B">Class 11-B</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Class-wise Attendance Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classAttendance.map((cls, index) => (
          <motion.div
            key={cls.class}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Class {cls.class}</h3>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-400">{cls.attendanceRate}%</p>
                <p className="text-gray-400 text-sm">Attendance</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Present</span>
                </div>
                <span className="text-white font-medium">{cls.presentCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Late</span>
                </div>
                <span className="text-white font-medium">{cls.lateCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserX className="w-5 h-5 text-red-400" />
                  <span className="text-gray-300">Absent</span>
                </div>
                <span className="text-white font-medium">{cls.absentCount}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Total Students</span>
                <span className="text-white">{cls.totalStudents}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                  style={{ width: `${cls.attendanceRate}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Attendance Records */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Detailed Records</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Class</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Check-in</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{record.studentName}</p>
                      <p className="text-gray-400 text-sm">{record.studentId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white">{record.class}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 w-fit ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white">{record.checkInTime || '-'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-300">{record.remarks || '-'}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Attendance;