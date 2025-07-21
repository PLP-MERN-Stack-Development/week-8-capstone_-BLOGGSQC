import { Clock, User, BookOpen, ClipboardCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const RecentActivity = () => {
  // Mock data - in real app, this would come from API
  const activities = [
    {
      id: 1,
      type: 'attendance',
      message: 'Attendance marked for Class 10A',
      user: 'John Teacher',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: ClipboardCheck,
      color: 'text-green-600 bg-green-50',
    },
    {
      id: 2,
      type: 'user',
      message: 'New student enrolled: Sarah Johnson',
      user: 'Admin',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: User,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 3,
      type: 'notes',
      message: 'New study material uploaded for Mathematics',
      user: 'Mary Teacher',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  return (
    <div className="glass-card animate-slide-up">
      <h3 className="text-xl font-semibold text-white mb-6 gradient-text">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-xl ${activity.color} glow-blue`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {activity.message}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <span>by {activity.user}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 text-sm text-neon-blue hover:text-neon-blue/80 font-medium transition-colors duration-200">
        View all activity
      </button>
    </div>
  )
}

export default RecentActivity