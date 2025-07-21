import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { studentsAPI } from '../../services/api'
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const Students = () => {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    class: '',
    status: '',
  })
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['students', { search, filters, page }],
    queryFn: () => studentsAPI.getAll({ 
      search, 
      ...filters, 
      page, 
      limit: 10 
    }),
    select: (response) => response.data,
  })

  const students = data?.students || []
  const totalPages = data?.totalPages || 1

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsAPI.delete(id)
        toast.success('Student deleted successfully!')
        refetch()
      } catch (error) {
        toast.error('Failed to delete student')
      }
    }
  }

  const handleView = (student) => {
    toast.success(`Viewing ${student.firstName} ${student.lastName}'s profile`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 glow-blue animate-slide-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Students</h1>
            <p className="text-gray-300 text-lg">Manage student records and information</p>
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
            <button 
              onClick={() => setShowModal(true)}
              className="futuristic-button-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Student
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
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="futuristic-input w-full pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="futuristic-input"
            >
              <option value="">All Classes</option>
              <option value="10A">Class 10A</option>
              <option value="10B">Class 10B</option>
              <option value="11A">Class 11A</option>
              <option value="11B">Class 11B</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="futuristic-input"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-card animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-600 rounded"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          students.map((student) => (
            <div key={student._id} className="glass-card hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center glow-blue">
                    <span className="text-white font-bold text-sm">
                      {student.firstName?.[0]}{student.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">{student.studentId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleView(student)}
                    className="p-2 text-gray-400 hover:text-neon-blue hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(student)}
                    className="p-2 text-gray-400 hover:text-neon-green hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="p-2 text-gray-400 hover:text-neon-pink hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Class:</span>
                  <span className="text-white font-medium">{student.class}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white font-medium">{student.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white font-medium">{student.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    student.status === 'active' 
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                      : 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
                  }`}>
                    {student.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleView(student)}
                    className="flex-1 futuristic-button text-sm"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => handleEdit(student)}
                    className="flex-1 futuristic-button-primary text-sm"
                  >
                    Edit
                  </button>
                </div>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card text-center">
          <div className="text-3xl font-bold gradient-text">{students.length}</div>
          <div className="text-sm text-gray-400">Total Students</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-3xl font-bold text-neon-green">{students.filter(s => s.status === 'active').length}</div>
          <div className="text-sm text-gray-400">Active</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-3xl font-bold text-neon-pink">{students.filter(s => s.status === 'inactive').length}</div>
          <div className="text-sm text-gray-400">Inactive</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-3xl font-bold text-gold-400">4</div>
          <div className="text-sm text-gray-400">Classes</div>
        </div>
      </div>
    </div>
  )
}

export default Students