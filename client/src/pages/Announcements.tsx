import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Bell,
  Users,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: string[];
  author: string;
  createdAt: string;
  expiryDate?: string;
  isActive: boolean;
  viewCount: number;
}

const Announcements: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAudience, setFilterAudience] = useState('');
  
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Parent-Teacher Conference Scheduled',
      content: 'We are pleased to announce that Parent-Teacher conferences will be held on March 15-16, 2024. Please schedule your appointments through the parent portal.',
      priority: 'high',
      targetAudience: ['parents', 'teachers'],
      author: 'Principal Sarah Wilson',
      createdAt: '2024-02-08',
      expiryDate: '2024-03-20',
      isActive: true,
      viewCount: 156,
    },
    {
      id: '2',
      title: 'Science Fair Registration Open',
      content: 'Registration for the Annual Science Fair is now open. Students can submit their project proposals by February 28, 2024.',
      priority: 'medium',
      targetAudience: ['students', 'teachers'],
      author: 'Dr. Robert Lee',
      createdAt: '2024-02-05',
      expiryDate: '2024-02-28',
      isActive: true,
      viewCount: 89,
    },
    {
      id: '3',
      title: 'Library Hours Extended',
      content: 'Starting February 12, the school library will remain open until 8 PM on weekdays to support student study sessions.',
      priority: 'low',
      targetAudience: ['students'],
      author: 'Librarian Mary Johnson',
      createdAt: '2024-02-03',
      expiryDate: '2024-06-30',
      isActive: true,
      viewCount: 67,
    },
    {
      id: '4',
      title: 'Winter Break Assignments',
      content: 'Please note that all assignments given during winter break are due on the first day of school. Contact your teachers if you have questions.',
      priority: 'medium',
      targetAudience: ['students', 'parents'],
      author: 'Academic Coordinator',
      createdAt: '2024-01-15',
      expiryDate: '2024-02-01',
      isActive: false,
      viewCount: 234,
    },
  ]);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === '' || announcement.priority === filterPriority;
    const matchesAudience = filterAudience === '' || announcement.targetAudience.includes(filterAudience);
    
    return matchesSearch && matchesPriority && matchesAudience;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} />;
      case 'medium':
        return <Info size={16} />;
      case 'low':
        return <CheckCircle size={16} />;
      default:
        return <Info size={16} />;
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
            <h1 className="text-3xl font-bold text-white">Announcements</h1>
            <p className="text-gray-400 mt-1">Create and manage school-wide communications</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Announcement</span>
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
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="lg:w-48">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="lg:w-48">
            <select
              value={filterAudience}
              onChange={(e) => setFilterAudience(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Audiences</option>
              <option value="students">Students</option>
              <option value="teachers">Teachers</option>
              <option value="parents">Parents</option>
              <option value="admin">Admin</option>
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

      {/* Announcements List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {filteredAnnouncements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className={`glass-card p-6 card-hover ${!announcement.isActive ? 'opacity-75' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`p-3 rounded-xl ${getPriorityColor(announcement.priority)}`}>
                  <Bell className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{announcement.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${getPriorityColor(announcement.priority)}`}>
                      {getPriorityIcon(announcement.priority)}
                      <span className="capitalize">{announcement.priority} Priority</span>
                    </span>
                    {!announcement.isActive && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {announcement.content}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-gray-400">
                        {announcement.targetAudience.map(audience => 
                          audience.charAt(0).toUpperCase() + audience.slice(1)
                        ).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-400">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye size={16} className="text-gray-400" />
                      <span className="text-gray-400">{announcement.viewCount} views</span>
                    </div>
                    {announcement.expiryDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} className="text-yellow-400" />
                        <span className="text-yellow-400">
                          Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <span className="text-gray-400">By: </span>
                    <span className="text-white">{announcement.author}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2"
                  title="View announcement"
                >
                  <Eye size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2"
                  title="Edit announcement"
                >
                  <Edit size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2 text-red-400"
                  title="Delete announcement"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredAnnouncements.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-12 text-center"
        >
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No announcements found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || filterPriority || filterAudience
              ? 'Try adjusting your search or filters'
              : 'Start by creating your first announcement'
            }
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 rounded-xl text-white font-semibold">
            Create Announcement
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Announcements;