import User from '../models/User.js';
import MoodEntry from '../models/MoodEntry.js';

/**
 * Get Dashboard Analytics - Admin Overview
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ 
      role: 'user', 
      isActive: true 
    });
    const lastSevenDays = new Date();
    lastSevenDays.setDate(lastSevenDays.getDate() - 7);
    
    const newUsers = await User.countDocuments({ 
      role: 'user',
      createdAt: { $gte: lastSevenDays }
    });

    // Get mood trends
    const moodEntries = await MoodEntry.find({
      timestamp: { $gte: lastSevenDays }
    });

    const moodTrends = calculateMoodTrends(moodEntries);
    const averageStress = moodEntries.length > 0 
      ? Math.round(moodEntries.reduce((sum, e) => sum + e.stressLevel, 0) / moodEntries.length)
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        activeUsers,
        newUsersThisWeek: newUsers,
        moodTrends,
        averageStressLevel: averageStress,
        totalMoodEntries: moodEntries.length
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching analytics' 
    });
  }
};

/**
 * Get All Users (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: 'user' })
      .select('-password')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments({ role: 'user' });

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users' 
    });
  }
};

/**
 * Get User Details (Admin)
 */
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get user's mood entries
    const moodEntries = await MoodEntry.find({ userId }).sort({ timestamp: -1 }).limit(10);

    res.status(200).json({
      success: true,
      user,
      recentMoodEntries: moodEntries
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user details' 
    });
  }
};

/**
 * Deactivate User (Admin)
 */
export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (userId === req.user.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot deactivate your own account' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      user
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deactivating user' 
    });
  }
};

/**
 * Reactivate User (Admin)
 */
export const reactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'User reactivated successfully',
      user
    });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error reactivating user' 
    });
  }
};

/**
 * Delete User (Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    // Delete user and all related data
    await User.findByIdAndDelete(userId);
    await MoodEntry.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting user' 
    });
  }
};

/**
 * Get Anonymous Mood Data (for trends and insights)
 */
export const getAnonymousMoodData = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moodData = await MoodEntry.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
          avgStress: { $avg: '$stressLevel' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const emotionData = await MoodEntry.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$emotion',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      moodDistribution: moodData,
      emotionDistribution: emotionData
    });
  } catch (error) {
    console.error('Get mood data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching mood data' 
    });
  }
};

/**
 * Calculate Mood Trends
 */
const calculateMoodTrends = (moodEntries) => {
  const moodCount = {
    very_happy: 0,
    happy: 0,
    neutral: 0,
    sad: 0,
    very_sad: 0
  };

  moodEntries.forEach(entry => {
    if (moodCount.hasOwnProperty(entry.mood)) {
      moodCount[entry.mood]++;
    }
  });

  return moodCount;
};
