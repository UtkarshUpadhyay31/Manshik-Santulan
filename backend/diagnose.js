import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mentor from './src/models/Mentor.js';
import Doctor from './src/models/Doctor.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const mentors = await Mentor.find({});
        console.log('Mentors Count:', mentors.length);
        console.log('Mentors:', JSON.stringify(mentors, null, 2));

        const doctors = await Doctor.find({});
        console.log('Doctors Count:', doctors.length);
        console.log('Doctors:', JSON.stringify(doctors, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
