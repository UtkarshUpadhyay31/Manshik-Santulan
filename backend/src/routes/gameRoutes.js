
import express from 'express';
import {
    submitScore,
    getUserStats,
    getGameHistory,
    getAdminAnalytics,
    submitEmotionBalanceScore,
    getEmotionBalanceProgress,
    getEmotionBalanceAnalytics
} from '../controllers/gameController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes (none for now, all require auth)

// Protected routes (User)
router.use(authMiddleware);
router.post('/score', submitScore);
router.get('/stats', getUserStats);
router.get('/history/:gameId', getGameHistory);

// Admin routes
router.get('/admin/analytics', adminMiddleware, getAdminAnalytics);
router.get('/admin/emotion-balance/analytics', adminMiddleware, getEmotionBalanceAnalytics);

// Emotion Balance specific routes
router.post('/emotion-balance/score', submitEmotionBalanceScore);
router.get('/emotion-balance/progress', getEmotionBalanceProgress);

export default router;
