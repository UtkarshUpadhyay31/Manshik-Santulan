import UserStreak from '../models/UserStreak.js';

/**
 * Get current user's streak data
 */
export const getStreak = async (req, res) => {
    try {
        const userId = req.user.userId;

        let streak = await UserStreak.findOne({ userId });

        if (!streak) {
            // Create new streak record
            streak = new UserStreak({ userId });
            await streak.save();
        }

        // Check if streak should be reset due to inactivity
        if (streak.lastActiveDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastActive = new Date(streak.lastActiveDate);
            lastActive.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

            // Reset if more than 1 day inactive
            if (daysDiff > 1) {
                streak.currentStreak = 0;
                await streak.save();
            }
        }

        res.status(200).json({
            success: true,
            streak
        });
    } catch (error) {
        console.error('Error fetching streak:', error);
        res.status(500).json({ success: false, message: 'Server error fetching streak' });
    }
};

/**
 * Increment streak when user performs qualifying action
 */
export const incrementStreak = async (req, res) => {
    try {
        const userId = req.user.userId;

        let streak = await UserStreak.findOne({ userId });

        if (!streak) {
            streak = new UserStreak({ userId });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already incremented today
        if (streak.lastActiveDate) {
            const lastActive = new Date(streak.lastActiveDate);
            lastActive.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Already counted today, no increment
                return res.status(200).json({
                    success: true,
                    message: 'Streak already counted today',
                    streak
                });
            } else if (daysDiff === 1) {
                // Consecutive day - increment streak
                streak.currentStreak += 1;
            } else {
                // Missed days - reset to 1
                streak.currentStreak = 1;
            }
        } else {
            // First time
            streak.currentStreak = 1;
        }

        // Update longest streak
        if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
        }

        // Update last active date
        streak.lastActiveDate = today;

        // Update total active days
        streak.totalActiveDays += 1;

        // Update streak history (shift array and add today)
        streak.streakHistory.shift();
        streak.streakHistory.push(true);

        await streak.save();

        res.status(200).json({
            success: true,
            message: 'Streak incremented',
            streak,
            isNewMilestone: streak.currentStreak % 7 === 0 // Celebrate every 7 days
        });
    } catch (error) {
        console.error('Error incrementing streak:', error);
        res.status(500).json({ success: false, message: 'Server error incrementing streak' });
    }
};

/**
 * Get 30-day streak history for graphs
 */
export const getStreakHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        const streak = await UserStreak.findOne({ userId });

        if (!streak) {
            return res.status(200).json({
                success: true,
                history: new Array(30).fill(false)
            });
        }

        res.status(200).json({
            success: true,
            history: streak.streakHistory
        });
    } catch (error) {
        console.error('Error fetching streak history:', error);
        res.status(500).json({ success: false, message: 'Server error fetching history' });
    }
};

/**
 * Admin: Get global streak analytics
 */
export const getAdminStreakAnalytics = async (req, res) => {
    try {
        const analytics = await UserStreak.aggregate([
            {
                $group: {
                    _id: null,
                    avgCurrentStreak: { $avg: '$currentStreak' },
                    avgLongestStreak: { $avg: '$longestStreak' },
                    totalUsers: { $count: {} },
                    totalActiveDays: { $sum: '$totalActiveDays' }
                }
            }
        ]);

        // Get top 10 longest streaks
        const topStreaks = await UserStreak.find()
            .sort({ longestStreak: -1 })
            .limit(10)
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            analytics: analytics[0] || {},
            topStreaks
        });
    } catch (error) {
        console.error('Error fetching admin streak analytics:', error);
        res.status(500).json({ success: false, message: 'Error fetching analytics' });
    }
};

/**
 * Admin: Reset user streak
 */
export const resetUserStreak = async (req, res) => {
    try {
        const { userId } = req.params;

        const streak = await UserStreak.findOne({ userId });

        if (!streak) {
            return res.status(404).json({ success: false, message: 'Streak not found' });
        }

        streak.currentStreak = 0;
        streak.lastActiveDate = null;
        streak.streakHistory = new Array(30).fill(false);

        await streak.save();

        res.status(200).json({
            success: true,
            message: 'Streak reset successfully'
        });
    } catch (error) {
        console.error('Error resetting streak:', error);
        res.status(500).json({ success: false, message: 'Server error resetting streak' });
    }
};
