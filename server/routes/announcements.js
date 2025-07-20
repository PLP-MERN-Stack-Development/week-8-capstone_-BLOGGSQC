import express from 'express';
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcements.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAnnouncements)
  .post(authorize('admin', 'teacher'), createAnnouncement);

router
  .route('/:id')
  .get(getAnnouncement)
  .put(authorize('admin', 'teacher'), updateAnnouncement)
  .delete(authorize('admin', 'teacher'), deleteAnnouncement);

export default router;