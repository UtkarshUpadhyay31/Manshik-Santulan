import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser,
  updateUserProfile,
  toggleDarkMode 
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/preferences/dark-mode', authMiddleware, toggleDarkMode);

export default router;
