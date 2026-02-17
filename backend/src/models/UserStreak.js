import mongoose from 'mongoose';

const userStreakSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date,
        default: null
    },
    streakHistory: {
        type: [Boolean], // Array of 30 booleans (true = active, false = missed)
        default: () => new Array(30).fill(false)
    },
    totalActiveDays: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
userStreakSchema.index({ userId: 1 });
userStreakSchema.index({ currentStreak: -1 });
userStreakSchema.index({ longestStreak: -1 });

const UserStreak = mongoose.model('UserStreak', userStreakSchema);

export default UserStreak;
