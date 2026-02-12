import Mentor from '../models/Mentor.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Chat from '../models/Chat.js';

// Get all mentors with filtering
export const getMentors = async (req, res) => {
    try {
        const { category, language } = req.query;
        let query = { isActive: true };

        if (category) query.category = category;
        if (language) query.language = language;

        const mentors = await Mentor.find(query);
        res.json({ success: true, mentors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get mentor by ID
export const getMentorById = async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.id);
        if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
        res.json({ success: true, mentor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all doctors with filtering
export const getDoctors = async (req, res) => {
    try {
        const { therapyType } = req.query;
        let query = { verified: true };

        if (therapyType) query.therapyType = therapyType;

        const doctors = await Doctor.find(query);
        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        res.json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
    try {
        const { userId, userName, professionalId, professionalModel, professionalName, date, slot, type } = req.body;

        const appointment = new Appointment({
            userId,
            userName,
            professionalId,
            professionalModel,
            professionalName,
            date,
            slot,
            type,
            status: 'pending'
        });

        await appointment.save();
        res.status(201).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create or get chat
export const getOrCreateChat = async (req, res) => {
    try {
        const { userId, professionalId, professionalModel } = req.body;

        let chat = await Chat.findOne({ userId, professionalId });

        if (!chat) {
            chat = new Chat({ userId, professionalId, professionalModel, messages: [] });
            await chat.save();
        }

        res.json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Save a message to chat
export const saveMessage = async (req, res) => {
    try {
        const { chatId, senderId, senderName, professionalId, text } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

        chat.messages.push({ senderId, senderName, professionalId, text });
        await chat.save();

        res.json({ success: true, message: 'Message saved' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
