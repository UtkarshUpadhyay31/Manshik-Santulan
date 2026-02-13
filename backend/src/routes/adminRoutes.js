import express from 'express';
import {
  getDashboardAnalytics,
  getAllUsers,
  getUserDetails,
  deactivateUser,
  reactivateUser,
  deleteUser,
  getAnonymousMoodData,
  getAIConfig,
  updateAIConfig,
  getAIAnalytics
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Analytics routes
router.get('/analytics', getDashboardAnalytics);
router.get('/mood-data', getAnonymousMoodData);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId/deactivate', deactivateUser);
router.put('/users/:userId/reactivate', reactivateUser);
router.delete('/users/:userId', deleteUser);

// AI Engine Management
router.get('/ai-config', getAIConfig);
router.put('/ai-config', updateAIConfig);
router.get('/ai-analytics', getAIAnalytics);

export default router;
