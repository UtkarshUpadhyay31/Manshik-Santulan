import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, UserCheck, ArrowLeft } from 'lucide-react';
import { Button, Container, Card, Input } from '../components/UI';
import api from '../services/api';

const TherapistList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [therapyType, setTherapyType] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, [therapyType]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/professionals/doctors`, { params: { therapyType } });
            console.log('Doctors fetched:', res.data);
            setDoctors(res.data.doctors || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            if (error.response) console.error('Response data:', error.response.data);
        } finally {
            setLoading(false);
        }
    };

    const types = ['Anxiety', 'Depression', 'Stress', 'Sleep Disorders'];

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-20 sm:pt-24 pb-12 sm:pb-16">
            <Container>
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Consult a Therapist</h1>
                </div>

                {/* Disclaimer */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-700 font-medium">
                    <UserCheck size={20} />
                    <p className="text-sm">This is professional medical support. Please share accurate information.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6 overflow-x-auto pb-4 no-scrollbar">
                    <button
                        onClick={() => setTherapyType('')}
                        className={`px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${!therapyType ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-100'}`}
                    >
                        All Specialists
                    </button>
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => setTherapyType(t)}
                            className={`px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${therapyType === t ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-100'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Doctor Cards */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                        <p className="text-xl text-slate-500">No doctors available for this type of therapy.</p>
                        <Button variant="ghost" className="mt-4" onClick={() => setTherapyType('')}>
                            See All Specialists
                        </Button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <motion.div
                                key={doctor._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card className="h-full bg-white border border-slate-100 shadow-lg shadow-slate-200/40 rounded-3xl p-5 sm:p-6 flex flex-col">
                                    <div className="flex flex-col min-[375px]:flex-row items-center min-[375px]:items-start gap-3 sm:gap-6 mb-6 text-center min-[375px]:text-left">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={doctor.photo}
                                                alt={doctor.name}
                                                className="w-16 h-16 min-[375px]:w-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 sm:border-4 border-white shadow-md"
                                            />
                                            {doctor.verified && (
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 sm:border-4 border-white text-white">
                                                    <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{doctor.name}</h3>
                                            <p className="text-blue-600 font-semibold text-xs sm:text-sm">{doctor.qualification}</p>
                                            <p className="text-slate-500 text-[10px] sm:text-xs font-medium uppercase mt-1 tracking-wider">{doctor.specialization}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                                            <span className="text-slate-500 font-medium">Experience</span>
                                            <span className="text-slate-900 font-bold">{doctor.experience} Years</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                                            <span className="text-slate-500 font-medium">Rating</span>
                                            <div className="flex items-center gap-1 text-yellow-500 fill-yellow-500">
                                                <Star size={14} />
                                                <span className="text-slate-900 font-bold">{doctor.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {doctor.therapyType && doctor.therapyType.map(type => (
                                                <span key={type} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">{type}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link to={`/professional/${doctor._id}?type=doctor`} className="flex-1">
                                            <Button className="w-full rounded-2xl py-4 bg-slate-900 text-white font-bold">
                                                Start Session
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default TherapistList;
