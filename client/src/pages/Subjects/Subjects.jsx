import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { subjectsAPI } from '../../services/api'
import { Plus, BookOpen, Users, Clock, MoreHorizontal } from 'lucide-react'

const Subjects = () => {
  const [showModal, setShowModal] = useState(false)

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectsAPI.getAll(),
    select: (response) => response.data,
  })

  const getSubjectColor = (code) => {
    const colors = {
      'MATH': 'bg-blue-100 text-blue-800',
      'SCI': 'bg-green-100 text-green-800',
      'ENG': 'bg-purple-100 text-purple-800',
      'HIST': 'bg-orange-100 text-orange-800',
      'GEO': 'bg-teal-100 text-teal-800',
      'ART': 'bg-pink-100 text-pink-800',
    }
    return colors[code] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600">Manage curriculum subjects and teaching assignments</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </button>
      </div>

      {/* Subjects Grid */}
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
          subjects?.map((subject) => (
            <div key={subject._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getSubjectColor(subject.code)}`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {subject.code} • Grade {subject.grade}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {subject.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Students Enrolled
                  </div>
                  <span className="font-medium">{subject.enrolledStudents || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Weekly Hours
                  </div>
                  <span className="font-medium">{subject.weeklyHours || 0}h</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Teacher
                  </div>
                  <span className="font-medium text-sm">
                    {subject.teacher?.firstName} {subject.teacher?.lastName}
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

              {/* Subject Statistics */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">This Month</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-500">Assignments</div>
                    <div className="font-medium">{subject.assignmentsCount || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Avg Score</div>
                    <div className="font-medium">{subject.averageScore || 0}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subject Categories */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Mathematics', count: 5, color: 'blue' },
            { name: 'Science', count: 8, color: 'green' },
            { name: 'Languages', count: 6, color: 'purple' },
            { name: 'Social Studies', count: 4, color: 'orange' },
            { name: 'Arts', count: 3, color: 'pink' },
            { name: 'Physical Ed', count: 2, color: 'teal' },
          ].map((category) => (
            <div key={category.name} className="text-center">
              <div className={`h-16 w-16 mx-auto rounded-full bg-${category.color}-100 flex items-center justify-center mb-2`}>
                <BookOpen className={`h-8 w-8 text-${category.color}-600`} />
              </div>
              <div className="text-sm font-medium text-gray-900">{category.name}</div>
              <div className="text-xs text-gray-500">{category.count} subjects</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Subjects