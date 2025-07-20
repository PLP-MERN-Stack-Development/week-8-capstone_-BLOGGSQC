import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { classesAPI } from '../../services/api'
import { Plus, Users, BookOpen, Calendar, MoreHorizontal } from 'lucide-react'

const Classes = () => {
  const [showModal, setShowModal] = useState(false)

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classesAPI.getAll(),
    select: (response) => response.data,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600">Manage class schedules and student assignments</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Class
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          classes?.map((classItem) => (
            <div key={classItem._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Grade {classItem.grade} • Section {classItem.section}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Students
                  </div>
                  <span className="font-medium">{classItem.studentCount || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Subjects
                  </div>
                  <span className="font-medium">{classItem.subjects?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Class Teacher
                  </div>
                  <span className="font-medium text-sm">
                    {classItem.classTeacher?.firstName} {classItem.classTeacher?.lastName}
                  </span>
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

              {/* Recent Activity */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    • Attendance marked for today
                  </p>
                  <p className="text-xs text-gray-500">
                    • Assignment submitted by 25 students
                  </p>
                  <p className="text-xs text-gray-500">
                    • New announcement posted
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {classes?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Total Classes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {classes?.reduce((acc, c) => acc + (c.studentCount || 0), 0) || 0}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {classes?.reduce((acc, c) => acc + (c.subjects?.length || 0), 0) || 0}
          </div>
          <div className="text-sm text-gray-600">Total Subjects</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">85%</div>
          <div className="text-sm text-gray-600">Avg Attendance</div>
        </div>
      </div>
    </div>
  )
}

export default Classes