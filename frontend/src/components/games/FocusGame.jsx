
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card } from '../UI';
import { ArrowLeft, Play, RotateCcw, Trophy, Target, Zap } from 'lucide-react';
import api from '../../services/api';
import confetti from 'canvas-confetti';

const FocusGame = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [targets, setTargets] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [misses, setMisses] = useState(0);
    const [combo, setCombo] = useState(0);
    const gameAreaRef = useRef(null);
    const timeoutsRef = useRef(new Set());

    // Game Constants
    const SPAWN_RATE_INITIAL = 1200;
    const SPAWN_RATE_MIN = 600;
    const TARGET_LIFETIME = 2500;

    const clearAllTimeouts = useCallback(() => {
        timeoutsRef.current.forEach(t => clearTimeout(t));
        timeoutsRef.current.clear();
    }, []);

    useEffect(() => {
        let interval;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            endGame();
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);

    useEffect(() => {
        let spawnTimeout;
        const spawnLoop = () => {
            if (!isPlaying) return;

            spawnTarget();

            // Scaled difficulty: faster spawning over time
            const progress = (60 - timeLeft) / 60;
            const currentRate = SPAWN_RATE_INITIAL - (progress * (SPAWN_RATE_INITIAL - SPAWN_RATE_MIN));

            spawnTimeout = setTimeout(spawnLoop, currentRate);
            timeoutsRef.current.add(spawnTimeout);
        };

        if (isPlaying) {
            spawnLoop();
        }

        return () => {
            clearTimeout(spawnTimeout);
            clearAllTimeouts();
        };
    }, [isPlaying]);

    const spawnTarget = () => {
        if (!gameAreaRef.current) return;

        const container = gameAreaRef.current.getBoundingClientRect();
        const size = Math.random() * (90 - 60) + 60; // 60-90px (Larger is easier)
        const x = Math.random() * (container.width - size - 40) + 20;
        const y = Math.random() * (container.height - size - 40) + 20;

        const id = Math.random().toString(36).substr(2, 9);
        const newTarget = { id, x, y, size };

        setTargets((prev) => [...prev, newTarget]);

        const expiryTimeout = setTimeout(() => {
            setTargets((currentTargets) => {
                const stillExists = currentTargets.find(t => t.id === id);
                if (stillExists) {
                    setCombo(0); // Reset combo on miss/expire
                    return currentTargets.filter(t => t.id !== id);
                }
                return currentTargets;
            });
        }, TARGET_LIFETIME);

        timeoutsRef.current.add(expiryTimeout);
    };

    const handleTap = (e, id) => {
        e.stopPropagation(); // Prevent trigger on game area
        if (!isPlaying) return;

        setScore((prev) => prev + 1 + Math.floor(combo / 5));
        setCombo((prev) => prev + 1);
        setTargets((prev) => prev.filter((t) => t.id !== id));

        // Visual feedback for combo
        if ((combo + 1) % 10 === 0) {
            // Flash effect or something?
        }
    };

    const handleMiss = () => {
        if (!isPlaying) return;
        setMisses(prev => prev + 1);
        setCombo(0);
    };

    const startGame = () => {
        clearAllTimeouts();
        setIsPlaying(true);
        setScore(0);
        setMisses(0);
        setCombo(0);
        setTimeLeft(60);
        setTargets([]);
        setGameOver(false);
    };

    const endGame = async () => {
        setIsPlaying(false);
        setGameOver(true);
        setTargets([]);
        clearAllTimeouts();

        // Visual reward
        if (score > 20) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f59e0b', '#fbbf24', '#ffffff']
            });
        }

        // Save score
        try {
            await api.post('/games/score', {
                gameId: 'focus',
                score: score,
                duration: 60,
                metadata: { misses, maxCombo: combo }
            });
        } catch (error) {
            console.error('Failed to save score:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 select-none overflow-hidden">
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => navigate('/games')} className="gap-2 text-slate-500 hover:text-slate-700">
                        <ArrowLeft size={20} /> Exit
                    </Button>

                    <div className="flex items-center gap-3 sm:gap-10">
                        <div className="text-center group">
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-1">Current Score</p>
                            <div className="flex items-center gap-2 justify-center">
                                <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${combo > 5 ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`} />
                                <span className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">{score}</span>
                            </div>
                        </div>

                        <div className="w-px h-10 bg-slate-200" />

                        <div className="text-center">
                            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-1">Time Remaining</p>
                            <span className={`text-2xl sm:text-4xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                                {timeLeft}s
                            </span>
                        </div>
                    </div>

                    <div className="hidden lg:block w-32" /> {/* Layout balancer */}
                </div>

                {/* Game Area */}
                <Card
                    className={`relative h-[65vh] overflow-hidden bg-white border-4 transition-colors duration-300 ${isPlaying ? 'border-slate-100 shadow-2xl' : 'border-slate-200 shadow-xl'} rounded-[3rem] cursor-crosshair`}
                    ref={gameAreaRef}
                    onClick={handleMiss}
                >
                    {!isPlaying && !gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md z-50 p-8">
                            <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-amber-100">
                                <Target size={48} className="text-amber-500" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Neural Focus</h2>
                            <p className="text-slate-500 mb-10 text-center max-w-sm font-medium leading-relaxed">
                                Accelerate your cognitive processing. Tap the targets as they appear.
                                <span className="block mt-2 font-bold text-amber-600">Higher combos = Bonus Points!</span>
                            </p>
                            <Button
                                onClick={(e) => { e.stopPropagation(); startGame(); }}
                                size="lg"
                                className="rounded-[2rem] px-16 py-8 text-xl bg-slate-900 text-white hover:bg-amber-500 shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
                            >
                                <Play size={24} className="mr-3 group-hover:scale-125 transition-transform" /> Begin Challenge
                            </Button>
                        </div>
                    )}

                    {gameOver && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-lg z-50 p-8"
                            >
                                <div className="w-20 h-20 bg-amber-100 rounded-[2rem] flex items-center justify-center mb-6">
                                    <Trophy size={40} className="text-amber-600" />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Challenge Completed</h2>
                                <p className="text-slate-500 mb-10 text-lg">Achieved a score of <strong className="text-amber-600 text-3xl ml-1 font-black">{score}</strong></p>

                                <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-10">
                                    <div className="bg-slate-50 p-4 rounded-3xl text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                                        <p className="text-2xl font-bold text-slate-700">{score + misses > 0 ? Math.round((score / (score + misses)) * 100) : 0}%</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-3xl text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Combo</p>
                                        <p className="text-2xl font-bold text-slate-700">{combo}x</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button onClick={(e) => { e.stopPropagation(); navigate('/games'); }} variant="ghost" className="px-10 rounded-2xl">
                                        Close
                                    </Button>
                                    <Button
                                        onClick={(e) => { e.stopPropagation(); startGame(); }}
                                        className="bg-slate-900 text-white px-12 py-6 rounded-2xl shadow-xl hover:bg-amber-600 transition-all font-bold"
                                    >
                                        <RotateCcw size={20} className="mr-2" /> Start Over
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* Progress Bar (Visual Timer) */}
                    {isPlaying && (
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 z-10">
                            <motion.div
                                className="h-full bg-amber-500"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 60, ease: "linear" }}
                            />
                        </div>
                    )}

                    {/* Active Targets */}
                    <AnimatePresence>
                        {isPlaying && targets.map((target) => (
                            <motion.button
                                key={target.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                style={{
                                    position: 'absolute',
                                    left: target.x,
                                    top: target.y,
                                    width: target.size,
                                    height: target.size,
                                }}
                                onClick={(e) => handleTap(e, target.id)}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md group-hover:bg-amber-400/40 transition-all" />
                                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl flex items-center justify-center border-4 border-white/50 group-active:scale-90 transition-transform">
                                    <div className="w-1/3 h-1/3 rounded-full bg-white/30" />
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>

                    {/* Combo Display */}
                    <AnimatePresence>
                        {isPlaying && combo >= 5 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 2 }}
                                className="absolute bottom-10 right-10 pointer-events-none"
                            >
                                <div className="bg-amber-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-black italic text-2xl tracking-tighter">
                                    {combo} COMBO!
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                {/* Instructions */}
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                            Tap the targets • Avoid missing • Build your streak
                        </p>
                    </motion.div>
                )}
            </Container>
        </div>
    );
};

export default FocusGame;
