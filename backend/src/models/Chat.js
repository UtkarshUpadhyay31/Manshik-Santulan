import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    senderName: String,
    professionalId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    professionalId: {
        type: String,
        required: true
    },
    professionalModel: {
        type: String,
        enum: ['Mentor', 'Doctor'],
        required: true
    },
    messages: [MessageSchema]
}, { timestamps: true });

export default mongoose.model('Chat', ChatSchema);
