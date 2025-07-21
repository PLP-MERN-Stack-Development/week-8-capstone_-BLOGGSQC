import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  totalMarks: number;
  submissions: number;
  totalStudents: number;
  status: 'active' | 'expired' | 'draft';
  createdAt: string;
  attachments: number;
}

const Assignments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Quadratic Equations Practice',
      subject: 'Mathematics',
      class: '10-A',
      dueDate: '2024-02-15',
      totalMarks: 50,
      submissions: 28,
      totalStudents: 32,
      status: 'active',
      createdAt: '2024-01-20',
      attachments: 2,
    },
    {
      id: '2',
      title: 'Shakespeare Essay Analysis',
      subject: 'English',
      class: '11-B',
      dueDate: '2024-02-20',
      totalMarks: 75,
      submissions: 15,
      totalStudents: 25,
      status: 'active',
      createdAt: '2024-01-25',
      attachments: 1,
    },
    {
      id: '3',
      title: 'Photosynthesis Lab Report',
      subject: 'Biology',
      class: '9-A',
      dueDate: '2024-01-30',
      totalMarks: 40,
      submissions: 30,
      totalStudents: 30,
      status: 'expired',
      createdAt: '2024-01-15',
      attachments: 3,
    },
  ]);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === '' || assignment.subject === filterSubject;
    const matchesStatus = filterStatus === '' || assignment.status === filterStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'expired':
        return 'bg-red-500/20 text-red-400';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'expired':
        return <XCircle size={16} />;
      case 'draft':
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
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
            <h1 className="text-3xl font-bold text-white">Assignments</h1>
            <p className="text-gray-400 mt-1">Create and manage assignments for your students</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Create Assignment</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="md:w-48">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>

          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button flex items-center space-x-2"
          >
            <Filter size={18} />
            <span>More Filters</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Assignments List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {filteredAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-500/20 rounded-xl">
                    <FileText className="w-6 h-6 text-primary-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{assignment.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)}
                        <span className="capitalize">{assignment.status}</span>
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <BookOpen size={16} />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>Class {assignment.class}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-sm">
                        <span className="text-gray-400">Submissions: </span>
                        <span className="text-white font-medium">
                          {assignment.submissions}/{assignment.totalStudents}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Total Marks: </span>
                        <span className="text-white font-medium">{assignment.totalMarks}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Attachments: </span>
                        <span className="text-white font-medium">{assignment.attachments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-32">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(assignment.submissions / assignment.totalStudents) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button p-2"
                    title="Download submissions"
                  >
                    <Download size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button p-2"
                    title="Upload materials"
                  >
                    <Upload size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredAssignments.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-12 text-center"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No assignments found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || filterSubject || filterStatus
              ? 'Try adjusting your search or filters'
              : 'Start by creating your first assignment'
            }
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 rounded-xl text-white font-semibold">
            Create Assignment
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Assignments;