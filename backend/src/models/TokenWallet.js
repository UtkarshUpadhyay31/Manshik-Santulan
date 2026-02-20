import mongoose from 'mongoose';

const tokenWalletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalTokens: {
        type: Number,
        default: 0
    },
    lifetimeEarned: {
        type: Number,
        default: 0
    },
    lastRewardClaimed: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

tokenWalletSchema.index({ userId: 1 });

const TokenWallet = mongoose.model('TokenWallet', tokenWalletSchema);

export default TokenWallet;
