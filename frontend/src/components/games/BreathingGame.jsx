
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card } from '../UI';
import { ArrowLeft, Play, Square, Volume2, VolumeX, Wind } from 'lucide-react';
import api from '../../services/api';
const BreathingGame = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [completed, setCompleted] = useState(false);

    const timerRef = useRef(null);
    const cycleTimerRef = useRef(null);

    // Breathing Cycle: Inhale 4s, Hold 7s, Exhale 8s (4-7-8 Technique)
    const CYCLE_DURATION = 19000;

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            if (timerRef.current) return;
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (timeLeft === 0 && isPlaying) {
                endSession();
            }
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isPlaying, timeLeft]);

    useEffect(() => {
        if (isPlaying && !completed) {
            runBreathingCycle();
        } else {
            setPhase('ready');
            if (cycleTimerRef.current) {
                clearTimeout(cycleTimerRef.current);
                cycleTimerRef.current = null;
            }
        }
        return () => {
            if (cycleTimerRef.current) {
                clearTimeout(cycleTimerRef.current);
                cycleTimerRef.current = null;
            }
        };
    }, [isPlaying, completed]);


    const runBreathingCycle = async () => {
        if (!isPlaying) return;

        setPhase('inhale');
        cycleTimerRef.current = setTimeout(async () => {
            if (!isPlaying) return;
            setPhase('hold');
            cycleTimerRef.current = setTimeout(async () => {
                if (!isPlaying) return;
                setPhase('exhale');
                cycleTimerRef.current = setTimeout(() => {
                    if (isPlaying) runBreathingCycle();
                }, 8000);
            }, 7000);
        }, 4000);
    };

    const startSession = () => {
        setIsPlaying(true);
        setCompleted(false);
        setTimeLeft(120);
    };

    const stopSession = () => {
        setIsPlaying(false);
        setPhase('ready');
    };

    const endSession = async () => {
        setIsPlaying(false);
        setCompleted(true);

        // Save session
        try {
            await api.post('/games/score', {
                gameId: 'breathing',
                score: 100, // Fixed score for completing session
                duration: 120
            });
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    };

    const getInstruction = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In...';
            case 'hold': return 'Hold...';
            case 'exhale': return 'Breathe Out...';
            default: return 'Ready?';
        }
    };

    const getCircleScale = () => {
        switch (phase) {
            case 'inhale': return 1.5;
            case 'hold': return 1.5;
            case 'exhale': return 1;
            default: return 1;
        }
    };

    const getCircleColor = () => {
        switch (phase) {
            case 'inhale': return 'bg-cyan-200';
            case 'hold': return 'bg-cyan-300';
            case 'exhale': return 'bg-cyan-100';
            default: return 'bg-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-cyan-50/50 py-12 select-none">
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => navigate('/games')} className="gap-2">
                        <ArrowLeft size={20} /> Exit
                    </Button>
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-3 rounded-full hover:bg-white/50 transition-colors hidden" // Hidden for now as sound file not implemented
                    >
                        {soundEnabled ? <Volume2 size={24} className="text-cyan-600" /> : <VolumeX size={24} className="text-slate-400" />}
                    </button>
                    <div className="flex items-center gap-2 font-mono text-xl text-cyan-800 font-bold bg-white/50 px-4 py-2 rounded-xl">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                {/* Animation Area */}
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="relative flex items-center justify-center w-[70vw] h-[70vw] max-w-[20rem] max-h-[20rem]">
                        {/* Outer Glow */}
                        <motion.div
                            animate={{
                                scale: getCircleScale() * 1.2,
                                opacity: phase === 'inhale' ? 0.3 : 0.1
                            }}
                            transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0.5 }}
                            className="absolute rounded-full bg-cyan-400 blur-2xl w-[60%] h-[60%]"
                        />

                        {/* Breathing Circle */}
                        <motion.div
                            animate={{ scale: getCircleScale() }}
                            transition={{
                                duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0,
                                ease: "easeInOut"
                            }}
                            className={`relative z-10 w-[60%] h-[60%] rounded-full ${getCircleColor()} flex items-center justify-center shadow-lg transition-colors duration-1000`}
                        >
                            <span className="text-lg sm:text-2xl font-bold text-cyan-900 tracking-widest">{getInstruction()}</span>
                        </motion.div>

                        {/* Ripples */}
                        {isPlaying && (
                            <motion.div
                                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute border border-cyan-300 rounded-full w-[60%] h-[60%]"
                            />
                        )}
                    </div>

                    {!isPlaying && !completed && (
                        <div className="mt-12 text-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">4-7-8 Breathing</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds.
                                This technique helps reduce anxiety and helps you sleep.
                            </p>
                            <Button onClick={startSession} size="lg" className="rounded-full px-12 py-6 text-lg bg-cyan-600 hover:bg-cyan-700 shadow-xl shadow-cyan-200 text-white">
                                <Play size={24} className="mr-2" /> Start Session
                            </Button>
                        </div>
                    )}

                    {isPlaying && (
                        <div className="mt-12">
                            <Button onClick={stopSession} variant="secondary" size="lg" className="rounded-full px-12 py-6 text-lg">
                                <Square size={20} className="mr-2 fill-current" /> Stop
                            </Button>
                        </div>
                    )}

                    {completed && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 text-center"
                        >
                            <Wind size={48} className="text-cyan-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Session Complete</h2>
                            <p className="text-slate-500 mb-8">You've taken a moment for yourself. Well done.</p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={() => navigate('/games')} variant="ghost">
                                    Done
                                </Button>
                                <Button onClick={startSession} variant="primary" className="bg-cyan-600 hover:bg-cyan-700">
                                    Repeat
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default BreathingGame;
