import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Users, Clock, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Menu } from '@headlessui/react';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher: string;
  classes: string[];
  credits: number;
  totalStudents: number;
  weeklyHours: number;
}

const Subjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [subjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Advanced mathematical concepts including algebra, calculus, and geometry',
      teacher: 'Dr. Sarah Johnson',
      classes: ['10-A', '10-B', '11-A'],
      credits: 4,
      totalStudents: 95,
      weeklyHours: 6,
    },
    {
      id: '2',
      name: 'Physics',
      code: 'PHY101',
      description: 'Fundamental principles of physics including mechanics, thermodynamics, and electricity',
      teacher: 'Prof. Michael Davis',
      classes: ['11-A', '12-A'],
      credits: 3,
      totalStudents: 62,
      weeklyHours: 5,
    },
    {
      id: '3',
      name: 'Chemistry',
      code: 'CHEM101',
      description: 'Organic and inorganic chemistry principles and laboratory work',
      teacher: 'Dr. Emily Brown',
      classes: ['10-A', '11-B', '12-B'],
      credits: 3,
      totalStudents: 78,
      weeklyHours: 5,
    },
    {
      id: '4',
      name: 'English Literature',
      code: 'ENG101',
      description: 'Study of classic and contemporary literature, poetry, and prose',
      teacher: 'Ms. Jessica Wilson',
      classes: ['9-A', '10-A', '11-A'],
      credits: 3,
      totalStudents: 112,
      weeklyHours: 4,
    },
    {
      id: '5',
      name: 'Biology',
      code: 'BIO101',
      description: 'Life sciences including cell biology, genetics, and ecology',
      teacher: 'Dr. Robert Lee',
      classes: ['9-B', '10-B', '11-B'],
      credits: 4,
      totalStudents: 89,
      weeklyHours: 6,
    },
  ]);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-white">Subjects</h1>
            <p className="text-gray-400 mt-1">Manage curriculum subjects and course information</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Subject</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
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

      {/* Subjects Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredSubjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -4 }}
            className="glass-card p-6 card-hover"
          >
            {/* Subject Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{subject.name}</h3>
                  <p className="text-gray-400 text-sm font-mono">{subject.code}</p>
                  <p className="text-gray-400 text-sm">by {subject.teacher}</p>
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
                          View Details
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
                          Edit Subject
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

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {subject.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users size={16} className="text-blue-400 mr-1" />
                </div>
                <p className="text-white font-semibold text-lg">{subject.totalStudents}</p>
                <p className="text-gray-400 text-xs">Students</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock size={16} className="text-green-400 mr-1" />
                </div>
                <p className="text-white font-semibold text-lg">{subject.weeklyHours}</p>
                <p className="text-gray-400 text-xs">Hours/Week</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <BookOpen size={16} className="text-yellow-400 mr-1" />
                </div>
                <p className="text-white font-semibold text-lg">{subject.credits}</p>
                <p className="text-gray-400 text-xs">Credits</p>
              </div>
            </div>

            {/* Classes */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-white font-medium mb-2 text-sm">Classes Teaching:</p>
              <div className="flex flex-wrap gap-2">
                {subject.classes.map((cls, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-sm font-medium"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredSubjects.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No subjects found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Start by adding your first subject'
            }
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 rounded-xl text-white font-semibold">
            Add Subject
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Subjects;