import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: String, // Keep as string for now if using guest-friendly approach or mongoose.Schema.Types.ObjectId
        required: true
    },
    userName: String,
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'professionalModel'
    },
    professionalModel: {
        type: String,
        required: true,
        enum: ['Mentor', 'Doctor']
    },
    professionalName: String,
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    slot: {
        type: String, // Format: HH:MM
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['chat', 'audio', 'video'],
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Appointment', AppointmentSchema);
