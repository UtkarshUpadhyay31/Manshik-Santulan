import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wind, ShieldAlert, Phone, MessageSquare, Brain } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './UI';

const CrisisBreathing = ({ onComplete }) => {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(4);
    const [phase, setPhase] = useState('Inhale');
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isCompleted) return;

        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        if (phase === 'Inhale') { setPhase('Hold'); return 4; }
                        if (phase === 'Hold') { setPhase('Exhale'); return 4; }
                        if (phase === 'Exhale') { setPhase('Hold '); return 4; }
                        if (phase === 'Hold ') {
                            setPhase('Inhale');
                            return 4;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [phase, isCompleted]);

    // Handle auto-completion after a few cycles or user manually skips
    const handleFinish = () => {
        try {
            setIsCompleted(true);
            if (onComplete) onComplete();
        } catch (error) {
            console.error("Error in handleFinish:", error);
        }
    };

    const handleNavigate = (path) => {
        try {
            navigate(path);
        } catch (error) {
            console.error(`Navigation error to ${path}:`, error);
        }
    };

    if (isCompleted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-white border border-slate-200 rounded-[2.5rem] text-center shadow-sm"
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">You're doing great.</h2>
                <p className="text-slate-600 mb-10">Choose how you'd like to proceed:</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* AI Chat Link - Logic to open dashboard for AI chat */}
                    <div
                        onClick={() => handleNavigate('/dashboard')}
                        className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 cursor-pointer hover:border-purple-500 transition-all"
                    >
                        <Brain className="text-purple-500" />
                        <span className="font-bold text-slate-900">Talk to AI</span>
                    </div>
                    <div
                        onClick={() => handleNavigate('/mentors')}
                        className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all flex flex-col items-center gap-3 cursor-pointer"
                    >
                        <ShieldAlert className="text-blue-500" />
                        <span className="font-bold text-slate-900">Mentor</span>
                    </div>
                    <div
                        onClick={() => handleNavigate('/therapists')}
                        className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-pink-500 transition-all flex flex-col items-center gap-3 cursor-pointer"
                    >
                        <ShieldAlert className="text-pink-500" />
                        <span className="font-bold text-slate-900">Therapist</span>
                    </div>
                    <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center gap-3">
                        <ShieldAlert className="text-red-500" />
                        <span className="font-bold text-red-900">Emergency</span>
                        <div className="flex gap-2">
                            <a href="tel:112" className="p-2 bg-red-100 text-red-600 rounded-lg"><Phone size={16} /></a>
                            <a href="sms:112" className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MessageSquare size={16} /></a>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] text-center"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Help is Here.</h2>
            <p className="text-slate-600 mb-6">Let's start by calming your breath. Focus on the circle below.</p>

            <div className="flex flex-col items-center py-10">
                <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : 1.5,
                            opacity: phase.includes('Hold') ? 0.8 : 1
                        }}
                        transition={{ duration: timer, ease: "linear" }}
                        className="absolute inset-0 bg-red-100 rounded-full"
                    />
                    <div className="relative z-10 text-4xl font-bold text-red-600">{timer}</div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-2 uppercase tracking-widest">{phase}</div>
                <p className="text-slate-500 mb-10">Box Breathing (4-4-4-4)</p>

                <Button
                    onClick={handleFinish}
                    variant="secondary"
                    className="rounded-full px-8"
                >
                    I'm ready to talk
                </Button>
            </div>
        </motion.div>
    );
};

export default CrisisBreathing;
