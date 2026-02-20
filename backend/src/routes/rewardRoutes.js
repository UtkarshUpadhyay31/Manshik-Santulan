import express from 'express';
import {
    getRewards,
    redeemReward,
    getRedemptionHistory,
    addReward
} from '../controllers/rewardController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(authMiddleware);

router.get('/', getRewards);
router.post('/redeem', redeemReward);
router.get('/history', getRedemptionHistory);

// Admin routes
router.post('/admin/add', adminMiddleware, addReward);

export default router;
