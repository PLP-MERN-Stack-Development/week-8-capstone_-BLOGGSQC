import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { Menu } from '@headlessui/react';

interface Teacher {
  id: string;
  teacherId: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  experience: number;
  avatar: string;
  status: 'active' | 'inactive';
  joiningDate: string;
}

const Teachers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  
  const [teachers] = useState<Teacher[]>([
    {
      id: '1',
      teacherId: 'TCH001',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '+1 234 567 8901',
      subjects: ['Mathematics', 'Physics'],
      classes: ['10-A', '11-B', '12-A'],
      qualification: 'PhD in Mathematics',
      experience: 12,
      avatar: 'SJ',
      status: 'active',
      joiningDate: '2018-08-15',
    },
    {
      id: '2',
      teacherId: 'TCH002',
      name: 'Prof. Michael Davis',
      email: 'michael.davis@school.edu',
      phone: '+1 234 567 8902',
      subjects: ['English', 'Literature'],
      classes: ['9-A', '10-B', '11-A'],
      qualification: 'MA in English Literature',
      experience: 8,
      avatar: 'MD',
      status: 'active',
      joiningDate: '2020-01-20',
    },
    {
      id: '3',
      teacherId: 'TCH003',
      name: 'Dr. Emily Brown',
      email: 'emily.brown@school.edu',
      phone: '+1 234 567 8903',
      subjects: ['Biology', 'Chemistry'],
      classes: ['9-B', '10-A'],
      qualification: 'PhD in Biology',
      experience: 15,
      avatar: 'EB',
      status: 'active',
      joiningDate: '2016-03-10',
    },
  ]);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === '' || teacher.subjects.includes(filterSubject);
    
    return matchesSearch && matchesSubject;
  });

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
            <h1 className="text-3xl font-bold text-white">Teachers</h1>
            <p className="text-gray-400 mt-1">Manage faculty members and their information</p>
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
              className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Teacher</span>
            </motion.button>
          </div>
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
                placeholder="Search teachers..."
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
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Literature">Literature</option>
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

      {/* Teachers Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredTeachers.map((teacher, index) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -4 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{teacher.avatar}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{teacher.name}</h3>
                  <p className="text-gray-400">{teacher.teacherId}</p>
                  <p className="text-sm text-gray-400">{teacher.qualification}</p>
                </div>
              </div>

              <Menu as="div" className="relative">
                <Menu.Button className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <MoreVertical size={18} className="text-gray-400" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 glass-card divide-y divide-white/10 z-10">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-white/10' : ''
                          } flex items-center w-full px-4 py-2 text-white`}
                        >
                          <Eye className="mr-2" size={16} />
                          View Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-white/10' : ''
                          } flex items-center w-full px-4 py-2 text-white`}
                        >
                          <Edit className="mr-2" size={16} />
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-red-500/10' : ''
                          } flex items-center w-full px-4 py-2 text-red-400`}
                        >
                          <Trash2 className="mr-2" size={16} />
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm">{teacher.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm">{teacher.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm">Experience: {teacher.experience} years</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <BookOpen size={16} className="text-gray-400" />
                <span className="text-sm">Joined: {new Date(teacher.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="mb-3">
                <p className="text-sm text-gray-400 mb-2">Subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-xs"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Classes:</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.classes.map((cls, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredTeachers.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No teachers found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || filterSubject
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first teacher'
            }
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 rounded-xl text-white font-semibold">
            Add Teacher
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Teachers;