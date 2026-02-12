import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mentor from './models/Mentor.js';
import Doctor from './models/Doctor.js';
import { connectDB } from './utils/db.js';

dotenv.config();

const mentors = [
    {
        name: 'Anjali Sharma',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        category: 'Career',
        expertise: ['Career Coaching', 'Public Speaking', 'Interview Prep'],
        experience: 8,
        language: ['Hindi', 'English'],
        availability: [
            { day: 'Monday', slots: ['10:00', '11:00', '14:00', '15:00'] },
            { day: 'Wednesday', slots: ['10:00', '11:00', '15:00', '16:00'] },
            { day: 'Friday', slots: ['09:00', '10:00', '11:00'] }
        ],
        rating: 4.8,
        isActive: true
    },
    {
        name: 'Rahul Verma',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        category: 'Mental Wellness',
        expertise: ['Stress Management', 'Mindfulness', 'Anxiety Relief'],
        experience: 5,
        language: ['English', 'Hindi'],
        availability: [
            { day: 'Tuesday', slots: ['09:00', '10:00', '16:00', '17:00'] },
            { day: 'Thursday', slots: ['09:00', '10:00', '17:00', '18:00'] },
            { day: 'Saturday', slots: ['11:00', '12:00'] }
        ],
        rating: 4.9,
        isActive: true
    }
];

const doctors = [
    {
        name: 'Dr. Sameer Malini',
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
        qualification: 'MD, Psychiatry',
        specialization: 'Clinical Psychologist',
        experience: 12,
        therapyType: ['Anxiety', 'Depression'],
        availability: [
            { day: 'Monday', slots: ['11:00', '12:00', '18:00', '19:00'] },
            { day: 'Wednesday', slots: ['10:00', '11:00', '14:00'] },
            { day: 'Friday', slots: ['11:00', '12:00', '15:00', '16:00'] }
        ],
        rating: 4.7,
        verified: true
    },
    {
        name: 'Dr. Priya Das',
        photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
        qualification: 'PhD, Clinical Psychology',
        specialization: 'Therapist',
        experience: 10,
        therapyType: ['Stress', 'Sleep Disorders', 'Anxiety'],
        availability: [
            { day: 'Tuesday', slots: ['14:00', '15:00', '19:00', '20:00'] },
            { day: 'Thursday', slots: ['12:00', '13:00', '14:00'] },
            { day: 'Saturday', slots: ['10:00', '11:00', '12:00'] }
        ],
        rating: 4.9,
        verified: true
    }
];

const seedData = async () => {
    try {
        await connectDB();

        await Mentor.deleteMany({});
        await Doctor.deleteMany({});

        await Mentor.insertMany(mentors);
        await Doctor.insertMany(doctors);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
