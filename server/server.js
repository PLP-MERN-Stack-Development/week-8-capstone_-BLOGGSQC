const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ======================
// ✅ Import routes
// ======================
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const classRoutes = require('./routes/classes');
const subjectRoutes = require('./routes/subjects');
const attendanceRoutes = require('./routes/attendance');
const assignmentRoutes = require('./routes/assignments');
const noteRoutes = require('./routes/notes');
const announcementRoutes = require('./routes/announcements');
const analyticsRoutes = require('./routes/analytics');
const calendarRoutes = require('./routes/calendar');
const dashboardRoutes = require('./routes/dashboard');

// ======================
// ✅ Import middleware
// ======================
const errorHandler = require('./middleware/errorHandler');
const { connectDB } = require('./config/database');

// ======================
// ✅ App initialization
// ======================
const app = express();

// ======================
// ✅ Allowed origins from .env
// ======================
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn("⚠️ No CLIENT_URL set in .env – all requests will fail CORS.");
}

// ======================
// ✅ Connect to MongoDB
// ======================
connectDB();

// ======================
// ✅ Security middleware
// ======================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// ======================
// ✅ Rate limiting
// ======================
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// ======================
// ✅ CORS middleware
// ======================
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow server-to-server or Postman

      // ✅ Always allow explicitly defined origins from .env
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ✅ Allow any *.vercel.app subdomain
      const vercelRegex = /^https?:\/\/.*\.vercel\.app$/;
      if (vercelRegex.test(origin)) {
        return callback(null, true);
      }

      console.error(`❌ CORS blocked request from origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ======================
// ✅ Body parsers
// ======================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ======================
// ✅ Static files
// ======================
app.use('/uploads', express.static('uploads'));

// ======================
// ✅ Health Check
// ======================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EduTech Pro Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ======================
// ✅ API Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ======================
// ✅ 404 handler
// ======================
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// ======================
// ✅ Global error handler
// ======================
app.use(errorHandler);

// ======================
// ✅ Export for Vercel
// ======================
module.exports = app;
