import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred'

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      toast.error('Session expired. Please login again.')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

// ✅ Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  validateToken: (token: string) =>
    api.get('/auth/validate', { headers: { Authorization: `Bearer ${token}` } }),
}

// ✅ Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (userData: any) => api.post('/users', userData),
  update: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
}

// ✅ Students API
export const studentsAPI = {
  getAll: (params?: any) => api.get('/students', { params }),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (studentData: any) => api.post('/students', studentData),
  update: (id: string, studentData: any) => api.put(`/students/${id}`, studentData),
  delete: (id: string) => api.delete(`/students/${id}`),
  getStats: () => api.get('/students/stats/overview'),
}

// ✅ Teachers API
export const teachersAPI = {
  getAll: (params?: any) => api.get('/teachers', { params }),
  getById: (id: string) => api.get(`/teachers/${id}`),
  create: (teacherData: any) => api.post('/teachers', teacherData),
  update: (id: string, teacherData: any) => api.put(`/teachers/${id}`, teacherData),
  delete: (id: string) => api.delete(`/teachers/${id}`),
  getStats: () => api.get('/teachers/stats/overview'),
}

// ✅ Classes API
export const classesAPI = {
  getAll: (params?: any) => api.get('/classes', { params }),
  getById: (id: string) => api.get(`/classes/${id}`),
  create: (classData: any) => api.post('/classes', classData),
  update: (id: string, classData: any) => api.put(`/classes/${id}`, classData),
  delete: (id: string) => api.delete(`/classes/${id}`),
  getStats: () => api.get('/classes/stats/overview'),
}

// ✅ Subjects API
export const subjectsAPI = {
  getAll: (params?: any) => api.get('/subjects', { params }),
  getById: (id: string) => api.get(`/subjects/${id}`),
  create: (subjectData: any) => api.post('/subjects', subjectData),
  update: (id: string, subjectData: any) => api.put(`/subjects/${id}`, subjectData),
  delete: (id: string) => api.delete(`/subjects/${id}`),
}

// ✅ Attendance API (✅ fixed duplicate getAll)
export const attendanceAPI = {
  getAll: (params?: any) => api.get('/attendance', { params }),
  getByClass: (classId: string) => api.get(`/attendance/class/${classId}`),
  getByStudent: (studentId: string) => api.get(`/attendance/student/${studentId}`),
  mark: (attendanceData: any) => api.post('/attendance', attendanceData),
  markBulk: (attendanceData: any) => api.post('/attendance/bulk', attendanceData),
  update: (id: string, attendanceData: any) => api.put(`/attendance/${id}`, attendanceData),
}

// ✅ Assignments API
export const assignmentsAPI = {
  getAll: (params?: any) => api.get('/assignments', { params }),
  getById: (id: string) => api.get(`/assignments/${id}`),
  create: (assignmentData: any) => api.post('/assignments', assignmentData),
  update: (id: string, assignmentData: any) => api.put(`/assignments/${id}`, assignmentData),
  delete: (id: string) => api.delete(`/assignments/${id}`),
  submit: (assignmentId: string, submissionData: any) =>
    api.post(`/assignments/${assignmentId}/submit`, submissionData),
}

// ✅ Notes API
export const notesAPI = {
  getAll: (params?: any) => api.get('/notes', { params }),
  getById: (id: string) => api.get(`/notes/${id}`),
  getBySubject: (subjectId: string) => api.get(`/notes/subject/${subjectId}`),
  create: (noteData: any) => api.post('/notes', noteData),
  update: (id: string, noteData: any) => api.put(`/notes/${id}`, noteData),
  delete: (id: string) => api.delete(`/notes/${id}`),
}

// ✅ Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getStudentPerformance: () => api.get('/analytics/student-performance'),
  getAttendanceStats: () => api.get('/analytics/attendance'),
  getGradeDistribution: () => api.get('/analytics/grades'),
}

// ✅ Announcements API
export const announcementsAPI = {
  getAll: (params?: any) => api.get('/announcements', { params }),
  getById: (id: string) => api.get(`/announcements/${id}`),
  create: (announcementData: any) => api.post('/announcements', announcementData),
  update: (id: string, announcementData: any) => api.put(`/announcements/${id}`, announcementData),
  delete: (id: string) => api.delete(`/announcements/${id}`),
}

// ✅ Calendar API
export const calendarAPI = {
  getEvents: (params?: any) => api.get('/calendar/events', { params }),
  createEvent: (eventData: any) => api.post('/calendar/events', eventData),
  updateEvent: (id: string, eventData: any) => api.put(`/calendar/events/${id}`, eventData),
  deleteEvent: (id: string) => api.delete(`/calendar/events/${id}`),
}

export default api
