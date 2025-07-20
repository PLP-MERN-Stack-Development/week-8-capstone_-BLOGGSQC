import express from 'express';
import {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission
} from '../controllers/assignments.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAssignments)
  .post(authorize('admin', 'teacher'), createAssignment);

router
  .route('/:id')
  .get(getAssignment)
  .put(authorize('admin', 'teacher'), updateAssignment)
  .delete(authorize('admin', 'teacher'), deleteAssignment);

router.post('/:id/submit', authorize('student'), submitAssignment);
router.put('/:id/submissions/:submissionId/grade', authorize('admin', 'teacher'), gradeSubmission);

export default router;