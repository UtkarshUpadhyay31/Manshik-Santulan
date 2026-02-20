import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reward from './src/models/Reward.js';
import User from './src/models/User.js';
import Redemption from './src/models/Redemption.js';

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const rewardCount = await Reward.countDocuments();
        console.log(`Found ${rewardCount} rewards.`);

        const activeRewards = await Reward.find({ isActive: true });
        console.log('Active Rewards:', activeRewards.map(r => r.title));

        const userCount = await User.countDocuments();
        console.log(`Found ${userCount} users.`);

        const redemptions = await Redemption.countDocuments();
        console.log(`Found ${redemptions} redemptions.`);

        process.exit();
    } catch (error) {
        console.error('Error verifying data:', error);
        process.exit(1);
    }
};

verifyData();
