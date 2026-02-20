import Reward from '../models/Reward.js';
import Redemption from '../models/Redemption.js';
import User from '../models/User.js';

/**
 * Get all active rewards and user token balance
 */
export const getRewards = async (req, res) => {
    try {
        const rewards = await Reward.find({ isActive: true });
        const user = await User.findById(req.user.userId).select('tokens totalRedeemedTokens');

        // Calculate total cashback earned (sum of cashbackValue in completed redemptions)
        const redemptions = await Redemption.find({ userId: req.user.userId, status: 'approved' });
        const totalCashback = redemptions.reduce((sum, r) => sum + (r.cashbackValue || 0), 0);

        res.status(200).json({
            success: true,
            rewards,
            userTokens: user ? user.tokens : 0,
            totalCashback
        });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ success: false, message: 'Server error fetching rewards' });
    }
};

/**
 * Redeem a reward
 */
export const redeemReward = async (req, res) => {
    try {
        const { rewardId } = req.body;
        const userId = req.user.userId;

        // Use findOneAndDelete/Update style or a session for race condition protection if needed,
        // but simple find and save with balance check is usually sufficient for single-instance node.
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const reward = await Reward.findById(rewardId);
        if (!reward || !reward.isActive) {
            return res.status(404).json({ success: false, message: 'Reward not found or inactive' });
        }

        if (user.tokens < reward.tokenCost) {
            return res.status(400).json({ success: false, message: 'Insufficient tokens' });
        }

        // Deduct tokens and update redeemed count
        user.tokens -= reward.tokenCost;
        user.totalRedeemedTokens += reward.tokenCost;
        await user.save();

        // Create redemption record (status pending for security/manual review if needed)
        const redemption = new Redemption({
            userId,
            rewardId,
            tokensUsed: reward.tokenCost,
            cashbackValue: reward.cashbackValue,
            status: 'approved' // Automatically approving for this implementation
        });

        await redemption.save();

        res.status(200).json({
            success: true,
            remainingTokens: user.tokens,
            cashbackValue: reward.cashbackValue,
            message: `🎉 Reward "${reward.title}" redeemed successfully!`
        });
    } catch (error) {
        console.error('Redeem reward error:', error);
        res.status(500).json({ success: false, message: 'Error processing redemption' });
    }
};

/**
 * Get user redemption history
 */
export const getRedemptionHistory = async (req, res) => {
    try {
        const history = await Redemption.find({ userId: req.user.userId })
            .populate('rewardId', 'title description rewardType')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.error('Fetch history error:', error);
        res.status(500).json({ success: false, message: 'Error fetching history' });
    }
};

/**
 * Admin: Create a new reward
 */
export const addReward = async (req, res) => {
    try {
        const { title, description, tokenCost, cashbackValue, rewardType, image } = req.body;

        const reward = new Reward({
            title,
            description,
            tokenCost,
            cashbackValue,
            rewardType,
            image
        });

        await reward.save();

        res.status(201).json({
            success: true,
            message: 'Reward created successfully',
            reward
        });
    } catch (error) {
        console.error('Add reward error:', error);
        res.status(500).json({ success: false, message: 'Error creating reward' });
    }
};
