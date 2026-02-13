import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import { connectDB, disconnectDB } from '../src/utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@manshik.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin account already exists.');
            await disconnectDB();
            return;
        }

        const hashedPassword = await bcrypt.hash('Admin@12345', 12);

        const adminUser = new User({
            firstName: 'System',
            lastName: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        await adminUser.save();
        console.log('✓ Admin account created successfully!');
        console.log('Email: admin@manshik.com');
        console.log('Password: Admin@12345');

        await disconnectDB();
    } catch (error) {
        console.error('✗ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
