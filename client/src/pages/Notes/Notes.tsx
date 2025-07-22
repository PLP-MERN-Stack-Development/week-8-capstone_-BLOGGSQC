import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Video,
  Image,
  File,
  Calendar,
  User,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react'
import { notesAPI } from '../../services/api'

const Notes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch notes data
  const { data: notesData, isLoading, refetch } = useQuery(
    ['notes', currentPage, searchTerm, selectedSubject, selectedType],
    () => notesAPI.getAll({
      page: currentPage,
      search: searchTerm,
      subject: selectedSubject,
      type: selectedType
    }),
    {
      keepPreviousData: true
    }
  )

  const notes = notesData?.data?.notes || []

  // Mock data for demonstration
  const mockNotes = [
    {
      _id: '1',
      title: 'Quadratic Equations - Complete Guide',
      description: 'Comprehensive notes covering all methods of solving quadratic equations with examples and practice problems.',
      content: 'A quadratic equation is a polynomial equation of degree 2...',
      subject: { name: 'Mathematics', code: 'MATH101' },
      class: { name: 'Grade 10A' },
      teacher: { 
        user: { 
          name: 'Dr. Sarah Johnson',
          avatar: { url: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100' }
        }
      },
      type: 'lesson',
      tags: ['algebra', 'equations', 'mathematics'],
      attachments: [
        { name: 'quadratic-formulas.pdf', type: 'pdf', size: '2.5 MB' },
        { name: 'practice-problems.docx', type: 'document', size: '1.2 MB' }
      ],
      views: 156,
      likes: 23,
      comments: 8,
      isPublic: true,
      createdAt: '2024-12-10',
      updatedAt: '2024-12-15'
    },
    {
      _id: '2',
      title: 'Newton\'s Laws of Motion',
      description: 'Detailed explanation of Newton\'s three laws of motion with real-world examples and applications.',
      content: 'Newton\'s first law states that an object at rest stays at rest...',
      subject: { name: 'Physics', code: 'PHY101' },
      class: { name: 'Grade 10A' },
      teacher: { 
        user: { 
          name: 'Prof. Michael Chen',
          avatar: { url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100' }
        }
      },
      type: 'lecture',
      tags: ['physics', 'motion', 'laws'],
      attachments: [
        { name: 'newton-laws-presentation.pptx', type: 'presentation', size: '5.8 MB' },
        { name: 'motion-demo-video.mp4', type: 'video', size: '45.2 MB' }
      ],
      views: 203,
      likes: 31,
      comments: 12,
      isPublic: true,
      createdAt: '2024-12-08',
      updatedAt: '2024-12-12'
    },
    {
      _id: '3',
      title: 'Shakespeare\'s Hamlet - Character Analysis',
      description: 'In-depth character analysis of major characters in Hamlet with themes and literary devices.',
      content: 'Hamlet, the Prince of Denmark, is one of Shakespeare\'s most complex characters...',
      subject: { name: 'English Literature', code: 'ENG101' },
      class: { name: 'Grade 11A' },
      teacher: { 
        user: { 
          name: 'Emma Thompson',
          avatar: { url: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100' }
        }
      },
      type: 'study-guide',
      tags: ['shakespeare', 'hamlet', 'literature', 'analysis'],
      attachments: [
        { name: 'hamlet-character-map.png', type: 'image', size: '890 KB' },
        { name: 'themes-analysis.pdf', type: 'pdf', size: '3.1 MB' }
      ],
      views: 89,
      likes: 18,
      comments: 5,
      isPublic: false,
      createdAt: '2024-12-05',
      updatedAt: '2024-12-14'
    }
  ]

  const displayNotes = notes.length > 0 ? notes : mockNotes

  const handleAddNote = () => {
    setShowAddModal(true)
  }

  const handleEditNote = (noteId: string) => {
    console.log('Edit note:', noteId)
  }

  const handleDeleteNote = (noteId: string) => {
    console.log('Delete note:', noteId)
  }

  const handleViewNote = (noteId: string) => {
    console.log('View note:', noteId)
  }

  const handleLikeNote = (noteId: string) => {
    console.log('Like note:', noteId)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return FileText
      case 'lecture': return Video
      case 'study-guide': return BookOpen
      case 'assignment': return Edit
      default: return File
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-500/20 text-blue-400'
      case 'lecture': return 'bg-purple-500/20 text-purple-400'
      case 'study-guide': return 'bg-green-500/20 text-green-400'
      case 'assignment': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText
      case 'document': return FileText
      case 'presentation': return FileText
      case 'video': return Video
      case 'image': return Image
      default: return File
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
          <h1 className="text-3xl font-bold text-white mb-2">Notes & Materials</h1>
          <p className="text-gray-400">Manage teaching materials, notes, and study resources</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNote}
          className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold mt-4 md:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Note</span>
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
              placeholder="Search notes by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="glass pl-12 pr-8 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30 appearance-none"
            >
              <option value="">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="english">English</option>
            </select>
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
              <option value="lesson">Lesson</option>
              <option value="lecture">Lecture</option>
              <option value="study-guide">Study Guide</option>
              <option value="assignment">Assignment</option>
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

      {/* Notes Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {displayNotes.map((note, index) => {
          const TypeIcon = getTypeIcon(note.type)
          
          return (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300"
            >
              {/* Note Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{note.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(note.type)}`}>
                      {note.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{note.subject.name} • {note.class.name}</p>
                </div>
                
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <TypeIcon className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={note.teacher.user.avatar?.url || 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={note.teacher.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-white font-medium">{note.teacher.user.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{note.description}</p>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
                      +{note.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Attachments */}
              {note.attachments && note.attachments.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Attachments ({note.attachments.length})</p>
                  <div className="space-y-1">
                    {note.attachments.slice(0, 2).map((attachment, idx) => {
                      const AttachmentIcon = getAttachmentIcon(attachment.type)
                      return (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-gray-300">
                          <AttachmentIcon className="h-3 w-3 text-gray-400" />
                          <span className="truncate">{attachment.name}</span>
                          <span className="text-gray-500">({attachment.size})</span>
                        </div>
                      )
                    })}
                    {note.attachments.length > 2 && (
                      <p className="text-xs text-gray-400 ml-5">
                        +{note.attachments.length - 2} more files
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{note.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{note.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{note.comments}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {note.isPublic && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Public"></div>
                  )}
                  <span className="text-xs text-gray-400">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewNote(note._id)}
                  className="flex-1 glass text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-white/10 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditNote(note._id)}
                  className="flex-1 bg-primary-500/20 text-primary-400 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 hover:bg-primary-500/30 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLikeNote(note._id)}
                  className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500/20 text-blue-400 p-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
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
      {!isLoading && displayNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No notes found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first note</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNote}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto neon-glow-gold"
          >
            <Plus className="h-5 w-5" />
            <span>Create First Note</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Notes