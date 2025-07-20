import express from 'express';
import {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  bulkCreateGrades
} from '../controllers/grades.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getGrades)
  .post(authorize('admin', 'teacher'), createGrade);

router
  .route('/:id')
  .put(authorize('admin', 'teacher'), updateGrade)
  .delete(authorize('admin', 'teacher'), deleteGrade);

router.post('/bulk', authorize('admin', 'teacher'), bulkCreateGrades);

export default router;