import express from 'express';
import {
    getStreak,
    incrementStreak,
    getStreakHistory,
    getAdminStreakAnalytics,
    resetUserStreak
} from '../controllers/streakController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (User)
router.use(authMiddleware);
router.get('/', getStreak);
router.post('/increment', incrementStreak);
router.get('/history', getStreakHistory);

// Admin routes
router.get('/admin/analytics', adminMiddleware, getAdminStreakAnalytics);
router.post('/admin/reset/:userId', adminMiddleware, resetUserStreak);

export default router;
