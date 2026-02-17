
import mongoose from 'mongoose';

const gameScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameId: {
        type: String,
        enum: ['focus', 'memory', 'breathing', 'mood'],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    level: {
        type: Number, // For games with levels
        default: 1
    },
    duration: {
        type: Number, // In seconds
        default: 0
    },
    metadata: {
        type: Object, // For game-specific data (e.g., 'moves' in memory game)
        default: {}
    },
    playedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient leaderboards and history
gameScoreSchema.index({ userId: 1, gameId: 1, playedAt: -1 });
gameScoreSchema.index({ gameId: 1, score: -1 });

const GameScore = mongoose.model('GameScore', gameScoreSchema);

export default GameScore;
