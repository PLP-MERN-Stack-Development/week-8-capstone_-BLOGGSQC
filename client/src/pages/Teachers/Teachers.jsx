import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { teachersAPI } from '../../services/api'
import { Plus, Search, Download, Upload, Mail, Phone, Edit, Trash2, Eye, Users, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const Teachers = () => {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    department: '',
    status: '',
  })
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['teachers', { search, filters, page }],
    queryFn: () => teachersAPI.getAll({ 
      search, 
      ...filters, 
      page, 
      limit: 10 
    }),
    select: (response) => response.data,
  })

  const teachers = data?.teachers || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (teacher) => {
    toast.success(`Editing ${teacher.firstName} ${teacher.lastName}`)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teachersAPI.delete(id)
        toast.success('Teacher deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete teacher')
      }
    }
  }

  const handleView = (teacher) => {
    toast.success(`Viewing ${teacher.firstName} ${teacher.lastName}'s profile`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 glow-purple animate-slide-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Teachers</h1>
            <p className="text-gray-300 text-lg">Manage teacher profiles and assignments</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="futuristic-button flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="futuristic-button flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="futuristic-button-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Teacher
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card animate-slide-up">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="futuristic-input w-full pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="futuristic-input"
            >
              <option value="">All Departments</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="futuristic-input"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-card animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          teachers.map((teacher) => (
            <div key={teacher._id} className="glass-card hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center glow-purple">
                    <span className="text-white font-bold text-lg">
                      {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-sm text-gold-400 capitalize font-medium">{teacher.department}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      teacher.status === 'active' 
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                        : 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
                    }`}>
                      {teacher.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleView(teacher)}
                    className="p-2 text-gray-400 hover:text-neon-blue hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="p-2 text-gray-400 hover:text-neon-green hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="p-2 text-gray-400 hover:text-neon-pink hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <Mail className="h-4 w-4 mr-2 text-neon-blue" />
                  {teacher.email}
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Phone className="h-4 w-4 mr-2 text-neon-green" />
                  {teacher.phone}
                </div>
              </div>

              <div className="glass rounded-xl p-3 mb-4 border border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center text-gray-400">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Classes:
                  </div>
                  <span className="text-white font-medium">{teacher.classes || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    Students:
                  </div>
                  <span className="text-white font-medium">{teacher.totalStudents || 0}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleView(teacher)}
                  className="flex-1 futuristic-button text-sm"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => handleEdit(teacher)}
                  className="flex-1 futuristic-button-primary text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="glass-card">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="futuristic-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="futuristic-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card text-center">
          <div className="text-3xl font-bold gradient-text">{teachers.length}</div>
          <div className="text-sm text-gray-400">Total Teachers</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-3xl font-bold text-neon-blue">{teachers.filter(t => t.department === 'Mathematics').length}</div>
          <div className="text-sm text-gray-400">Mathematics</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-3xl font-bold text-neon-green">{teachers.filter(t => t.department === 'Science').length}</div>
          <div className="text-sm text-gray-400">Science</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-3xl font-bold text-neon-purple">{teachers.filter(t => t.department === 'English').length}</div>
          <div className="text-sm text-gray-400">English</div>
        </div>
      </div>
    </div>
  )
}

export default Teachers