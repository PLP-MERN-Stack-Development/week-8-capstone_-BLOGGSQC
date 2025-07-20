import express from 'express';
import {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee,
  payFee
} from '../controllers/fees.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getFees)
  .post(authorize('admin'), createFee);

router
  .route('/:id')
  .get(getFee)
  .put(authorize('admin'), updateFee)
  .delete(authorize('admin'), deleteFee);

router.post('/:id/pay', authorize('admin', 'student', 'parent'), payFee);

export default router;