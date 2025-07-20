import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { assignmentsAPI } from '../../services/api'
import { Plus, Search, Calendar, Clock, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { format, isAfter, isBefore } from 'date-fns'

const Assignments = () => {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    subject: '',
    class: '',
    status: '',
  })
  const [showModal, setShowModal] = useState(false)

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', { search, filters }],
    queryFn: () => assignmentsAPI.getAll({ search, ...filters }),
    select: (response) => response.data,
  })

  const getStatusInfo = (assignment) => {
    const now = new Date()
    const dueDate = new Date(assignment.dueDate)
    
    if (isAfter(now, dueDate)) {
      return { 
        status: 'overdue', 
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle,
        label: 'Overdue'
      }
    } else if (isBefore(dueDate, new Date(now.getTime() + 24 * 60 * 60 * 1000))) {
      return { 
        status: 'due-soon', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        label: 'Due Soon'
      }
    } else {
      return { 
        status: 'active', 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        label: 'Active'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Create and manage student assignments</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Assignment
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
                placeholder="Search assignments..."
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
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          assignments?.map((assignment) => {
            const statusInfo = getStatusInfo(assignment)
            const StatusIcon = statusInfo.icon
            
            return (
              <div key={assignment._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {assignment.subject} • {assignment.class}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {assignment.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due Date
                    </div>
                    <span className="font-medium">
                      {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Submissions
                    </div>
                    <span className="font-medium">
                      {assignment.submissionCount || 0}/{assignment.totalStudents || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <FileText className="h-4 w-4 mr-2" />
                      Points
                    </div>
                    <span className="font-medium">{assignment.points || 0}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Submission Progress</span>
                    <span>
                      {Math.round(((assignment.submissionCount || 0) / (assignment.totalStudents || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((assignment.submissionCount || 0) / (assignment.totalStudents || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                      View Details
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
                      Edit
                    </button>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <p>Created: {format(new Date(assignment.createdAt), 'MMM dd, yyyy')}</p>
                    <p>By: {assignment.teacher?.firstName} {assignment.teacher?.lastName}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {assignments?.filter(a => getStatusInfo(a).status === 'active').length || 0}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {assignments?.filter(a => getStatusInfo(a).status === 'due-soon').length || 0}
          </div>
          <div className="text-sm text-gray-600">Due Soon</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {assignments?.filter(a => getStatusInfo(a).status === 'overdue').length || 0}
          </div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {assignments?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>
    </div>
  )
}

export default Assignments