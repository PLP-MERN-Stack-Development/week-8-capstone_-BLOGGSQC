import express from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/dashboardController';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

// Routes
router.get('/stats', auth, getDashboardStats);
router.get('/recent-activity', auth, getRecentActivity);

export default router;