import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    category: {
        type: String,
        required: true,
        enum: ['Career', 'Life', 'Relationship', 'Mental Wellness']
    },
    expertise: [{
        type: String
    }],
    experience: {
        type: Number,
        required: true
    },
    language: [{
        type: String,
        enum: ['Hindi', 'English']
    }],
    availability: [{
        day: String,
        slots: [String]
    }],
    rating: {
        type: Number,
        default: 5.0
    },
    reviews: [{
        user: String,
        comment: String,
        rating: Number,
        date: { type: Date, default: Date.now }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Mentor', MentorSchema);
