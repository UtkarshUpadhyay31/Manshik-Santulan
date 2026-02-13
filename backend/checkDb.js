import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await User.countDocuments();
        const admin = await User.findOne({ email: 'admin@manshik.com' });

        console.log('User stats:', {
            totalUsers: count,
            adminFound: !!admin,
            adminEmail: admin?.email,
            adminRole: admin?.role,
            adminActive: admin?.isActive
        });

        if (admin) {
            // We can't easily check the password here without bcrypt, 
            // but we've verified the record exists.
        } else {
            console.log('Admin user NOT FOUND. Seeding might be needed.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Check failed:', error);
    }
}

check();
