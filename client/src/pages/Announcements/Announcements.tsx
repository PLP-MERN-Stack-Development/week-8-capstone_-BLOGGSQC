import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  Pin,
  Share2
} from 'lucide-react'
import { announcementsAPI } from '../../services/api'

const Announcements: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch announcements data
  const { data: announcementsData, isLoading, refetch } = useQuery(
    ['announcements', currentPage, searchTerm, selectedType, selectedPriority],
    () => announcementsAPI.getAll({
      page: currentPage,
      search: searchTerm,
      type: selectedType,
      priority: selectedPriority
    }),
    {
      keepPreviousData: true
    }
  )

  const announcements = announcementsData?.data?.announcements || []

  // Mock data for demonstration
  const mockAnnouncements = [
    {
      _id: '1',
      title: 'Parent-Teacher Conference Scheduled',
      content: 'We are pleased to announce that the Parent-Teacher Conference for this semester will be held on December 22-23, 2024. Please check your email for your scheduled appointment time.',
      type: 'event',
      priority: 'high',
      author: {
        user: { 
          name: 'Dr. Sarah Johnson',
          avatar: { url: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100' }
        },
        role: 'admin'
      },
      targetAudience: ['parents', 'teachers'],
      isPinned: true,
      isPublished: true,
      publishDate: '2024-12-15',
      expiryDate: '2024-12-25',
      views: 342,
      likes: 28,
      attachments: [
        { name: 'conference-schedule.pdf', type: 'pdf', size: '1.2 MB' }
      ],
      createdAt: '2024-12-15',
      updatedAt: '2024-12-15'
    },
    {
      _id: '2',
      title: 'Winter Break Holiday Notice',
      content: 'School will be closed for Winter Break from December 25, 2024 to January 8, 2025. Classes will resume on January 9, 2025. We wish all students and families a wonderful holiday season!',
      type: 'holiday',
      priority: 'medium',
      author: {
        user: { 
          name: 'System Administrator',
          avatar: { url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100' }
        },
        role: 'admin'
      },
      targetAudience: ['students', 'parents', 'teachers'],
      isPinned: true,
      isPublished: true,
      publishDate: '2024-12-10',
      expiryDate: '2025-01-10',
      views: 567,
      likes: 45,
      attachments: [],
      createdAt: '2024-12-10',
      updatedAt: '2024-12-12'
    },
    {
      _id: '3',
      title: 'Science Fair Registration Open',
      content: 'Registration is now open for the Annual Science Fair 2025. Students from grades 9-12 can participate. Registration deadline is January 15, 2025. Contact your science teachers for more details.',
      type: 'academic',
      priority: 'medium',
      author: {
        user: { 
          name: 'Prof. Michael Chen',
          avatar: { url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100' }
        },
        role: 'teacher'
      },
      targetAudience: ['students', 'parents'],
      isPinned: false,
      isPublished: true,
      publishDate: '2024-12-12',
      expiryDate: '2025-01-20',
      views: 189,
      likes: 15,
      attachments: [
        { name: 'science-fair-guidelines.pdf', type: 'pdf', size: '2.8 MB' },
        { name: 'registration-form.docx', type: 'document', size: '456 KB' }
      ],
      createdAt: '2024-12-12',
      updatedAt: '2024-12-14'
    },
    {
      _id: '4',
      title: 'New Library Hours',
      content: 'Starting January 2025, the school library will have extended hours. New timings: Monday-Friday 7:00 AM - 7:00 PM, Saturday 9:00 AM - 5:00 PM. Sunday remains closed.',
      type: 'general',
      priority: 'low',
      author: {
        user: { 
          name: 'Emma Thompson',
          avatar: { url: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100' }
        },
        role: 'teacher'
      },
      targetAudience: ['students', 'teachers'],
      isPinned: false,
      isPublished: true,
      publishDate: '2024-12-08',
      expiryDate: '2025-02-01',
      views: 234,
      likes: 12,
      attachments: [],
      createdAt: '2024-12-08',
      updatedAt: '2024-12-08'
    }
  ]

  const displayAnnouncements = announcements.length > 0 ? announcements : mockAnnouncements

  const handleAddAnnouncement = () => {
    setShowAddModal(true)
  }

  const handleEditAnnouncement = (announcementId: string) => {
    console.log('Edit announcement:', announcementId)
  }

  const handleDeleteAnnouncement = (announcementId: string) => {
    console.log('Delete announcement:', announcementId)
  }

  const handleViewAnnouncement = (announcementId: string) => {
    console.log('View announcement:', announcementId)
  }

  const handlePinAnnouncement = (announcementId: string) => {
    console.log('Pin announcement:', announcementId)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/20'
      case 'low': return 'text-green-500 bg-green-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-500/20 text-blue-400'
      case 'holiday': return 'bg-purple-500/20 text-purple-400'
      case 'academic': return 'bg-green-500/20 text-green-400'
      case 'general': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return Calendar
      case 'holiday': return Bell
      case 'academic': return CheckCircle
      case 'general': return Info
      default: return AlertCircle
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
          <p className="text-gray-400">Manage and broadcast important information to the school community</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddAnnouncement}
          className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold mt-4 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create Announcement</span>
        </motion.button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search announcements by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Types</option>
              <option value="event">Events</option>
              <option value="holiday">Holidays</option>
              <option value="academic">Academic</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
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
      </motion.div>

      {/* Announcements List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {displayAnnouncements.map((announcement, index) => {
          const TypeIcon = getTypeIcon(announcement.type)
          
          return (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300"
            >
              {/* Announcement Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <TypeIcon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {announcement.isPinned && (
                        <Pin className="h-4 w-4 text-primary-500" />
                      )}
                      <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                        {announcement.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <img
                          src={announcement.author.user.avatar?.url || 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={announcement.author.user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{announcement.author.user.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(announcement.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{announcement.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-300 leading-relaxed">{announcement.content}</p>
              </div>

              {/* Target Audience */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Target Audience:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {announcement.targetAudience.map((audience, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full capitalize">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Download className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Attachments ({announcement.attachments.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {announcement.attachments.map((attachment, idx) => (
                      <div key={idx} className="flex items-center space-x-2 glass rounded-lg px-3 py-2">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{attachment.name}</span>
                        <span className="text-xs text-gray-500">({attachment.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expiry Date */}
              {announcement.expiryDate && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Expires on {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewAnnouncement(announcement._id)}
                    className="glass text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-1 hover:bg-white/10 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditAnnouncement(announcement._id)}
                    className="bg-primary-500/20 text-primary-400 px-4 py-2 rounded-lg font-medium flex items-center space-x-1 hover:bg-primary-500/30 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePinAnnouncement(announcement._id)}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors ${
                      announcement.isPinned 
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                  >
                    <Pin className="h-4 w-4" />
                    <span>{announcement.isPinned ? 'Unpin' : 'Pin'}</span>
                  </motion.button>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500/20 text-blue-400 p-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

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
      {!isLoading && displayAnnouncements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Megaphone className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No announcements found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first announcement</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddAnnouncement}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto neon-glow-gold"
          >
            <Plus className="h-5 w-5" />
            <span>Create First Announcement</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Announcements