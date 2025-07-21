import express from 'express';
import { body } from 'express-validator';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController';
import { auth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const createSubjectValidation = [
  body('name').notEmpty().trim().withMessage('Subject name is required'),
  body('code').notEmpty().trim().withMessage('Subject code is required'),
  body('credits').isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

const updateSubjectValidation = [
  body('name').optional().trim().notEmpty().withMessage('Subject name cannot be empty'),
  body('code').optional().trim().notEmpty().withMessage('Subject code cannot be empty'),
  body('credits').optional().isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// Routes
router.get('/', auth, getSubjects);
router.get('/:id', auth, getSubjectById);
router.post('/', auth, authorize('admin'), createSubjectValidation, validate, createSubject);
router.put('/:id', auth, authorize('admin'), updateSubjectValidation, validate, updateSubject);
router.delete('/:id', auth, authorize('admin'), deleteSubject);

export default router;