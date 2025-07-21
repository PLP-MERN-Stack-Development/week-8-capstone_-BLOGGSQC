import express from 'express';
import { body } from 'express-validator';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} from '../controllers/classController';
import { auth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const createClassValidation = [
  body('name').notEmpty().trim().withMessage('Class name is required'),
  body('section').notEmpty().trim().withMessage('Section is required'),
  body('teacher').isMongoId().withMessage('Valid teacher ID is required'),
  body('classroom').notEmpty().trim().withMessage('Classroom is required'),
  body('capacity').isInt({ min: 1, max: 100 }).withMessage('Capacity must be between 1 and 100'),
  body('academicYear').notEmpty().trim().withMessage('Academic year is required')
];

const updateClassValidation = [
  body('name').optional().trim().notEmpty().withMessage('Class name cannot be empty'),
  body('section').optional().trim().notEmpty().withMessage('Section cannot be empty'),
  body('teacher').optional().isMongoId().withMessage('Valid teacher ID is required'),
  body('classroom').optional().trim().notEmpty().withMessage('Classroom cannot be empty'),
  body('capacity').optional().isInt({ min: 1, max: 100 }).withMessage('Capacity must be between 1 and 100'),
  body('academicYear').optional().trim().notEmpty().withMessage('Academic year cannot be empty')
];

// Routes
router.get('/', auth, getClasses);
router.get('/:id', auth, getClassById);
router.post('/', auth, authorize('admin'), createClassValidation, validate, createClass);
router.put('/:id', auth, authorize('admin'), updateClassValidation, validate, updateClass);
router.delete('/:id', auth, authorize('admin'), deleteClass);

export default router;