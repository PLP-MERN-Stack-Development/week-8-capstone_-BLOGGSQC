import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, BookOpen, UserCheck, Search, Filter } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  section: string;
  teacher: string;
  students: number;
  subjects: string[];
  classroom: string;
  timetable: TimeSlot[];
}

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
}

const Classes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [classes] = useState<Class[]>([
    {
      id: '1',
      name: '10',
      section: 'A',
      teacher: 'Dr. Sarah Johnson',
      students: 32,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'],
      classroom: 'Room 101',
      timetable: [
        { day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics' },
        { day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'Physics' },
      ],
    },
    {
      id: '2',
      name: '9',
      section: 'B',
      teacher: 'Prof. Michael Davis',
      students: 28,
      subjects: ['English', 'History', 'Geography', 'Mathematics', 'Science'],
      classroom: 'Room 102',
      timetable: [
        { day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'English' },
        { day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'Mathematics' },
      ],
    },
    {
      id: '3',
      name: '11',
      section: 'A',
      teacher: 'Dr. Emily Brown',
      students: 30,
      subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English'],
      classroom: 'Room 201',
      timetable: [
        { day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Biology' },
        { day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'Chemistry' },
      ],
    },
  ]);

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-white">Classes</h1>
            <p className="text-gray-400 mt-1">Manage class sections and schedules</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Create Class</span>
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
                placeholder="Search classes..."
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

      {/* Classes Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredClasses.map((cls, index) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="glass-card p-6 card-hover cursor-pointer"
          >
            {/* Class Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {cls.name}{cls.section}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Class {cls.name}-{cls.section}
                  </h3>
                  <p className="text-gray-400 text-sm">{cls.classroom}</p>
                </div>
              </div>
            </div>

            {/* Class Teacher */}
            <div className="flex items-center space-x-3 mb-4">
              <UserCheck size={18} className="text-primary-400" />
              <div>
                <p className="text-white font-medium">{cls.teacher}</p>
                <p className="text-gray-400 text-sm">Class Teacher</p>
              </div>
            </div>

            {/* Student Count */}
            <div className="flex items-center space-x-3 mb-4">
              <Users size={18} className="text-blue-400" />
              <div>
                <p className="text-white font-medium">{cls.students} Students</p>
                <p className="text-gray-400 text-sm">Total Enrollment</p>
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen size={16} className="text-green-400" />
                <p className="text-white font-medium">Subjects ({cls.subjects.length})</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {cls.subjects.slice(0, 3).map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs"
                  >
                    {subject}
                  </span>
                ))}
                {cls.subjects.length > 3 && (
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-lg text-xs">
                    +{cls.subjects.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Today's Schedule Preview */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-white font-medium mb-2">Today's Schedule</p>
              <div className="space-y-2">
                {cls.timetable.slice(0, 2).map((slot, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{slot.subject}</span>
                    <span className="text-gray-400">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
                {cls.timetable.length > 2 && (
                  <p className="text-gray-400 text-xs">
                    +{cls.timetable.length - 2} more periods
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredClasses.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No classes found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Start by creating your first class'
            }
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 rounded-xl text-white font-semibold">
            Create Class
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Classes;