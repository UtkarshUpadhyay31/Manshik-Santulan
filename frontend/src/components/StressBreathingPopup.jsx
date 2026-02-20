import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind } from 'lucide-react';
import { Button } from './UI';

const StressBreathingPopup = ({ isOpen, onClose, message }) => {
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
    const [timer, setTimer] = useState(4);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    // Switch phase
                    if (phase === 'Inhale') { setPhase('Hold'); return 4; }
                    if (phase === 'Hold') { setPhase('Exhale'); return 4; }
                    if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
                }
                return prev - 1;
            });

            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isOpen, phase]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>

                    <div className="mb-8">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Wind className="text-purple-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Pause & Breathe</h3>
                        <p className="text-slate-600 text-sm leading-relaxed px-4">
                            {message || "I notice your stress level is high. Let's pause for 60 seconds and breathe together."}
                        </p>
                    </div>

                    <div className="relative flex flex-col items-center justify-center py-8">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : 1.5,
                                    opacity: phase === 'Hold' ? 0.6 : 0.8
                                }}
                                transition={{ duration: timer, ease: "linear" }}
                                className="absolute inset-0 bg-purple-100 rounded-full"
                            />
                            <div className="relative z-10 text-4xl font-black text-purple-600">
                                {timer}
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{phase}</p>
                            <p className="text-sm font-bold text-slate-500">{secondsLeft}s remaining</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button
                            variant="secondary"
                            className="w-full rounded-2xl py-4"
                            onClick={onClose}
                        >
                            Done for now
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StressBreathingPopup;
