import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  Paperclip,
  Calendar,
  BookOpen,
  Users,
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  subject: string;
  class: string;
  teacher: string;
  content: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

const Notes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterClass, setFilterClass] = useState('');
  
  const [notes] = useState<Note[]>([
    {
      id: '1',
      title: 'Quadratic Equations - Chapter 4',
      subject: 'Mathematics',
      class: '10-A',
      teacher: 'Dr. Sarah Johnson',
      content: 'Comprehensive notes on quadratic equations covering standard form, factoring, and the quadratic formula. Includes practice problems and real-world applications.',
      attachments: ['quadratic-equations.pdf', 'practice-problems.docx'],
      createdAt: '2024-02-05',
      updatedAt: '2024-02-08',
      viewCount: 45,
    },
    {
      id: '2',
      title: 'Photosynthesis Process',
      subject: 'Biology',
      class: '9-B',
      teacher: 'Dr. Emily Brown',
      content: 'Detailed explanation of photosynthesis including light and dark reactions, chloroplast structure, and factors affecting photosynthesis rate.',
      attachments: ['photosynthesis-diagram.png', 'lab-experiment.pdf'],
      createdAt: '2024-02-03',
      updatedAt: '2024-02-07',
      viewCount: 38,
    },
    {
      id: '3',
      title: 'Shakespeare\'s Hamlet Analysis',
      subject: 'English',
      class: '11-A',
      teacher: 'Prof. Michael Davis',
      content: 'Character analysis and themes in Hamlet, including the psychological aspects of the protagonist and the play\'s historical context.',
      attachments: ['hamlet-analysis.pdf'],
      createdAt: '2024-02-01',
      updatedAt: '2024-02-06',
      viewCount: 52,
    },
    {
      id: '4',
      title: 'Atomic Structure and Periodic Table',
      subject: 'Chemistry',
      class: '11-B',
      teacher: 'Dr. Robert Lee',
      content: 'Understanding atomic structure, electron configuration, and the organization of elements in the periodic table.',
      attachments: ['periodic-table.jpg', 'electron-config.pdf', 'practice-quiz.docx'],
      createdAt: '2024-01-28',
      updatedAt: '2024-02-04',
      viewCount: 41,
    },
  ]);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === '' || note.subject === filterSubject;
    const matchesClass = filterClass === '' || note.class === filterClass;
    
    return matchesSearch && matchesSubject && matchesClass;
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
            <h1 className="text-3xl font-bold text-white">Notes & Materials</h1>
            <p className="text-gray-400 mt-1">Manage and share educational content with students</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Create Note</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search notes and materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="lg:w-48">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
            </select>
          </div>

          <div className="lg:w-48">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Classes</option>
              <option value="9-A">Class 9-A</option>
              <option value="9-B">Class 9-B</option>
              <option value="10-A">Class 10-A</option>
              <option value="11-A">Class 11-A</option>
              <option value="11-B">Class 11-B</option>
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

      {/* Notes Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredNotes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -4 }}
            className="glass-card p-6 card-hover"
          >
            {/* Note Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                  <FileText className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{note.teacher}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2"
                  title="View note"
                >
                  <Eye size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2"
                  title="Edit note"
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2 text-red-400"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>

            {/* Note Meta Info */}
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <div className="flex items-center space-x-1">
                <BookOpen size={14} className="text-blue-400" />
                <span className="text-gray-300">{note.subject}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={14} className="text-green-400" />
                <span className="text-gray-300">Class {note.class}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} className="text-purple-400" />
                <span className="text-gray-300">{note.viewCount} views</span>
              </div>
            </div>

            {/* Note Content Preview */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
              {note.content}
            </p>

            {/* Attachments */}
            {note.attachments.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Paperclip size={16} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    {note.attachments.length} attachment{note.attachments.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {note.attachments.slice(0, 2).map((attachment, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-lg text-xs text-gray-300 cursor-pointer"
                    >
                      <Download size={12} />
                      <span className="truncate max-w-24">{attachment}</span>
                    </motion.div>
                  ))}
                  {note.attachments.length > 2 && (
                    <div className="px-2 py-1 bg-gray-500/20 rounded-lg text-xs text-gray-400">
                      +{note.attachments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Note Footer */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredNotes.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-12 text-center"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || filterSubject || filterClass
              ? 'Try adjusting your search or filters'
              : 'Start by creating your first note or study material'
            }
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 rounded-xl text-white font-semibold">
            Create Note
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Notes;