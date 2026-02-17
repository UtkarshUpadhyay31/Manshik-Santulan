
import mongoose from 'mongoose';
import GameScore from '../models/GameScore.js';
import EmotionBalanceScore from '../models/EmotionBalanceScore.js';

/**
 * Submit a new game score
 */
export const submitScore = async (req, res) => {
    try {
        const { gameId, score, level, duration, metadata } = req.body;

        if (!gameId || score === undefined) {
            return res.status(400).json({ success: false, message: 'Game ID and score are required' });
        }

        const newScore = new GameScore({
            userId: req.user.userId,
            gameId,
            score,
            level: level || 1,
            duration: duration || 0,
            metadata: metadata || {}
        });

        await newScore.save();

        res.status(201).json({
            success: true,
            message: 'Score saved successfully',
            data: newScore
        });
    } catch (error) {
        console.error('Error submitting score:', error);
        res.status(500).json({ success: false, message: 'Server error saving score' });
    }
};

/**
 * Get user stats (best scores, total played) for all games
 */
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Aggregate to get best score and play count per game
        const stats = await GameScore.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$gameId',
                    bestScore: { $max: '$score' },
                    totalPlays: { $count: {} },
                    lastPlayed: { $max: '$playedAt' },
                    totalDuration: { $sum: '$duration' }
                }
            }
        ]);

        // Format for frontend
        const formattedStats = {};
        stats.forEach(stat => {
            formattedStats[stat._id] = {
                bestScore: stat.bestScore,
                totalPlays: stat.totalPlays,
                lastPlayed: stat.lastPlayed,
                totalDuration: stat.totalDuration
            };
        });

        res.status(200).json({
            success: true,
            stats: formattedStats
        });
    } catch (error) {
        console.error('Error fetching user stats:', error); // mongoose isn't imported inside try block, need top level import
        res.status(500).json({ success: false, message: 'Server error fetching stats' });
    }
};

/**
 * Get simple leaderboard/recent activity for a specific game (Optional for now)
 */
export const getGameHistory = async (req, res) => {
    try {
        const { gameId } = req.params;
        const limit = parseInt(req.query.limit) || 10;

        const history = await GameScore.find({
            userId: req.user.userId,
            gameId
        })
            .sort({ playedAt: -1 })
            .limit(limit);

        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ success: false, message: 'Error fetching history' });
    }
};

/**
 * Admin: Get Global Analytics
 */
export const getAdminAnalytics = async (req, res) => {
    try {
        const analytics = await GameScore.aggregate([
            {
                $group: {
                    _id: '$gameId',
                    totalGlobalPlays: { $count: {} },
                    avgScore: { $avg: '$score' },
                    highScore: { $max: '$score' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            analytics
        });
    } catch (error) {
        console.error('Error fetching admin analytics:', error);
        res.status(500).json({ success: false, message: 'Error fetching analytics' });
    }
}

/**
 * Submit Emotion Balance score and update user progress
 */
export const submitEmotionBalanceScore = async (req, res) => {
    try {
        const { score, stability, level, metadata } = req.body;
        const userId = req.user.userId;

        if (score === undefined) {
            return res.status(400).json({ success: false, message: 'Score is required' });
        }

        // Find or create user's emotion balance record
        let userRecord = await EmotionBalanceScore.findOne({ userId });

        if (!userRecord) {
            userRecord = new EmotionBalanceScore({ userId });
        }

        // Update stats
        userRecord.lastScore = score;
        userRecord.totalPlays += 1;

        if (score > userRecord.bestScore) {
            userRecord.bestScore = score;
        }

        if (level && level > userRecord.levelReached) {
            userRecord.levelReached = level;
        }

        // Update average stability
        if (stability !== undefined) {
            const currentAvg = userRecord.averageStability || 0;
            const totalPlays = userRecord.totalPlays;
            userRecord.averageStability = ((currentAvg * (totalPlays - 1)) + stability) / totalPlays;
        }

        if (metadata) {
            userRecord.metadata = { ...userRecord.metadata, ...metadata };
        }

        await userRecord.save();

        res.status(200).json({
            success: true,
            message: 'Emotion balance score saved successfully',
            data: userRecord
        });
    } catch (error) {
        console.error('Error submitting emotion balance score:', error);
        res.status(500).json({ success: false, message: 'Server error saving score' });
    }
};

/**
 * Get user's emotion balance progress
 */
export const getEmotionBalanceProgress = async (req, res) => {
    try {
        const userId = req.user.userId;

        const progress = await EmotionBalanceScore.findOne({ userId });

        if (!progress) {
            return res.status(200).json({
                success: true,
                progress: {
                    bestScore: 0,
                    lastScore: 0,
                    totalPlays: 0,
                    averageStability: 0,
                    levelReached: 1
                }
            });
        }

        res.status(200).json({
            success: true,
            progress
        });
    } catch (error) {
        console.error('Error fetching emotion balance progress:', error);
        res.status(500).json({ success: false, message: 'Server error fetching progress' });
    }
};

/**
 * Admin: Get Emotion Balance Analytics
 */
export const getEmotionBalanceAnalytics = async (req, res) => {
    try {
        const analytics = await EmotionBalanceScore.aggregate([
            {
                $group: {
                    _id: null,
                    totalPlayers: { $count: {} },
                    avgBestScore: { $avg: '$bestScore' },
                    highestScore: { $max: '$bestScore' },
                    avgStability: { $avg: '$averageStability' },
                    totalPlays: { $sum: '$totalPlays' }
                }
            }
        ]);

        const levelDistribution = await EmotionBalanceScore.aggregate([
            {
                $group: {
                    _id: '$levelReached',
                    count: { $count: {} }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            analytics: analytics[0] || {},
            levelDistribution
        });
    } catch (error) {
        console.error('Error fetching emotion balance analytics:', error);
        res.status(500).json({ success: false, message: 'Error fetching analytics' });
    }
};
