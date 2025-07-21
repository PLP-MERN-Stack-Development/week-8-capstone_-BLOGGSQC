import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardCheck,
  PenTool,
  BarChart3,
  Megaphone,
  Calendar,
  CreditCard,
  TrendingUp,
  X,
  School
} from 'lucide-react'
import { clsx } from 'clsx'

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Students', href: '/students', icon: GraduationCap, roles: ['admin', 'teacher'] },
    { name: 'Teachers', href: '/teachers', icon: Users, roles: ['admin'] },
    { name: 'Classes', href: '/classes', icon: School, roles: ['admin', 'teacher'] },
    { name: 'Subjects', href: '/subjects', icon: BookOpen, roles: ['admin', 'teacher'] },
    { name: 'Notes', href: '/notes', icon: FileText, roles: ['admin', 'teacher', 'student'] },
    { name: 'Attendance', href: '/attendance', icon: ClipboardCheck, roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Assignments', href: '/assignments', icon: PenTool, roles: ['admin', 'teacher', 'student'] },
    { name: 'Grades', href: '/grades', icon: BarChart3, roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Announcements', href: '/announcements', icon: Megaphone, roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Calendar', href: '/calendar', icon: Calendar, roles: ['admin', 'teacher', 'student', 'parent'] },
    { name: 'Fees', href: '/fees', icon: CreditCard, roles: ['admin', 'student', 'parent'] },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp, roles: ['admin', 'teacher'] },
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  )

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 glass border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple glow-blue">
              <School className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold gradient-text">EduManage</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-3">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <item.icon
                    className="mr-3 h-5 w-5 transition-colors duration-200 group-hover:text-neon-blue"
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <div className="glass-card flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center glow-blue">
                <span className="text-white font-bold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gold-400 capitalize font-medium">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar