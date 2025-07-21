# School Management System Backend

A comprehensive backend API for a school management system built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Admin, Teacher, Student, and Parent roles
- **Academic Management**: Classes, subjects, assignments, grades
- **Attendance Tracking**: Real-time attendance management
- **File Management**: Cloudinary integration for file uploads
- **Analytics**: Comprehensive reporting and analytics
- **Real-time Communication**: Socket.IO for live updates
- **Security**: Rate limiting, CORS, input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Real-time**: Socket.IO
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/school_management
   JWT_SECRET=super_secret_jwt_key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
   CLOUDINARY_API_KEY=cloudinary_api_key
   CLOUDINARY_API_SECRET=cloudinary_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Seed the database** (Optional)
   ```bash
   npm run seed
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student (Admin only)
- `GET /api/students/:id/attendance` - Get student attendance
- `GET /api/students/:id/grades` - Get student grades

### Teachers
- `GET /api/teachers` - Get all teachers (Admin only)
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create teacher (Admin only)
- `PUT /api/teachers/:id` - Update teacher (Admin only)
- `DELETE /api/teachers/:id` - Delete teacher (Admin only)

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create class (Admin only)
- `PUT /api/classes/:id` - Update class (Admin only)
- `DELETE /api/classes/:id` - Delete class (Admin only)

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create subject (Admin only)
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject (Admin only)

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create note (Admin/Teacher)
- `PUT /api/notes/:id` - Update note (Admin/Teacher)
- `DELETE /api/notes/:id` - Delete note (Admin/Teacher)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record (Admin/Teacher)
- `PUT /api/attendance/:id` - Update attendance (Admin/Teacher)
- `DELETE /api/attendance/:id` - Delete attendance (Admin/Teacher)
- `POST /api/attendance/bulk` - Bulk mark attendance (Admin/Teacher)

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment (Admin/Teacher)
- `PUT /api/assignments/:id` - Update assignment (Admin/Teacher)
- `DELETE /api/assignments/:id` - Delete assignment (Admin/Teacher)
- `POST /api/assignments/:id/submit` - Submit assignment (Student)
- `PUT /api/assignments/:id/submissions/:submissionId/grade` - Grade submission (Admin/Teacher)

### Grades
- `GET /api/grades` - Get grades
- `POST /api/grades` - Create grade (Admin/Teacher)
- `PUT /api/grades/:id` - Update grade (Admin/Teacher)
- `DELETE /api/grades/:id` - Delete grade (Admin/Teacher)
- `POST /api/grades/bulk` - Bulk create grades (Admin/Teacher)

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement (Admin/Teacher)
- `PUT /api/announcements/:id` - Update announcement (Admin/Teacher)
- `DELETE /api/announcements/:id` - Delete announcement (Admin/Teacher)

### Calendar
- `GET /api/calendar/events` - Get events
- `POST /api/calendar/events` - Create event (Admin/Teacher)
- `PUT /api/calendar/events/:id` - Update event (Admin/Teacher)
- `DELETE /api/calendar/events/:id` - Delete event (Admin/Teacher)

### Fees
- `GET /api/fees` - Get fees
- `GET /api/fees/:id` - Get fee by ID
- `POST /api/fees` - Create fee (Admin only)
- `PUT /api/fees/:id` - Update fee (Admin only)
- `DELETE /api/fees/:id` - Delete fee (Admin only)
- `POST /api/fees/:id/pay` - Pay fee

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats (Admin/Teacher)
- `GET /api/analytics/attendance` - Get attendance analytics (Admin/Teacher)
- `GET /api/analytics/grades` - Get grade analytics (Admin/Teacher)
- `GET /api/analytics/performance` - Get performance analytics (Admin/Teacher)

## Database Models

### User
- Basic user information with role-based access
- Roles: admin, teacher, student, parent
- Password hashing with bcrypt
- JWT token generation

### Student
- Extended user profile for students
- Parent/guardian contact information
- Medical information
- Academic history

### Teacher
- Extended user profile for teachers
- Employment details
- Qualifications and experience
- Salary information

### Class
- Class management with students and subjects
- Timetable integration
- Capacity management

### Subject
- Subject details with assigned teachers
- Syllabus and resource management
- Class associations

### Attendance
- Daily attendance tracking
- Multiple status types (present, absent, late, excused)
- Bulk attendance marking

### Assignment
- Assignment creation and management
- File attachments support
- Submission tracking and grading

### Grade
- Comprehensive grading system
- Multiple exam types support
- Automatic letter grade calculation

### Announcement
- School-wide communication
- Target audience filtering
- File attachments support

### Event
- Calendar event management
- Recurring events support
- Attendee management

### Fee
- Fee structure management
- Payment tracking
- Multiple payment methods

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user roles
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **Password Hashing**: Bcrypt for secure password storage

## File Upload

The system supports file uploads through Cloudinary integration:
- **Supported formats**: Images, PDFs, Documents, Videos
- **Automatic optimization**: Cloudinary handles file optimization
- **Secure URLs**: All files are served through secure URLs
- **File management**: Automatic cleanup of deleted files

## Real-time Features

Socket.IO integration provides real-time updates for:
- New announcements
- Assignment submissions
- Grade updates
- Attendance marking

## Error Handling

Comprehensive error handling with:
- Custom error middleware
- Validation error formatting
- Database error handling
- File upload error management

## Development

### Project Structure
```
server/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── scripts/        # Utility scripts
├── server.js       # Main server file
└── package.json    # Dependencies
```

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_*` - Cloudinary configuration
- `NODE_ENV=production`

### Production Considerations
- Use MongoDB Atlas for database hosting
- Configure Cloudinary for file storage
- Set up proper logging
- Enable SSL/HTTPS
- Configure rate limiting appropriately
- Set up monitoring and alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.