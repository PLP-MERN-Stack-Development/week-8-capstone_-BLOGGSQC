# EduTech Pro - Backend Server

## 🚀 Advanced School Management System Backend

A comprehensive, production-ready backend system built with Node.js, Express, and MongoDB for modern educational institutions.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Teacher, Student, Parent)
- Account lockout protection
- Password reset functionality
- Email verification

### 👥 User Management
- Comprehensive user profiles
- Role-specific permissions
- Active/inactive status management
- Profile image uploads via Cloudinary

### 🎓 Student Management
- Complete student profiles with academic records
- Parent/guardian relationships
- Attendance tracking and reporting
- Fee management and payment tracking
- Medical information and emergency contacts
- Disciplinary records and notes

### 👨‍🏫 Teacher Management
- Teacher profiles with qualifications
- Subject and class assignments
- Performance tracking and reviews
- Leave management system
- Salary and banking details
- Schedule and timetable management

### 🏫 Academic Management
- Class creation and management
- Subject catalog with syllabus
- Teacher-subject assignments
- Room and facility management
- Academic year organization

### 📊 Analytics & Reporting
- Real-time dashboard statistics
- Attendance analytics
- Performance tracking
- Grade distribution analysis
- Department-wise reporting

### 🔔 Real-time Features
- WebSocket integration for live updates
- Real-time notifications
- Instant messaging capabilities
- Live activity feeds

## 🛠️ Technical Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary integration
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express-validator
- **Email**: Nodemailer
- **Scheduling**: Node-cron

## 📁 Project Structure

```
Server/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   └── cloudinary.js # Cloudinary setup
├── controllers/      # Route controllers
│   ├── auth.js       # Authentication logic
│   ├── students.js   # Student management
│   ├── teachers.js   # Teacher management
│   └── ...
├── middleware/       # Custom middleware
│   ├── auth.js       # JWT verification
│   ├── errorHandler.js # Global error handling
│   └── upload.js     # File upload handling
├── models/           # Mongoose schemas
│   ├── User.js       # User model
│   ├── Student.js    # Student model
│   ├── Teacher.js    # Teacher model
│   └── ...
├── routes/           # API routes
│   ├── auth.js       # Authentication routes
│   ├── students.js   # Student routes
│   ├── teachers.js   # Teacher routes
│   └── ...
├── scripts/          # Utility scripts
│   └── seedDatabase.js # Database seeding
├── uploads/          # Local file storage
├── .env              # Environment variables
├── .env.example      # Environment template
└── server.js         # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edutech-pro
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 🔑 API Authentication

### Register New User
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Routes
Include the JWT token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

## 📝 API Documentation

### Students API
- `GET /api/students` - Get all students (with filtering)
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create new student (Admin only)
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete/deactivate student

### Teachers API  
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get single teacher
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Classes API
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get single class
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Dashboard API
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activities
- `GET /api/dashboard/notifications` - Get user notifications

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Additional HTTP headers protection
- **Account Lockout**: Automatic lockout after failed attempts
- **Password Hashing**: Bcrypt with configurable salt rounds

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: enum['admin', 'teacher', 'student', 'parent'],
  avatar: { url, publicId },
  phone: String,
  isActive: Boolean,
  preferences: Object,
  // ... additional fields
}
```

### Student Model
```javascript
{
  user: ObjectId (ref: User),
  studentId: String (unique),
  class: ObjectId (ref: Class),
  rollNumber: String,
  academicRecord: Object,
  attendance: Object,
  parents: [Object],
  // ... additional fields
}
```

## 🎯 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data retrieval with pagination
- **Caching**: Strategic caching for frequently accessed data
- **Connection Pooling**: MongoDB connection optimization
- **Rate Limiting**: API abuse prevention
- **Compression**: Response compression middleware

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-production-secret>
FRONTEND_URL=<production-frontend-url>
```

### Deployment Platforms
- **Render**: One-click deployment
- **Railway**: Container deployment
- **AWS EC2**: Custom server deployment
- **Heroku**: Platform-as-a-service

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 24h |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | 12 |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit per window | 100 |

## 📈 Monitoring & Logging

- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Request timing and metrics
- **Database Monitoring**: Connection and query monitoring
- **Health Checks**: Built-in health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@edutech-pro.com
- Documentation: [docs.edutech-pro.com](https://docs.edutech-pro.com)
- Issues: [GitHub Issues](https://github.com/edutech-pro/issues)

## 🎉 Demo Credentials

After running the seed script, use these credentials:

- **Admin**: admin@edutech-pro.com / Admin123!
- **Teacher**: sarah.johnson@edutech-pro.com / Teacher123!
- **Student**: john.smith@student.edutech-pro.com / Student123!
- **Parent**: robert.smith@parent.edutech-pro.com / Parent123!

---

Built with ❤️ for modern education management.