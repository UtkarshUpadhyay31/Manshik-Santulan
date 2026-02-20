import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tokenCost: {
        type: Number,
        required: true
    },
    cashbackValue: {
        type: Number,
        default: 0
    },
    rewardType: {
        type: String,
        enum: ['voucher', 'cashback', 'coupon'],
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Reward = mongoose.model('Reward', rewardSchema);

export default Reward;
