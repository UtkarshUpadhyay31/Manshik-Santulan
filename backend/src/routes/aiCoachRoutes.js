import express from 'express';
import { handleAIChat, getAIContext } from '../controllers/aiCoachController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public trial endpoint (or protected if user is logged in)
// For now, let's keep it consistent with the existing app pattern
router.post('/chat', handleAIChat);
router.get('/context/:userId', getAIContext);

export default router;
