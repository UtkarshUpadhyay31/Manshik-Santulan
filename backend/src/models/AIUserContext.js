import mongoose from 'mongoose';
import { encrypt, decrypt } from '../utils/cryptoUtils.js';

const AIUserContextSchema = new mongoose.Schema({
    userId: {
        type: String, // String as per existing Chat/User pattern if needed, or ObjectId
        required: true,
        unique: true
    },
    userName: String,
    dominantEmotion: String,
    past5Conversations: [{
        timestamp: { type: Date, default: Date.now },
        userMessage: { type: String, set: encrypt, get: decrypt },
        aiResponse: { type: String, set: encrypt, get: decrypt },
        detectedEmotion: String
    }],
    triggerTopics: [{ type: String, set: encrypt, get: decrypt }],
    improvementPattern: {
        trend: String, // 'improving', 'stable', 'declining'
        lastAnalyzed: Date
    },
    currentMode: {
        type: String,
        enum: ['Calm', 'Clarity', 'Power'],
        default: 'Calm'
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

export default mongoose.model('AIUserContext', AIUserContextSchema);
