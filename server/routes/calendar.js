import express from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/calendar.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/events')
  .get(getEvents)
  .post(authorize('admin', 'teacher'), createEvent);

router
  .route('/events/:id')
  .put(authorize('admin', 'teacher'), updateEvent)
  .delete(authorize('admin', 'teacher'), deleteEvent);

export default router;