import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const migrateUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await User.updateMany(
            {
                $or: [
                    { tokens: { $exists: false } },
                    { streakCount: { $exists: false } },
                    { totalEarnedTokens: { $exists: false } },
                    { totalRedeemedTokens: { $exists: false } }
                ]
            },
            {
                $set: {
                    tokens: 0,
                    streakCount: 0,
                    totalEarnedTokens: 0,
                    totalRedeemedTokens: 0,
                    lastActiveDate: null
                }
            }
        );

        console.log(`Migration complete. Updated ${result.modifiedCount} users.`);
        process.exit();
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrateUsers();
