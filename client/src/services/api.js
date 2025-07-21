import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.message || 'An error occurred'
    toast.error(message)
    
    return Promise.reject(error)
  }
)

// Mock data generators
const generateMockData = (type, count = 10) => {
  const mockData = {
    students: Array.from({ length: count }, (_, i) => ({
      _id: `student-${i + 1}`,
      firstName: ['Alice', 'Bob', 'Carol', 'David', 'Emma'][i % 5],
      lastName: ['Wilson', 'Davis', 'Miller', 'Garcia', 'Johnson'][i % 5],
      email: `student${i + 1}@school.com`,
      studentId: `S2024${String(i + 1).padStart(3, '0')}`,
      class: ['10A', '10B', '11A', '11B'][i % 4],
      phone: `+123456789${i}`,
      status: ['active', 'inactive'][i % 2],
      createdAt: new Date().toISOString()
    })),
    teachers: Array.from({ length: count }, (_, i) => ({
      _id: `teacher-${i + 1}`,
      firstName: ['John', 'Sarah', 'Michael', 'Lisa', 'Robert'][i % 5],
      lastName: ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson'][i % 5],
      email: `teacher${i + 1}@school.com`,
      employeeId: `T${String(i + 1).padStart(3, '0')}`,
      department: ['Mathematics', 'Science', 'English', 'History'][i % 4],
      phone: `+123456789${i}`,
      status: 'active',
      classes: [2, 3, 1, 4][i % 4],
      totalStudents: [45, 38, 52, 41][i % 4],
      createdAt: new Date().toISOString()
    })),
    classes: Array.from({ length: count }, (_, i) => ({
      _id: `class-${i + 1}`,
      name: `Class ${['10A', '10B', '11A', '11B'][i % 4]}`,
      grade: ['10', '10', '11', '11'][i % 4],
      section: ['A', 'B', 'A', 'B'][i % 4],
      classTeacher: {
        firstName: ['John', 'Sarah', 'Michael', 'Lisa'][i % 4],
        lastName: ['Smith', 'Johnson', 'Brown', 'Davis'][i % 4]
      },
      subjects: Array.from({ length: 4 }, (_, j) => ({ _id: `subject-${j}` })),
      studentCount: [32, 28, 35, 30][i % 4],
      createdAt: new Date().toISOString()
    })),
    subjects: Array.from({ length: count }, (_, i) => ({
      _id: `subject-${i + 1}`,
      name: ['Mathematics', 'Physics', 'Chemistry', 'English', 'History'][i % 5],
      code: ['MATH101', 'PHY101', 'CHEM101', 'ENG101', 'HIST101'][i % 5],
      grade: ['10', '11'][i % 2],
      teacher: {
        firstName: ['John', 'Sarah', 'Michael', 'Lisa'][i % 4],
        lastName: ['Smith', 'Johnson', 'Brown', 'Davis'][i % 4]
      },
      weeklyHours: [4, 5, 3, 6][i % 4],
      enrolledStudents: [120, 98, 145, 87][i % 4],
      assignmentsCount: [5, 3, 7, 4][i % 4],
      averageScore: [85, 78, 92, 81][i % 4],
      createdAt: new Date().toISOString()
    })),
    notes: Array.from({ length: count }, (_, i) => ({
      _id: `note-${i + 1}`,
      title: ['Algebra Basics', 'Physics Laws', 'Chemical Reactions', 'Grammar Rules'][i % 4],
      description: 'Comprehensive study material for students',
      subject: ['Mathematics', 'Physics', 'Chemistry', 'English'][i % 4],
      class: ['10A', '10B', '11A', '11B'][i % 4],
      type: ['lecture', 'assignment', 'reference', 'video'][i % 4],
      uploadedBy: {
        firstName: ['John', 'Sarah', 'Michael', 'Lisa'][i % 4],
        lastName: ['Smith', 'Johnson', 'Brown', 'Davis'][i % 4]
      },
      views: Math.floor(Math.random() * 100),
      downloads: Math.floor(Math.random() * 50),
      fileType: ['pdf', 'doc', 'ppt', 'video'][i % 4],
      fileSize: '2.5 MB',
      createdAt: new Date().toISOString()
    })),
    assignments: Array.from({ length: count }, (_, i) => ({
      _id: `assignment-${i + 1}`,
      title: ['Math Assignment 1', 'Physics Lab Report', 'English Essay', 'History Project'][i % 4],
      description: 'Complete the assigned tasks and submit before due date',
      subject: ['Mathematics', 'Physics', 'English', 'History'][i % 4],
      class: ['10A', '10B', '11A', '11B'][i % 4],
      teacher: {
        firstName: ['John', 'Sarah', 'Michael', 'Lisa'][i % 4],
        lastName: ['Smith', 'Johnson', 'Brown', 'Davis'][i % 4]
      },
      dueDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      points: [100, 50, 75, 80][i % 4],
      submissionCount: [25, 18, 32, 28][i % 4],
      totalStudents: [30, 25, 35, 32][i % 4],
      createdAt: new Date().toISOString()
    })),
    grades: Array.from({ length: count }, (_, i) => ({
      _id: `grade-${i + 1}`,
      student: {
        firstName: ['Alice', 'Bob', 'Carol', 'David'][i % 4],
        lastName: ['Wilson', 'Davis', 'Miller', 'Garcia'][i % 4],
        studentId: `S2024${String(i + 1).padStart(3, '0')}`
      },
      subject: ['Mathematics', 'Physics', 'English', 'History'][i % 4],
      class: ['10A', '10B', '11A', '11B'][i % 4],
      assignment: ['Test 1', 'Quiz 2', 'Project', 'Final Exam'][i % 4],
      score: [85, 92, 78, 88, 95, 73, 89, 91][i % 8],
      createdAt: new Date().toISOString()
    })),
    announcements: Array.from({ length: count }, (_, i) => ({
      _id: `announcement-${i + 1}`,
      title: ['School Holiday', 'Parent Meeting', 'Sports Day', 'Exam Schedule'][i % 4],
      content: 'Important announcement for all students and parents. Please read carefully.',
      author: {
        firstName: ['Admin', 'Principal', 'John', 'Sarah'][i % 4],
        lastName: ['User', 'Smith', 'Teacher', 'Johnson'][i % 4]
      },
      priority: ['high', 'medium', 'low'][i % 3],
      targetAudience: [['all'], ['students'], ['parents'], ['teachers']][i % 4],
      views: Math.floor(Math.random() * 200),
      pinned: i < 2,
      attachments: i % 3 === 0 ? [{ name: 'document.pdf' }] : [],
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    })),
    fees: Array.from({ length: count }, (_, i) => ({
      _id: `fee-${i + 1}`,
      student: {
        firstName: ['Alice', 'Bob', 'Carol', 'David'][i % 4],
        lastName: ['Wilson', 'Davis', 'Miller', 'Garcia'][i % 4],
        studentId: `S2024${String(i + 1).padStart(3, '0')}`,
        class: ['10A', '10B', '11A', '11B'][i % 4]
      },
      type: ['tuition', 'transport', 'meals', 'activities'][i % 4],
      description: 'Monthly fee payment',
      amount: [500, 100, 150, 75][i % 4],
      paidAmount: i % 3 === 0 ? [500, 100, 150, 75][i % 4] : [250, 50, 75, 0][i % 4],
      status: i % 3 === 0 ? 'paid' : i % 3 === 1 ? 'partial' : 'pending',
      dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    })),
    attendance: Array.from({ length: count }, (_, i) => ({
      _id: `attendance-${i + 1}`,
      student: {
        firstName: ['Alice', 'Bob', 'Carol', 'David'][i % 4],
        lastName: ['Wilson', 'Davis', 'Miller', 'Garcia'][i % 4],
        studentId: `S2024${String(i + 1).padStart(3, '0')}`,
        class: ['10A', '10B', '11A', '11B'][i % 4]
      },
      status: ['present', 'absent', 'late', 'excused'][i % 4],
      timeIn: i % 4 !== 1 ? '09:00' : null,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }))
  }
  
  return mockData[type] || []
}

