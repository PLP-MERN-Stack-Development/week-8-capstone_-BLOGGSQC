import express from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notes.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getNotes)
  .post(authorize('admin', 'teacher'), createNote);

router
  .route('/:id')
  .get(getNote)
  .put(authorize('admin', 'teacher'), updateNote)
  .delete(authorize('admin', 'teacher'), deleteNote);

export default router;