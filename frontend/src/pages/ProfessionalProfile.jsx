import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button, Container, Card } from '../components/UI';
import api from '../services/api';

const ProfessionalProfile = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const navigate = useNavigate();

    const [professional, setProfessional] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [id, type]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const endpoint = type === 'mentor' ? 'mentors' : 'doctors';
            const res = await api.get(`/professionals/${endpoint}/${id}`);
            console.log('Profile fetched:', res.data);
            setProfessional(res.data.mentor || res.data.doctor);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!selectedDay || !selectedSlot) return;

        try {
            await api.post('/professionals/book-appointment', {
                userId: 'guest_user', // Mock user
                userName: 'Guest User',
                professionalId: id,
                professionalModel: type === 'mentor' ? 'Mentor' : 'Doctor',
                professionalName: professional.name,
                date: selectedDay,
                slot: selectedSlot,
                type: 'audio' // Default
            });
            setBookingSuccess(true);
            setTimeout(() => {
                setBookingSuccess(false);
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Booking failed:', error);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

    if (!professional) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Professional Not Found</h2>
            <Link to="/">
                <Button>Go Back Home</Button>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-20">
            <Container>
                <Link to={type === 'mentor' ? '/mentors' : '/therapists'} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8">
                    <ArrowLeft size={20} /> Back to List
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-white border border-slate-100 shadow-2xl rounded-[3rem] p-10 md:p-14">
                            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                                <img
                                    src={professional.photo}
                                    alt={professional.name}
                                    className="w-48 h-48 rounded-[2rem] object-cover border-8 border-white shadow-2xl shadow-purple-500/10"
                                />
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                        <h1 className="text-4xl font-bold text-slate-900">{professional.name}</h1>
                                        {type === 'doctor' && professional.verified && (
                                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                                <ShieldCheck size={14} /> VERIFIED
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xl text-purple-600 font-semibold mb-6 flex items-center justify-center md:justify-start gap-2">
                                        {type === 'mentor' ? professional.category : professional.qualification}
                                    </p>

                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        <div className="text-center md:text-left">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                                            <p className="text-xl font-bold text-slate-800">{professional.experience}Yrs</p>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                                            <div className="flex items-center justify-center md:justify-start gap-1 text-xl font-bold text-slate-800">
                                                <Star size={20} className="fill-yellow-500 text-yellow-500" /> {professional.rating}
                                            </div>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sessions</p>
                                            <p className="text-xl font-bold text-slate-800">450+</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {(type === 'mentor' ? professional.expertise : professional.therapyType).map(tag => (
                                            <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-600">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-slate-50">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Expertise & Bio</h2>
                                <p className="text-lg text-slate-600 leading-relaxed mb-10">
                                    {professional.bio || `Specialized in helping individuals overcome challenges related to ${(type === 'mentor' ? professional.expertise : professional.therapyType).join(', ')}. Committed to providing a safe, empathetic, and evidence-based approach to mental wellness.`}
                                </p>
                            </div>
                        </Card>

                        {/* Reviews Mock */}
                        <Card className="bg-white border border-slate-100 rounded-[3rem] p-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Recent Reviews</h2>
                            <div className="space-y-6">
                                {[1, 2].map(i => (
                                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-slate-800">Anonymous User</span>
                                            <div className="flex text-yellow-500"><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /></div>
                                        </div>
                                        <p className="text-slate-600">"Incredible session. I felt heard and got practical steps to move forward."</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="space-y-8">
                        <Card className="bg-slate-900 text-white rounded-[3rem] p-8 md:p-10 sticky top-24">
                            <h2 className="text-2xl font-bold mb-8">Book a Session</h2>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Day</p>
                                    <div className="flex flex-wrap gap-3">
                                        {professional.availability.map(avail => (
                                            <button
                                                key={avail.day}
                                                onClick={() => { setSelectedDay(avail.day); setSelectedSlot(''); }}
                                                className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all ${selectedDay === avail.day ? 'bg-white text-slate-900 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                            >
                                                {avail.day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedDay && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Slot</p>
                                        <div className="flex flex-wrap gap-3">
                                            {professional.availability.find(a => a.day === selectedDay).slots.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all ${selectedSlot === slot ? 'bg-purple-500 text-white shadow-xl shadow-purple-500/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <div className="pt-8 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="text-slate-400 text-sm">Consultation Fee</div>
                                        <div className="text-2xl font-bold font-mono">₹ 499</div>
                                    </div>
                                    <Button
                                        onClick={handleBook}
                                        className="w-full py-5 rounded-2xl bg-white text-slate-900 font-extrabold text-lg hover:bg-slate-100 disabled:opacity-50"
                                        disabled={!selectedSlot}
                                    >
                                        Confirm Booking
                                    </Button>
                                    <p className="text-[10px] text-center text-slate-500 mt-4 uppercase font-bold tracking-widest">Secure 128-bit Encryption</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>

            {/* Success Modal */}
            <AnimatePresence>
                {bookingSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] p-12 text-center max-w-sm shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">Session Booked!</h3>
                            <p className="text-slate-600 mb-8">Your appointment is confirmed for {selectedDay} at {selectedSlot}.</p>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Redirecting to home...</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfessionalProfile;
