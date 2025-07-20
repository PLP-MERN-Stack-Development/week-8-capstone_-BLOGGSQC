import express from 'express';
import {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  getClassStudents,
  getClassTimetable
} from '../controllers/classes.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'teacher'), getClasses)
  .post(authorize('admin'), createClass);

router
  .route('/:id')
  .get(getClass)
  .put(authorize('admin'), updateClass)
  .delete(authorize('admin'), deleteClass);

router.get('/:id/students', getClassStudents);
router.get('/:id/timetable', getClassTimetable);

export default router;