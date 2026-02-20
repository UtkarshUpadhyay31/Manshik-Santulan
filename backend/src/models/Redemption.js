import mongoose from 'mongoose';

const redemptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rewardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
        required: true
    },
    tokensUsed: {
        type: Number,
        required: true
    },
    cashbackValue: {
        type: Number,
        default: 0
    },
    redeemedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    voucherCode: {
        type: String,
        default: () => Math.random().toString(36).substring(2, 10).toUpperCase()
    }
}, {
    timestamps: true
});

redemptionSchema.index({ userId: 1 });

const Redemption = mongoose.model('Redemption', redemptionSchema);

export default Redemption;
