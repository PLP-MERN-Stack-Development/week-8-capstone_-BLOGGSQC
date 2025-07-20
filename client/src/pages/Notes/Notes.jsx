import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notesAPI } from '../../services/api'
import { Plus, Search, Filter, Download, FileText, Calendar, User, Eye } from 'lucide-react'
import { format } from 'date-fns'

const Notes = () => {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    subject: '',
    class: '',
    type: '',
  })

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', { search, filters }],
    queryFn: () => notesAPI.getAll({ search, ...filters }),
    select: (response) => response.data,
  })

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'ppt':
      case 'pptx':
        return '📊'
      case 'video':
        return '🎥'
      default:
        return '📁'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
          <p className="text-gray-600">Access and manage educational resources</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Upload Material
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
            </select>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              <option value="10A">Class 10A</option>
              <option value="10B">Class 10B</option>
              <option value="11A">Class 11A</option>
              <option value="11B">Class 11B</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="lecture">Lecture Notes</option>
              <option value="assignment">Assignments</option>
              <option value="reference">Reference Material</option>
              <option value="video">Video Lectures</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          notes?.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4 mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  {getFileIcon(note.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {note.subject} • {note.class}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {note.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <User className="h-3 w-3 mr-1" />
                  {note.uploadedBy?.firstName} {note.uploadedBy?.lastName}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Eye className="h-3 w-3 mr-1" />
                  {note.views || 0} views
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  note.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                  note.type === 'assignment' ? 'bg-orange-100 text-orange-800' :
                  note.type === 'reference' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {note.type}
                </span>
                <div className="flex gap-1">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Size: {note.fileSize || 'Unknown'}</span>
                  <span>Downloads: {note.downloads || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Access Categories */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Lecture Notes', count: 24, color: 'blue', icon: '📚' },
            { name: 'Assignments', count: 18, color: 'orange', icon: '📝' },
            { name: 'Reference Materials', count: 12, color: 'green', icon: '📖' },
            { name: 'Video Lectures', count: 8, color: 'purple', icon: '🎥' },
          ].map((category) => (
            <button
              key={category.name}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium text-gray-900">{category.name}</div>
              <div className="text-xs text-gray-500">{category.count} files</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notes