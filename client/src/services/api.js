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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
}

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  bulkImport: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/users/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

// Students API
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (studentData) => api.post('/students', studentData),
  update: (id, studentData) => api.put(`/students/${id}`, studentData),
  delete: (id) => api.delete(`/students/${id}`),
  getAttendance: (id, params) => api.get(`/students/${id}/attendance`, { params }),
  getGrades: (id, params) => api.get(`/students/${id}/grades`, { params }),
}

// Teachers API
export const teachersAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (teacherData) => api.post('/teachers', teacherData),
  update: (id, teacherData) => api.put(`/teachers/${id}`, teacherData),
  delete: (id) => api.delete(`/teachers/${id}`),
  getClasses: (id) => api.get(`/teachers/${id}/classes`),
  getSubjects: (id) => api.get(`/teachers/${id}/subjects`),
}

// Classes API
export const classesAPI = {
  getAll: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (classData) => api.post('/classes', classData),
  update: (id, classData) => api.put(`/classes/${id}`, classData),
  delete: (id) => api.delete(`/classes/${id}`),
  getStudents: (id) => api.get(`/classes/${id}/students`),
  getTimetable: (id) => api.get(`/classes/${id}/timetable`),
}

// Subjects API
export const subjectsAPI = {
  getAll: (params) => api.get('/subjects', { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (subjectData) => api.post('/subjects', subjectData),
  update: (id, subjectData) => api.put(`/subjects/${id}`, subjectData),
  delete: (id) => api.delete(`/subjects/${id}`),
}

// Notes API
export const notesAPI = {
  getAll: (params) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (formData) => api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/notes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/notes/${id}`),
}

// Attendance API
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  create: (attendanceData) => api.post('/attendance', attendanceData),
  update: (id, attendanceData) => api.put(`/attendance/${id}`, attendanceData),
  delete: (id) => api.delete(`/attendance/${id}`),
  markBulk: (data) => api.post('/attendance/bulk', data),
}

// Assignments API
export const assignmentsAPI = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (formData) => api.post('/assignments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/assignments/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/assignments/${id}`),
  submit: (id, formData) => api.post(`/assignments/${id}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  grade: (id, submissionId, gradeData) => api.put(`/assignments/${id}/submissions/${submissionId}/grade`, gradeData),
}

// Grades API
export const gradesAPI = {
  getAll: (params) => api.get('/grades', { params }),
  create: (gradeData) => api.post('/grades', gradeData),
  update: (id, gradeData) => api.put(`/grades/${id}`, gradeData),
  delete: (id) => api.delete(`/grades/${id}`),
  bulkCreate: (gradesData) => api.post('/grades/bulk', gradesData),
}

// Announcements API
export const announcementsAPI = {
  getAll: (params) => api.get('/announcements', { params }),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (announcementData) => api.post('/announcements', announcementData),
  update: (id, announcementData) => api.put(`/announcements/${id}`, announcementData),
  delete: (id) => api.delete(`/announcements/${id}`),
}

// Calendar API
export const calendarAPI = {
  getEvents: (params) => api.get('/calendar/events', { params }),
  createEvent: (eventData) => api.post('/calendar/events', eventData),
  updateEvent: (id, eventData) => api.put(`/calendar/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/calendar/events/${id}`),
}

// Fees API
export const feesAPI = {
  getAll: (params) => api.get('/fees', { params }),
  getById: (id) => api.get(`/fees/${id}`),
  create: (feeData) => api.post('/fees', feeData),
  update: (id, feeData) => api.put(`/fees/${id}`, feeData),
  delete: (id) => api.delete(`/fees/${id}`),
  pay: (id, paymentData) => api.post(`/fees/${id}/pay`, paymentData),
}

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getAttendanceStats: (params) => api.get('/analytics/attendance', { params }),
  getGradeStats: (params) => api.get('/analytics/grades', { params }),
  getPerformanceStats: (params) => api.get('/analytics/performance', { params }),
}

export default api