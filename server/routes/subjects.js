import express from 'express';
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjects.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getSubjects)
  .post(authorize('admin'), createSubject);

router
  .route('/:id')
  .get(getSubject)
  .put(authorize('admin', 'teacher'), updateSubject)
  .delete(authorize('admin'), deleteSubject);

export default router;