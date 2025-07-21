import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, LoginCredentials, RegisterData, User, PaginationParams } from '../types';

interface ApiConfig {
  baseURL: string;
  timeout: number;
}

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor(config: ApiConfig) {
    this.client = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${this.client.defaults.baseURL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      this.setTokens(accessToken, newRefreshToken);
      this.refreshPromise = null;
      return accessToken;
    })();

    return this.refreshPromise;
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
    const response = await this.client.post('/auth/login', credentials);
    const { user, accessToken, refreshToken } = response.data.data;
    this.setTokens(accessToken, refreshToken);
    return response.data;
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
    const response = await this.client.post('/auth/register', data);
    const { user, accessToken, refreshToken } = response.data.data;
    this.setTokens(accessToken, refreshToken);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Generic CRUD operations
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put(endpoint, data, config);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete(endpoint, config);
    return response.data;
  }

  // Paginated GET request
  async getPaginated<T>(endpoint: string, params: PaginationParams): Promise<ApiResponse<T[]>> {
    const response = await this.client.get(endpoint, { params });
    return response.data;
  }

  // File upload
  async uploadFile(file: File, endpoint: string = '/upload'): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Multiple file upload
  async uploadFiles(files: File[], endpoint: string = '/upload/multiple'): Promise<ApiResponse<{ urls: string[]; filenames: string[] }>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Dashboard methods
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.get('/dashboard/stats');
  }

  async getRecentActivities(limit = 10): Promise<ApiResponse<any[]>> {
    return this.get(`/dashboard/activities?limit=${limit}`);
  }

  // User management methods
  async getUsers(params: PaginationParams): Promise<ApiResponse<User[]>> {
    return this.getPaginated('/users', params);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.get(`/users/${id}`);
  }

  async createUser(userData: any): Promise<ApiResponse<User>> {
    return this.post('/users', userData);
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse<User>> {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/users/${id}`);
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<ApiResponse<User>> {
    return this.patch(`/users/${id}/status`, { isActive });
  }

  // Student methods
  async getStudents(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/students', params);
  }

  async getStudentById(id: string): Promise<ApiResponse<any>> {
    return this.get(`/students/${id}`);
  }

  async createStudent(studentData: any): Promise<ApiResponse<any>> {
    return this.post('/students', studentData);
  }

  async updateStudent(id: string, studentData: any): Promise<ApiResponse<any>> {
    return this.put(`/students/${id}`, studentData);
  }

  async deleteStudent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/students/${id}`);
  }

  // Teacher methods
  async getTeachers(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/teachers', params);
  }

  async getTeacherById(id: string): Promise<ApiResponse<any>> {
    return this.get(`/teachers/${id}`);
  }

  async createTeacher(teacherData: any): Promise<ApiResponse<any>> {
    return this.post('/teachers', teacherData);
  }

  async updateTeacher(id: string, teacherData: any): Promise<ApiResponse<any>> {
    return this.put(`/teachers/${id}`, teacherData);
  }

  async deleteTeacher(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/teachers/${id}`);
  }

  // Class methods
  async getClasses(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/classes', params);
  }

  async getClassById(id: string): Promise<ApiResponse<any>> {
    return this.get(`/classes/${id}`);
  }

  async createClass(classData: any): Promise<ApiResponse<any>> {
    return this.post('/classes', classData);
  }

  async updateClass(id: string, classData: any): Promise<ApiResponse<any>> {
    return this.put(`/classes/${id}`, classData);
  }

  async deleteClass(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/classes/${id}`);
  }

  // Subject methods
  async getSubjects(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/subjects', params);
  }

  async getSubjectById(id: string): Promise<ApiResponse<any>> {
    return this.get(`/subjects/${id}`);
  }

  async createSubject(subjectData: any): Promise<ApiResponse<any>> {
    return this.post('/subjects', subjectData);
  }

  async updateSubject(id: string, subjectData: any): Promise<ApiResponse<any>> {
    return this.put(`/subjects/${id}`, subjectData);
  }

  async deleteSubject(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/subjects/${id}`);
  }

  // Assignment methods
  async getAssignments(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/assignments', params);
  }

  async getAssignmentById(id: string): Promise<ApiResponse<any>> {
    return this.get(`/assignments/${id}`);
  }

  async createAssignment(assignmentData: any): Promise<ApiResponse<any>> {
    return this.post('/assignments', assignmentData);
  }

  async updateAssignment(id: string, assignmentData: any): Promise<ApiResponse<any>> {
    return this.put(`/assignments/${id}`, assignmentData);
  }

  async deleteAssignment(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/assignments/${id}`);
  }

  async submitAssignment(assignmentId: string, submissionData: any): Promise<ApiResponse<any>> {
    return this.post(`/assignments/${assignmentId}/submit`, submissionData);
  }

  async gradeSubmission(submissionId: string, gradeData: any): Promise<ApiResponse<any>> {
    return this.patch(`/submissions/${submissionId}/grade`, gradeData);
  }

  // Attendance methods
  async getAttendance(params: any): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/attendance', params);
  }

  async markAttendance(attendanceData: any): Promise<ApiResponse<any>> {
    return this.post('/attendance', attendanceData);
  }

  async updateAttendance(id: string, attendanceData: any): Promise<ApiResponse<any>> {
    return this.put(`/attendance/${id}`, attendanceData);
  }

  async getAttendanceReport(params: any): Promise<ApiResponse<any>> {
    return this.get('/attendance/report', { params });
  }

  // Grades methods
  async getGrades(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/grades', params);
  }

  async addGrade(gradeData: any): Promise<ApiResponse<any>> {
    return this.post('/grades', gradeData);
  }

  async updateGrade(id: string, gradeData: any): Promise<ApiResponse<any>> {
    return this.put(`/grades/${id}`, gradeData);
  }

  async deleteGrade(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/grades/${id}`);
  }

  async getGradeReport(params: any): Promise<ApiResponse<any>> {
    return this.get('/grades/report', { params });
  }

  // Announcement methods
  async getAnnouncements(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/announcements', params);
  }

  async getAnnouncementById(id: string): Promise<ApiResponse<any>> {
    return this.get(`/announcements/${id}`);
  }

  async createAnnouncement(announcementData: any): Promise<ApiResponse<any>> {
    return this.post('/announcements', announcementData);
  }

  async updateAnnouncement(id: string, announcementData: any): Promise<ApiResponse<any>> {
    return this.put(`/announcements/${id}`, announcementData);
  }

  async deleteAnnouncement(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/announcements/${id}`);
  }

  // Event/Calendar methods
  async getEvents(params: any): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/events', params);
  }

  async getEventById(id: string): Promise<ApiResponse<any>> {
    return this.get(`/events/${id}`);
  }

  async createEvent(eventData: any): Promise<ApiResponse<any>> {
    return this.post('/events', eventData);
  }

  async updateEvent(id: string, eventData: any): Promise<ApiResponse<any>> {
    return this.put(`/events/${id}`, eventData);
  }

  async deleteEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/events/${id}`);
  }

  // Fee methods
  async getFees(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/fees', params);
  }

  async getFeeById(id: string): Promise<ApiResponse<any>> {
    return this.get(`/fees/${id}`);
  }

  async createFee(feeData: any): Promise<ApiResponse<any>> {
    return this.post('/fees', feeData);
  }

  async updateFee(id: string, feeData: any): Promise<ApiResponse<any>> {
    return this.put(`/fees/${id}`, feeData);
  }

  async payFee(feeId: string, paymentData: any): Promise<ApiResponse<any>> {
    return this.post(`/fees/${feeId}/pay`, paymentData);
  }

  // Analytics methods
  async getAnalytics(type: string, params: any): Promise<ApiResponse<any>> {
    return this.get(`/analytics/${type}`, { params });
  }

  async getPerformanceAnalytics(params: any): Promise<ApiResponse<any>> {
    return this.get('/analytics/performance', { params });
  }

  async getAttendanceAnalytics(params: any): Promise<ApiResponse<any>> {
    return this.get('/analytics/attendance', { params });
  }

  // Notification methods
  async getNotifications(params: PaginationParams): Promise<ApiResponse<any[]>> {
    return this.getPaginated('/notifications', params);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<any>> {
    return this.patch(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
    return this.patch('/notifications/read-all');
  }

  async deleteNotification(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete(`/notifications/${id}`);
  }

  // Settings methods
  async getSettings(): Promise<ApiResponse<any>> {
    return this.get('/settings');
  }

  async updateSettings(settingsData: any): Promise<ApiResponse<any>> {
    return this.put('/settings', settingsData);
  }

  // QR Code methods
  async generateQRCode(data: any): Promise<ApiResponse<{ qrCode: string }>> {
    return this.post('/qr/generate', data);
  }

  async validateQRCode(qrCode: string): Promise<ApiResponse<any>> {
    return this.post('/qr/validate', { qrCode });
  }
}

// Create and export API client instance
const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
};

export const api = new ApiClient(apiConfig);
export default api;