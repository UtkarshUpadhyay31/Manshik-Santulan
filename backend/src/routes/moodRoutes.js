import express from 'express';
import {
  createMoodEntry,
  analyzeEmotion,
  getMoodHistory,
  getTodayMood,
  getAISuggestions,
  completeSuggestion
} from '../controllers/moodController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All mood routes require authentication
router.use(authMiddleware);

// Mood tracking routes
router.post('/entry', createMoodEntry);
router.get('/today', getTodayMood);
router.get('/history', getMoodHistory);

// Emotion analysis routes
router.post('/analyze', analyzeEmotion);

// AI suggestions routes
router.get('/suggestions', getAISuggestions);
router.put('/suggestions/:suggestionId/complete', completeSuggestion);

export default router;
