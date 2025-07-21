import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, FileText, ClipboardCheck, BarChart3, MessageSquare, Settings, Award, DollarSign, Bell, ChevronRight, Home, UserCheck, BookOpenCheck, Presentation as PresentationChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: string[];
  badge?: string;
  subItems?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
      roles: ['admin', 'teacher', 'student', 'parent'],
    },
    {
      icon: Users,
      label: 'Students',
      path: '/students',
      roles: ['admin', 'teacher'],
    },
    {
      icon: GraduationCap,
      label: 'Teachers',
      path: '/teachers',
      roles: ['admin'],
    },
    {
      icon: Home,
      label: 'Classes',
      path: '/classes',
      roles: ['admin', 'teacher'],
    },
    {
      icon: BookOpen,
      label: 'Subjects',
      path: '/subjects',
      roles: ['admin', 'teacher'],
    },
    {
      icon: FileText,
      label: 'Assignments',
      path: '/assignments',
      roles: ['admin', 'teacher', 'student'],
    },
    {
      icon: UserCheck,
      label: 'Attendance',
      path: '/attendance',
      roles: ['admin', 'teacher', 'student', 'parent'],
    },
    {
      icon: Award,
      label: 'Grades',
      path: '/grades',
      roles: ['admin', 'teacher', 'student', 'parent'],
    },
    {
      icon: BookOpenCheck,
      label: 'Notes',
      path: '/notes',
      roles: ['admin', 'teacher', 'student'],
    },
    {
      icon: Bell,
      label: 'Announcements',
      path: '/announcements',
      roles: ['admin', 'teacher', 'student', 'parent'],
    },
    {
      icon: Calendar,
      label: 'Calendar',
      path: '/calendar',
      roles: ['admin', 'teacher', 'student', 'parent'],
    },
    {
      icon: DollarSign,
      label: 'Fees',
      path: '/fees',
      roles: ['admin', 'student', 'parent'],
      badge: '2',
    },
    {
      icon: PresentationChart,
      label: 'Analytics',
      path: '/analytics',
      roles: ['admin', 'teacher'],
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      path: '/messages',
      roles: ['admin', 'teacher', 'student', 'parent'],
      badge: '5',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      roles: ['admin', 'teacher', 'student', 'parent'],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 40,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 40,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const MenuItem: React.FC<{ item: MenuItem; level?: number }> = ({ item, level = 0 }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.path);
    const isItemActive = isActive(item.path);

    const menuItemContent = (
      <motion.div
        variants={itemVariants}
        whileHover={{ x: 4 }}
        className={`group relative flex items-center justify-between p-3 mx-2 rounded-xl transition-all duration-300 cursor-pointer ${
          isItemActive
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
        style={{ paddingLeft: `${12 + level * 20}px` }}
      >
        <div className="flex items-center space-x-3 flex-1">
          <item.icon 
            size={20} 
            className={isItemActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} 
          />
          <span className="font-medium">{item.label}</span>
          {item.badge && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              {item.badge}
            </span>
          )}
        </div>
        
        {hasSubItems && (
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        )}
        
        {isItemActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    );

    if (hasSubItems) {
      return (
        <div>
          <div onClick={() => toggleExpanded(item.path)}>
            {menuItemContent}
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {item.subItems?.map((subItem, index) => (
                  <MenuItem key={index} item={subItem} level={level + 1} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <NavLink to={item.path} onClick={onClose}>
        {menuItemContent}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        className="fixed left-0 top-0 bottom-0 w-64 glass-card border-r border-white/10 z-50 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 border-b border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-electric-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gold-gradient">SmartSchool</h1>
                <p className="text-xs text-gray-400">Education Management</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-1"
            >
              {filteredMenuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <MenuItem item={item} />
                </motion.div>
              ))}
            </motion.nav>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 border-t border-white/10"
          >
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-electric-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-4 w-2 h-16 bg-gradient-to-b from-primary-500 to-transparent rounded-full opacity-30"></div>
        <div className="absolute bottom-32 right-4 w-1 h-12 bg-gradient-to-b from-electric-500 to-transparent rounded-full opacity-40"></div>
      </motion.aside>
    </>
  );
};

export default Sidebar;