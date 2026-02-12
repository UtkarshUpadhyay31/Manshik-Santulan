import express from 'express';
import {
    getMentors,
    getMentorById,
    getDoctors,
    getDoctorById,
    bookAppointment,
    getOrCreateChat,
    saveMessage
} from '../controllers/professionalController.js';

const router = express.Router();

router.get('/mentors', getMentors);
router.get('/mentors/:id', getMentorById);
router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);
router.post('/book-appointment', bookAppointment);
router.post('/chat/init', getOrCreateChat);
router.post('/chat/message', saveMessage);

export default router;
