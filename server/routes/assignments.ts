import express from 'express';
import { body } from 'express-validator';
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeAssignment
} from '../controllers/assignmentController';
import { auth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const createAssignmentValidation = [
  body('title').notEmpty().trim().withMessage('Assignment title is required'),
  body('description').notEmpty().trim().withMessage('Assignment description is required'),
  body('subject').isMongoId().withMessage('Valid subject ID is required'),
  body('class').isMongoId().withMessage('Valid class ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('totalMarks').isInt({ min: 1 }).withMessage('Total marks must be a positive integer')
];

const updateAssignmentValidation = [
  body('title').optional().trim().notEmpty().withMessage('Assignment title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Assignment description cannot be empty'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  body('totalMarks').optional().isInt({ min: 1 }).withMessage('Total marks must be a positive integer')
];

const submitAssignmentValidation = [
  body('content').optional().trim(),
  body('attachments').optional().isArray().withMessage('Attachments must be an array')
];

const gradeAssignmentValidation = [
  body('marks').isInt({ min: 0 }).withMessage('Marks must be a non-negative integer'),
  body('feedback').optional().trim()
];

// Routes
router.get('/', auth, getAssignments);
router.get('/:id', auth, getAssignmentById);
router.post('/', auth, authorize('admin', 'teacher'), createAssignmentValidation, validate, createAssignment);
router.put('/:id', auth, authorize('admin', 'teacher'), updateAssignmentValidation, validate, updateAssignment);
router.delete('/:id', auth, authorize('admin', 'teacher'), deleteAssignment);
router.post('/:id/submit', auth, authorize('student'), submitAssignmentValidation, validate, submitAssignment);
router.put('/:id/grade', auth, authorize('admin', 'teacher'), gradeAssignmentValidation, validate, gradeAssignment);

export default router;