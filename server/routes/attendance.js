import express from 'express';
import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  markBulkAttendance
} from '../controllers/attendance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAttendance)
  .post(authorize('admin', 'teacher'), createAttendance);

router
  .route('/:id')
  .put(authorize('admin', 'teacher'), updateAttendance)
  .delete(authorize('admin', 'teacher'), deleteAttendance);

router.post('/bulk', authorize('admin', 'teacher'), markBulkAttendance);

export default router;