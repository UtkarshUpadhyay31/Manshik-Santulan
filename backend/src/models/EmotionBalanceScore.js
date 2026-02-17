import mongoose from 'mongoose';

const emotionBalanceScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bestScore: {
        type: Number,
        default: 0
    },
    lastScore: {
        type: Number,
        default: 0
    },
    totalPlays: {
        type: Number,
        default: 0
    },
    averageStability: {
        type: Number,
        default: 0
    },
    levelReached: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

// Index for faster queries
emotionBalanceScoreSchema.index({ userId: 1 });
emotionBalanceScoreSchema.index({ bestScore: -1 });

const EmotionBalanceScore = mongoose.model('EmotionBalanceScore', emotionBalanceScoreSchema);

export default EmotionBalanceScore;