// Mock API functions
export const authAPI = {
  login: (credentials) => Promise.resolve({
    data: {
      token: 'mock-jwt-token',
      user: {
        _id: '1',
        firstName: 'John',
        lastName: 'Admin',
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 
              credentials.email.includes('teacher') ? 'teacher' : 
              credentials.email.includes('student') ? 'student' : 'parent'
      }
    }
  }),
  register: (userData) => Promise.resolve({ data: { success: true } }),
  verify: () => Promise.resolve({ data: { user: { _id: '1', firstName: 'John', lastName: 'Admin', role: 'admin' } } })
}

export const studentsAPI = {
  getAll: (params) => Promise.resolve({ data: { students: generateMockData('students', 15), total: 15, totalPages: 2, currentPage: 1 } }),
  getById: (id) => Promise.resolve({ data: generateMockData('students', 1)[0] }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-student' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const teachersAPI = {
  getAll: (params) => Promise.resolve({ data: { teachers: generateMockData('teachers', 12), total: 12, totalPages: 2, currentPage: 1 } }),
  getById: (id) => Promise.resolve({ data: generateMockData('teachers', 1)[0] }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-teacher' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const classesAPI = {
  getAll: (params) => Promise.resolve({ data: generateMockData('classes', 8) }),
  getById: (id) => Promise.resolve({ data: generateMockData('classes', 1)[0] }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-class' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const subjectsAPI = {
  getAll: (params) => Promise.resolve({ data: generateMockData('subjects', 10) }),
  getById: (id) => Promise.resolve({ data: generateMockData('subjects', 1)[0] }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-subject' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const notesAPI = {
  getAll: (params) => Promise.resolve({ data: generateMockData('notes', 12) }),
  getById: (id) => Promise.resolve({ data: generateMockData('notes', 1)[0] }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-note' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const assignmentsAPI = {
  getAll: (params) => Promise.resolve({ data: generateMockData('assignments', 10) }),
  getById: (id) => Promise.resolve({ data: generateMockData('assignments', 1)[0] }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-assignment' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const gradesAPI = {
  getAll: (params) => Promise.resolve({ 
    data: { 
      grades: generateMockData('grades', 15),
      stats: { totalStudents: 120, classAverage: 85, highest: 98, lowest: 65 },
      distribution: [
        { name: 'A (90-100)', value: 25 },
        { name: 'B (80-89)', value: 45 },
        { name: 'C (70-79)', value: 35 },
        { name: 'D (60-69)', value: 10 },
        { name: 'F (0-59)', value: 5 }
      ],
      letterDistribution: { A: 25, B: 45, C: 35, D: 10, F: 5 }
    } 
  }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-grade' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const announcementsAPI = {
  getAll: (params) => Promise.resolve({ data: generateMockData('announcements', 8) }),
  getById: (id) => Promise.resolve({ data: generateMockData('announcements', 1)[0] }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-announcement' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const calendarAPI = {
  getEvents: (params) => Promise.resolve({ data: [] }),
  createEvent: (data) => Promise.resolve({ data: { ...data, _id: 'new-event' } }),
  updateEvent: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  deleteEvent: (id) => Promise.resolve({ data: { success: true } })
}

export const feesAPI = {
  getAll: (params) => Promise.resolve({ 
    data: { 
      fees: generateMockData('fees', 12),
      stats: {
        totalCollected: 45000,
        totalPending: 15000,
        totalOverdue: 5000,
        collectionRate: 75
      }
    } 
  }),
  getById: (id) => Promise.resolve({ data: generateMockData('fees', 1)[0] }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-fee' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const attendanceAPI = {
  getAll: (params) => Promise.resolve({ 
    data: { 
      records: generateMockData('attendance', 15),
      stats: { total: 120, present: 95, absent: 15, late: 8, excused: 2 }
    } 
  }),
  create: (data) => Promise.resolve({ data: { ...data, _id: 'new-attendance' } }),
  update: (id, data) => Promise.resolve({ data: { ...data, _id: id } }),
  delete: (id) => Promise.resolve({ data: { success: true } })
}

export const analyticsAPI = {
  getDashboardStats: () => Promise.resolve({
    data: {
      totalStudents: 1250,
      totalTeachers: 85,
      totalClasses: 45,
      attendanceRate: 92,
      attendanceChart: [
        { name: 'Mon', value: 95 },
        { name: 'Tue', value: 88 },
        { name: 'Wed', value: 92 },
        { name: 'Thu', value: 89 },
        { name: 'Fri', value: 94 },
        { name: 'Sat', value: 87 },
        { name: 'Sun', value: 91 }
      ],
      gradeChart: [
        { name: 'A', value: 25 },
        { name: 'B', value: 45 },
        { name: 'C', value: 20 },
        { name: 'D', value: 8 },
        { name: 'F', value: 2 }
      ]
    }
  }),
  getAttendanceStats: (params) => Promise.resolve({
    data: {
      averageAttendance: 92,
      presentToday: 1150,
      absentToday: 100,
      lateToday: 25,
      chartData: [
        { name: 'Week 1', value: 94 },
        { name: 'Week 2', value: 91 },
        { name: 'Week 3', value: 89 },
        { name: 'Week 4', value: 93 }
      ]
    }
  }),
  getGradeStats: (params) => Promise.resolve({
    data: {
      classAverage: 85,
      topPerformers: 45,
      failing: 12,
      graded: 1200,
      chartData: [
        { name: 'A', value: 25 },
        { name: 'B', value: 45 },
        { name: 'C', value: 20 },
        { name: 'D', value: 8 },
        { name: 'F', value: 2 }
      ]
    }
  }),
  getPerformanceStats: (params) => Promise.resolve({
    data: {
      overallPerformance: 87,
      improvementRate: 15,
      atRisk: 25,
      starPerformers: 35,
      chartData: [
        { name: 'Jan', value: 82 },
        { name: 'Feb', value: 85 },
        { name: 'Mar', value: 87 },
        { name: 'Apr', value: 89 }
      ]
    }
  })
}

export default api