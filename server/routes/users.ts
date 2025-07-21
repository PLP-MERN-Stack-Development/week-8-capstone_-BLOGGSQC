import express from 'express';
import { body, query } from 'express-validator';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole
} from '../controllers/userController';
import { auth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation rules
const createUserValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('username').isLength({ min: 3, max: 20 }).trim().withMessage('Username must be 3-20 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  body('role').isIn(['admin', 'teacher', 'student', 'parent']).withMessage('Invalid role')
];

const updateUserValidation = [
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('username').optional().isLength({ min: 3, max: 20 }).trim().withMessage('Username must be 3-20 characters long'),
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('role').optional().isIn(['admin', 'teacher', 'student', 'parent']).withMessage('Invalid role')
];

const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['admin', 'teacher', 'student', 'parent']).withMessage('Invalid role filter')
];

// Routes
router.get('/', auth, authorize('admin', 'teacher'), queryValidation, validate, getUsers);
router.get('/role/:role', auth, authorize('admin', 'teacher'), getUsersByRole);
router.get('/:id', auth, getUserById);
router.post('/', auth, authorize('admin'), createUserValidation, validate, createUser);
router.put('/:id', auth, authorize('admin'), updateUserValidation, validate, updateUser);
router.delete('/:id', auth, authorize('admin'), deleteUser);

export default router;