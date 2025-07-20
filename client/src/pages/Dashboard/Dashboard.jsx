import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { analyticsAPI } from '../../services/api'
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  ClipboardCheck,
  PenTool,
  Bell
} from 'lucide-react'
import StatCard from '../../components/UI/StatCard'
import Chart from '../../components/UI/Chart'
import RecentActivity from '../../components/Dashboard/RecentActivity'
import UpcomingEvents from '../../components/Dashboard/UpcomingEvents'

const Dashboard = () => {
  const { user } = useAuth()
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => analyticsAPI.getDashboardStats(),
    select: (response) => response.data,
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={GraduationCap}
          color="blue"
          trend={stats?.studentsTrend}
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={Users}
          color="green"
          trend={stats?.teachersTrend}
        />
        <StatCard
          title="Total Classes"
          value={stats?.totalClasses || 0}
          icon={BookOpen}
          color="purple"
          trend={stats?.classesTrend}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendanceRate || 0}%`}
          icon={ClipboardCheck}
          color="orange"
          trend={stats?.attendanceTrend}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <Chart
            data={stats?.attendanceChart || []}
            type="line"
            height={300}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <Chart
            data={stats?.gradeChart || []}
            type="bar"
            height={300}
          />
        </div>
      </div>

      {/* Recent Activity & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <UpcomingEvents />
      </div>
    </div>
  )

  const renderTeacherDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="My Classes"
          value={stats?.myClasses || 0}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="My Students"
          value={stats?.myStudents || 0}
          icon={GraduationCap}
          color="green"
        />
        <StatCard
          title="Pending Assignments"
          value={stats?.pendingAssignments || 0}
          icon={PenTool}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Classes</h3>
          <div className="space-y-3">
            {stats?.todaysClasses?.map((class_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{class_.subject}</p>
                  <p className="text-sm text-gray-500">{class_.class} - {class_.time}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {class_.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <UpcomingEvents />
      </div>
    </div>
  )

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Attendance Rate"
          value={`${stats?.myAttendance || 0}%`}
          icon={ClipboardCheck}
          color="green"
        />
        <StatCard
          title="Assignments Due"
          value={stats?.assignmentsDue || 0}
          icon={PenTool}
          color="orange"
        />
        <StatCard
          title="Average Grade"
          value={stats?.averageGrade || 'N/A'}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {stats?.todaysSchedule?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.subject}</p>
                  <p className="text-sm text-gray-500">{item.time} - {item.teacher}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {item.room}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
          <div className="space-y-3">
            {stats?.recentGrades?.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{grade.subject}</p>
                  <p className="text-sm text-gray-500">{grade.assignment}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  grade.score >= 90 ? 'bg-green-100 text-green-800' :
                  grade.score >= 80 ? 'bg-blue-100 text-blue-800' :
                  grade.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {grade.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {user?.firstName}!
        </h1>
        <p className="mt-1 text-blue-100">
          Welcome back to your {user?.role} dashboard
        </p>
      </div>

      {/* Role-specific dashboard content */}
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'teacher' && renderTeacherDashboard()}
      {user?.role === 'student' && renderStudentDashboard()}
      {user?.role === 'parent' && renderStudentDashboard()}
    </div>
  )
}

export default Dashboard