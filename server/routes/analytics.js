import express from 'express';
import {
  getDashboardStats,
  getAttendanceStats,
  getGradeStats,
  getPerformanceStats
} from '../controllers/analytics.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', authorize('admin', 'teacher'), getDashboardStats);
router.get('/attendance', authorize('admin', 'teacher'), getAttendanceStats);
router.get('/grades', authorize('admin', 'teacher'), getGradeStats);
router.get('/performance', authorize('admin', 'teacher'), getPerformanceStats);

export default router;