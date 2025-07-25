import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import {
  X,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  PieChart,
  Megaphone,
  Building2
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'teacher', 'student', 'parent'] },
    { icon: Users, label: 'Students', path: '/students', roles: ['admin', 'teacher'] },
    { icon: GraduationCap, label: 'Teachers', path: '/teachers', roles: ['admin', 'teacher'] },
    { icon: Building2, label: 'Classes', path: '/classes', roles: ['admin', 'teacher'] },
    { icon: BookOpen, label: 'Subjects', path: '/subjects', roles: ['admin', 'teacher', 'student'] },
    { icon: ClipboardCheck, label: 'Attendance', path: '/attendance', roles: ['admin', 'teacher', 'student'] },
    { icon: FileText, label: 'Assignments', path: '/assignments', roles: ['admin', 'teacher', 'student'] },
    { icon: BookOpen, label: 'Notes', path: '/notes', roles: ['admin', 'teacher', 'student'] },
    { icon: PieChart, label: 'Analytics', path: '/analytics', roles: ['admin', 'teacher'] },
    { icon: Megaphone, label: 'Announcements', path: '/announcements', roles: ['admin', 'teacher', 'student', 'parent'] },
    { icon: Calendar, label: 'Calendar', path: '/calendar', roles: ['admin', 'teacher', 'student', 'parent'] },
  ]

  const filteredMenuItems = menuItems.filter(item =>
    user && item.roles.includes(user.role)
  )

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-50 h-full w-70 glass-strong border-r border-gray-700/50 lg:relative lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center neon-glow-gold">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EduTech Pro</h1>
                <p className="text-xs text-gray-400">School Management</p>
              </div>
            </motion.div>

            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {filteredMenuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-gold text-white neon-glow-gold shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 hover:neon-glow'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-3 p-3 rounded-lg glass">
              <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
