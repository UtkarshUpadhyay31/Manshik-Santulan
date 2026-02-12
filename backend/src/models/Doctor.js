import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'
    },
    qualification: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    therapyType: [{
        type: String,
        enum: ['Anxiety', 'Depression', 'Stress', 'Sleep Disorders']
    }],
    availability: [{
        day: String,
        slots: [String]
    }],
    rating: {
        type: Number,
        default: 5.0
    },
    verified: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Doctor', DoctorSchema);
