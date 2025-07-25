const { auth } = require('./auth');

// Role-based access control middleware
const rbac = (permissions) => {
  return [
    auth, // Ensure user is authenticated first
    (req, res, next) => {
      const userRole = req.user.role;
      
      // Admin has access to everything
      if (userRole === 'admin') {
        return next();
      }
      
      // Check if user role has required permissions
      if (permissions[userRole]) {
        return next();
      }
      
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.'
      });
    }
  ];
};

// Specific permission checks
const permissions = {
  // Students management
  students: {
    read: ['admin', 'teacher', 'student', 'parent'],
    create: ['admin'],
    update: ['admin', 'teacher'],
    delete: ['admin']
  },
  
  // Teachers management
  teachers: {
    read: ['admin', 'teacher'],
    create: ['admin'],
    update: ['admin', 'teacher'],
    delete: ['admin']
  },
  
  // Classes management
  classes: {
    read: ['admin', 'teacher', 'student'],
    create: ['admin'],
    update: ['admin', 'teacher'],
    delete: ['admin']
  },
  
  // Subjects management
  subjects: {
    read: ['admin', 'teacher', 'student'],
    create: ['admin'],
    update: ['admin', 'teacher'],
    delete: ['admin']
  },
  
  // Attendance management
  attendance: {
    read: ['admin', 'teacher', 'student', 'parent'],
    create: ['admin', 'teacher'],
    update: ['admin', 'teacher'],
    delete: ['admin']
  },
  
  // Assignments management
  assignments: {
    read: ['admin', 'teacher', 'student', 'parent'],
    create: ['admin', 'teacher'],
    update: ['admin', 'teacher'],
    delete: ['admin', 'teacher']
  },
  
  // Notes management
  notes: {
    read: ['admin', 'teacher', 'student'],
    create: ['admin', 'teacher'],
    update: ['admin', 'teacher'],
    delete: ['admin', 'teacher']
  },
  
  // Announcements management
  announcements: {
    read: ['admin', 'teacher', 'student', 'parent'],
    create: ['admin', 'teacher'],
    update: ['admin', 'teacher'],
    delete: ['admin', 'teacher']
  },
  
  // Calendar management
  calendar: {
    read: ['admin', 'teacher', 'student', 'parent'],
    create: ['admin', 'teacher'],
    update: ['admin', 'teacher'],
    delete: ['admin', 'teacher']
  },
  
  // Analytics access
  analytics: {
    read: ['admin', 'teacher'],
    create: ['admin'],
    update: ['admin'],
    delete: ['admin']
  }
};

// Helper function to check specific permissions
const checkPermission = (resource, action) => {
  return rbac(permissions[resource]?.[action] || []);
};

module.exports = {
  rbac,
  permissions,
  checkPermission
};