import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reward from './src/models/Reward.js';

dotenv.config();

const rewards = [
    {
        title: "Amazon Health Voucher",
        description: "Get ₹100 off on any health and wellness products on Amazon.",
        tokenCost: 50,
        cashbackValue: 100,
        rewardType: "voucher",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
    },
    {
        title: "Flipkart Gift Card",
        description: "₹50 Flipkart Gift Card for your wellness journey.",
        tokenCost: 30,
        cashbackValue: 50,
        rewardType: "voucher",
        image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg"
    },
    {
        title: "Calm Mind Coupon",
        description: "Exclusive 20% discount on holistic wellness therapies.",
        tokenCost: 20,
        cashbackValue: 200,
        rewardType: "coupon",
        image: "https://plus.unsplash.com/premium_photo-1661771825061-397a66699ed7"
    },
    {
        title: "Instant Wellness Cashback",
        description: "Redeem 100 tokens for dry ₹200 cashback in your wallet.",
        tokenCost: 100,
        cashbackValue: 200,
        rewardType: "cashback",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c"
    }
];

const seedRewards = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Reward.deleteMany({});
        console.log('Cleared existing rewards');

        await Reward.insertMany(rewards);
        console.log('Seed data inserted successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding rewards:', error);
        process.exit(1);
    }
};

seedRewards();
