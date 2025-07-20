import express from 'express';
import {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherClasses,
  getTeacherSubjects
} from '../controllers/teachers.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('admin'), getTeachers)
  .post(authorize('admin'), createTeacher);

router
  .route('/:id')
  .get(getTeacher)
  .put(authorize('admin'), updateTeacher)
  .delete(authorize('admin'), deleteTeacher);

router.get('/:id/classes', getTeacherClasses);
router.get('/:id/subjects', getTeacherSubjects);

export default router;