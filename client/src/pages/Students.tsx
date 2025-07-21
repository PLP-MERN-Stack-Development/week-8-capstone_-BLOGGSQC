import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  Award,
  CheckCircle,
  XCircle,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  class: string;
  section: string;
  rollNumber: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  admissionDate: string;
  status: 'active' | 'inactive' | 'graduated';
  avatar?: string;
  attendance: number;
  grade: string;
  subjects: string[];
}

const Students: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const fetchStudents = async () => {
      setTimeout(() => {
        const mockStudents: Student[] = [
          {
            id: '1',
            firstName: 'Alex',
            lastName: 'Johnson',
            email: 'alex.johnson@student.edu',
            studentId: 'STU001',
            class: 'Grade 10',
            section: 'A',
            rollNumber: '101',
            phone: '+1234567890',
            address: '123 Main St, City, State',
            dateOfBirth: '2008-05-15',
            guardianName: 'Robert Johnson',
            guardianPhone: '+1234567891',
            admissionDate: '2023-09-01',
            status: 'active',
            attendance: 94.5,
            grade: 'A',
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
          },
          {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah.williams@student.edu',
            studentId: 'STU002',
            class: 'Grade 10',
            section: 'B',
            rollNumber: '201',
            phone: '+1234567892',
            address: '456 Oak Ave, City, State',
            dateOfBirth: '2008-08-22',
            guardianName: 'Mary Williams',
            guardianPhone: '+1234567893',
            admissionDate: '2023-09-01',
            status: 'active',
            attendance: 97.2,
            grade: 'A+',
            subjects: ['Mathematics', 'Biology', 'Chemistry', 'English'],
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Davis',
            email: 'michael.davis@student.edu',
            studentId: 'STU003',
            class: 'Grade 9',
            section: 'A',
            rollNumber: '301',
            phone: '+1234567894',
            address: '789 Pine St, City, State',
            dateOfBirth: '2009-02-10',
            guardianName: 'John Davis',
            guardianPhone: '+1234567895',
            admissionDate: '2023-09-01',
            status: 'active',
            attendance: 89.8,
            grade: 'B+',
            subjects: ['Mathematics', 'History', 'Geography', 'English'],
          },
          {
            id: '4',
            firstName: 'Emily',
            lastName: 'Brown',
            email: 'emily.brown@student.edu',
            studentId: 'STU004',
            class: 'Grade 11',
            section: 'A',
            rollNumber: '401',
            phone: '+1234567896',
            address: '321 Elm St, City, State',
            dateOfBirth: '2007-11-05',
            guardianName: 'Lisa Brown',
            guardianPhone: '+1234567897',
            admissionDate: '2022-09-01',
            status: 'active',
            attendance: 92.1,
            grade: 'A',
            subjects: ['Advanced Math', 'Physics', 'Chemistry', 'Computer Science'],
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Wilson',
            email: 'david.wilson@student.edu',
            studentId: 'STU005',
            class: 'Grade 12',
            section: 'B',
            rollNumber: '501',
            phone: '+1234567898',
            address: '654 Cedar Rd, City, State',
            dateOfBirth: '2006-07-18',
            guardianName: 'Mark Wilson',
            guardianPhone: '+1234567899',
            admissionDate: '2021-09-01',
            status: 'active',
            attendance: 95.7,
            grade: 'A+',
            subjects: ['Calculus', 'Physics', 'Chemistry', 'Literature'],
          },
        ];
        setStudents(mockStudents);
        setLoading(false);
      }, 1000);
    };

    fetchStudents();
  }, []);

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName} ${student.email} ${student.studentId}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesClass = !filterClass || student.class === filterClass;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const classes = Array.from(new Set(students.map(s => s.class)));

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'graduated': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default: return 'status-pending';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-400';
      case 'A': return 'text-green-300';
      case 'B+': return 'text-yellow-400';
      case 'B': return 'text-yellow-300';
      case 'C+': return 'text-orange-400';
      case 'C': return 'text-orange-300';
      default: return 'text-red-400';
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleAddStudent = () => {
    setShowAddModal(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  const StudentCard: React.FC<{ student: Student }> = ({ student }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 cursor-pointer"
      onClick={() => handleViewDetails(student)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-electric-500 flex items-center justify-center">
            <span className="text-white font-bold">
              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-gray-400 text-sm">{student.studentId}</p>
          </div>
        </div>
        <span className={`status-badge ${getStatusColor(student.status)}`}>
          {student.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-300">
          <GraduationCap size={16} className="mr-2" />
          <span>{student.class} - Section {student.section}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Mail size={16} className="mr-2" />
          <span>{student.email}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <CheckCircle size={16} className="mr-2" />
          <span>Attendance: {student.attendance}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <Award size={16} className={getGradeColor(student.grade)} />
          <span className={`font-semibold ${getGradeColor(student.grade)}`}>
            Grade {student.grade}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Roll: {student.rollNumber}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-white/10 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-32"></div>
                  <div className="h-3 bg-white/10 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-full"></div>
                <div className="h-3 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Users className="mr-3" size={32} />
              Students
            </h1>
            <p className="text-gray-400 mt-1">Manage student information and records</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button flex items-center space-x-2"
            >
              <Upload size={18} />
              <span>Import</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddStudent}
              className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Student</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          >
            <option value="" className="bg-gray-800">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls} className="bg-gray-800">{cls}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          >
            <option value="" className="bg-gray-800">All Status</option>
            <option value="active" className="bg-gray-800">Active</option>
            <option value="inactive" className="bg-gray-800">Inactive</option>
            <option value="graduated" className="bg-gray-800">Graduated</option>
          </select>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">
              {filteredStudents.length} students found
            </span>
          </div>
        </div>
      </motion.div>

      {/* Students Grid/Table Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{' '}
              {filteredStudents.length} students
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 glass-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 glass-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Student Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Student Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="glass-button p-2"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profile Section */}
                  <div className="md:col-span-1">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-electric-500 flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-2xl">
                          {selectedStudent.firstName.charAt(0)}{selectedStudent.lastName.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </h3>
                      <p className="text-gray-400">{selectedStudent.studentId}</p>
                      <span className={`status-badge ${getStatusColor(selectedStudent.status)} mt-2`}>
                        {selectedStudent.status}
                      </span>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-3">
                      <div className="bg-white/5 p-3 rounded-xl">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{selectedStudent.attendance}%</div>
                          <div className="text-sm text-gray-400">Attendance</div>
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getGradeColor(selectedStudent.grade)}`}>
                            {selectedStudent.grade}
                          </div>
                          <div className="text-sm text-gray-400">Overall Grade</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <User className="mr-2" size={18} />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Email</label>
                          <p className="text-white">{selectedStudent.email}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Phone</label>
                          <p className="text-white">{selectedStudent.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Date of Birth</label>
                          <p className="text-white">{selectedStudent.dateOfBirth}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Address</label>
                          <p className="text-white">{selectedStudent.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <GraduationCap className="mr-2" size={18} />
                        Academic Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Class</label>
                          <p className="text-white">{selectedStudent.class}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Section</label>
                          <p className="text-white">{selectedStudent.section}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Roll Number</label>
                          <p className="text-white">{selectedStudent.rollNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Admission Date</label>
                          <p className="text-white">{selectedStudent.admissionDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Guardian Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <User className="mr-2" size={18} />
                        Guardian Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Guardian Name</label>
                          <p className="text-white">{selectedStudent.guardianName}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Guardian Phone</label>
                          <p className="text-white">{selectedStudent.guardianPhone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <BookOpen className="mr-2" size={18} />
                        Subjects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-xl font-semibold"
                      >
                        <Edit size={16} className="inline mr-2" />
                        Edit Student
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeleteStudent(selectedStudent.id)}
                        className="bg-red-500/20 border border-red-500/30 text-red-400 py-2 px-4 rounded-xl font-semibold hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Students;