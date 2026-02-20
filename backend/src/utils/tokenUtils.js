import User from '../models/User.js';

/**
 * Award tokens to a user
 * @param {string} userId - ID of the user
 * @param {number} amount - Amount of tokens to award
 * @returns {Promise<object>} - Updated user
 */
export const awardTokens = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        user.tokens += (amount || 0);
        user.totalEarnedTokens += (amount || 0);
        await user.save();

        return user;
    } catch (error) {
        console.error('Error awarding tokens:', error);
        throw error;
    }
};

/**
 * Deduct tokens from a user
 * @param {string} userId - ID of the user
 * @param {number} amount - Amount of tokens to deduct
 * @returns {Promise<object>} - Updated user
 */
export const deductTokens = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        if (user.tokens < amount) {
            throw new Error('Insufficient tokens');
        }

        user.tokens -= amount;
        user.totalRedeemedTokens += amount;
        await user.save();

        return user;
    } catch (error) {
        console.error('Error deducting tokens:', error);
        throw error;
    }
};
