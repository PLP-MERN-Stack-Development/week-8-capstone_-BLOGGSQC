export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  employeeId?: string;
  studentId?: string;
  parentId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  studentId: string;
  class: Class;
  rollNumber: string;
  admissionDate: string;
  guardianInfo: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  };
  academicInfo: {
    session: string;
    section: string;
    previousSchool?: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Teacher extends User {
  employeeId: string;
  subjects: Subject[];
  classes: Class[];
  department: string;
  qualification: string;
  experience: number;
  joiningDate: string;
  salary?: number;
  specialization: string[];
}

export interface Parent extends User {
  children: Student[];
  occupation?: string;
  emergencyContact?: string;
}

export interface Class {
  _id: string;
  name: string;
  section: string;
  grade: number;
  classTeacher: Teacher;
  subjects: Subject[];
  students: Student[];
  capacity: number;
  room: string;
  schedule: Schedule[];
  academicYear: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
  teachers: Teacher[];
  classes: Class[];
  credits: number;
  type: 'core' | 'elective' | 'extracurricular';
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: Subject;
  class: Class;
  teacher: Teacher;
  dueDate: string;
  totalMarks: number;
  attachments: FileAttachment[];
  submissions: Submission[];
  isActive: boolean;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  _id: string;
  student: Student;
  assignment: Assignment;
  files: FileAttachment[];
  submittedAt: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  marks?: number;
  feedback?: string;
  gradedBy?: Teacher;
  gradedAt?: string;
}

export interface Attendance {
  _id: string;
  student: Student;
  class: Class;
  subject: Subject;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: Teacher;
  remarks?: string;
  timeIn?: string;
  timeOut?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  _id: string;
  student: Student;
  subject: Subject;
  class: Class;
  examType: 'quiz' | 'midterm' | 'final' | 'assignment' | 'project';
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  remarks?: string;
  examDate: string;
  enteredBy: Teacher;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  _id: string;
  class: Class;
  subject: Subject;
  teacher: Teacher;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  room: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: User;
  targetAudience: ('admin' | 'teacher' | 'student' | 'parent')[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'academic' | 'administrative' | 'event' | 'emergency';
  attachments: FileAttachment[];
  isPublished: boolean;
  publishedAt?: string;
  expiresAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: User;
  attendees: User[];
  category: 'academic' | 'sports' | 'cultural' | 'administrative' | 'holiday';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  reminders: {
    time: string;
    sent: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: User;
  uploadedAt: string;
}

export interface Notification {
  _id: string;
  recipient: User;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'system' | 'academic' | 'social' | 'reminder';
  isRead: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Fee {
  _id: string;
  student: Student;
  academicYear: string;
  semester: string;
  feeType: 'tuition' | 'library' | 'lab' | 'transport' | 'hostel' | 'activity' | 'exam' | 'other';
  amount: number;
  dueDate: string;
  paidAmount: number;
  paidDate?: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'online';
  transactionId?: string;
  receipts: FileAttachment[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  presentToday: number;
  absentToday: number;
  pendingAssignments: number;
  upcomingEvents: number;
  recentActivities: Activity[];
  attendanceRate: number;
  performanceMetrics: {
    averageGrade: number;
    passRate: number;
    improvementRate: number;
  };
}

export interface Activity {
  _id: string;
  user: User;
  action: string;
  target: string;
  targetId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'teacher' | 'student' | 'parent';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface PasswordResetData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface FilterParams {
  role?: string;
  class?: string;
  subject?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
  }[];
}

export interface AnalyticsData {
  studentPerformance: ChartData;
  attendanceTrends: ChartData;
  subjectWiseGrades: ChartData;
  monthlyEnrollment: ChartData;
  teacherWorkload: ChartData;
  feeCollection: ChartData;
}

export interface WeeklySchedule {
  [key: string]: ScheduleSlot[];
}

export interface ScheduleSlot {
  _id: string;
  time: string;
  subject: Subject;
  teacher: Teacher;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'break';
}

export interface QRCodeData {
  type: 'attendance' | 'class_entry' | 'assignment' | 'event';
  data: {
    classId?: string;
    subjectId?: string;
    assignmentId?: string;
    eventId?: string;
    date: string;
    validUntil: string;
  };
  generatedBy: string;
  timestamp: string;
}

export interface ChatMessage {
  _id: string;
  sender: User;
  recipient?: User;
  room?: string;
  message: string;
  type: 'text' | 'file' | 'image' | 'audio' | 'video';
  attachments?: FileAttachment[];
  isRead: boolean;
  readBy: {
    user: string;
    readAt: string;
  }[];
  reactions: {
    emoji: string;
    users: string[];
  }[];
  replyTo?: string;
  editedAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  _id: string;
  name: string;
  description?: string;
  type: 'direct' | 'group' | 'class' | 'announcement';
  participants: User[];
  admins: User[];
  lastMessage?: ChatMessage;
  isActive: boolean;
  settings: {
    allowFileSharing: boolean;
    allowMessageEditing: boolean;
    messageRetention: number; // in days
  };
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  _id: string;
  schoolName: string;
  schoolCode: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  academicYear: string;
  currentSemester: string;
  timeZone: string;
  currency: string;
  language: string;
  features: {
    attendance: boolean;
    grading: boolean;
    messaging: boolean;
    fees: boolean;
    library: boolean;
    transport: boolean;
    hostel: boolean;
    events: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    sessionTimeout: number; // minutes
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
  backup: {
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number; // days
    autoBackup: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  _id: string;
  title: string;
  type: 'attendance' | 'grades' | 'fees' | 'performance' | 'custom';
  description: string;
  generatedBy: User;
  parameters: Record<string, any>;
  data: any;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  status: 'generating' | 'completed' | 'failed';
  filePath?: string;
  downloadCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  _id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}