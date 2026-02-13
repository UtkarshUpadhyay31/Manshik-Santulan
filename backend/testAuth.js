import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function testPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@manshik.com';
        const passwordToTest = 'Admin@12345';

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const isMatch = await bcrypt.compare(passwordToTest, user.password);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            console.log('Mismatch detected! Re-hashing and updating...');
            const newHash = await bcrypt.hash(passwordToTest, 12);
            user.password = newHash;
            await user.save();
            console.log('✓ Password updated and re-verified.');

            const verifyAgain = await bcrypt.compare(passwordToTest, user.password);
            console.log('Second Match Check:', verifyAgain);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testPassword();
