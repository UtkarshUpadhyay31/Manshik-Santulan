import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card } from '../UI';
import { ArrowLeft, Trophy, Scale, Brain, Heart, Sparkles } from 'lucide-react';
import api from '../../services/api';
import confetti from 'canvas-confetti';

// Thought database with emotional weights
const THOUGHTS = {
    positive: [
        { text: "I can improve with effort", weight: 3 },
        { text: "Mistakes help me grow", weight: 4 },
        { text: "This is temporary", weight: 3 },
        { text: "I am learning every day", weight: 4 },
        { text: "I deserve kindness", weight: 5 },
        { text: "Progress, not perfection", weight: 3 },
        { text: "I am resilient", weight: 4 },
        { text: "Small steps matter", weight: 3 },
        { text: "I trust my journey", weight: 5 },
        { text: "I am capable", weight: 4 }
    ],
    negative: [
        { text: "I always fail", weight: -4 },
        { text: "Nothing will work", weight: -5 },
        { text: "I'm not good enough", weight: -4 },
        { text: "Everyone judges me", weight: -3 },
        { text: "I can't do this", weight: -4 },
        { text: "It's hopeless", weight: -5 },
        { text: "I'm a burden", weight: -4 },
        { text: "I'll never improve", weight: -3 },
        { text: "Nobody cares", weight: -4 },
        { text: "I'm worthless", weight: -5 }
    ],
    neutral: [
        { text: "It's raining today", weight: 0 },
        { text: "The meeting is at 5", weight: 0 },
        { text: "I need groceries", weight: 0 },
        { text: "The sky is blue", weight: 0 },
        { text: "Traffic was heavy", weight: 0 },
        { text: "I had tea this morning", weight: 0 },
        { text: "The clock shows 3pm", weight: 0 },
        { text: "My phone is charging", weight: 0 }
    ]
};

const EmotionBalanceGame = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90);
    const [score, setScore] = useState(0);
    const [balance, setBalance] = useState(0); // -100 to +100
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [currentThought, setCurrentThought] = useState(null);
    const [placedThoughts, setPlacedThoughts] = useState({ left: [], right: [] });
    const [perfectBalanceTime, setPerfectBalanceTime] = useState(0);
    const [stabilityPercentage, setStabilityPercentage] = useState(100);
    const [totalThoughts, setTotalThoughts] = useState(0);
    const [correctPlacements, setCorrectPlacements] = useState(0);

    const BALANCE_TOLERANCE = level === 1 ? 40 : level === 2 ? 30 : 20;
    const SPAWN_RATE = level === 1 ? 4000 : level === 2 ? 3000 : 2500;

    // Timer effect
    useEffect(() => {
        let interval;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            endGame();
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);

    // Perfect balance bonus tracker
    useEffect(() => {
        let interval;
        if (isPlaying && Math.abs(balance) <= 5) {
            interval = setInterval(() => {
                setPerfectBalanceTime(prev => {
                    const newTime = prev + 1;
                    if (newTime >= 10 && newTime % 10 === 0) {
                        setScore(s => s + 10);
                    }
                    return newTime;
                });
            }, 1000);
        } else {
            setPerfectBalanceTime(0);
        }
        return () => clearInterval(interval);
    }, [isPlaying, balance]);

    // Spawn thoughts
    useEffect(() => {
        let timeout;
        if (isPlaying && !currentThought) {
            timeout = setTimeout(() => {
                spawnThought();
            }, SPAWN_RATE);
        }
        return () => clearTimeout(timeout);
    }, [isPlaying, currentThought, level]);

    // Check game over condition
    useEffect(() => {
        if (isPlaying && Math.abs(balance) > BALANCE_TOLERANCE) {
            endGame();
        }
    }, [balance, isPlaying]);

    const spawnThought = () => {
        let thoughtPool = [];

        if (level === 1) {
            // Clear positive/negative
            thoughtPool = [...THOUGHTS.positive, ...THOUGHTS.negative];
        } else if (level === 2) {
            // Add some neutral
            thoughtPool = [...THOUGHTS.positive, ...THOUGHTS.negative, ...THOUGHTS.neutral.slice(0, 3)];
        } else {
            // All types
            thoughtPool = [...THOUGHTS.positive, ...THOUGHTS.negative, ...THOUGHTS.neutral];
        }

        const randomThought = thoughtPool[Math.floor(Math.random() * thoughtPool.length)];
        setCurrentThought(randomThought);
    };

    const handleDrop = (side) => {
        if (!currentThought) return;

        const isCorrect = (
            (side === 'left' && currentThought.weight < 0) ||
            (side === 'right' && currentThought.weight > 0) ||
            (currentThought.weight === 0)
        );

        setTotalThoughts(prev => prev + 1);

        if (isCorrect) {
            setCorrectPlacements(prev => prev + 1);
            setScore(prev => prev + (Math.abs(currentThought.weight) * 2));
        } else {
            setScore(prev => Math.max(0, prev - 5));
        }

        // Update balance
        setBalance(prev => {
            const newBalance = prev + currentThought.weight;
            return Math.max(-100, Math.min(100, newBalance));
        });

        // Track placement
        setPlacedThoughts(prev => ({
            ...prev,
            [side]: [...prev[side], currentThought]
        }));

        setCurrentThought(null);
    };

    const startGame = () => {
        setIsPlaying(true);
        setTimeLeft(90);
        setScore(0);
        setBalance(0);
        setLevel(1);
        setGameOver(false);
        setPlacedThoughts({ left: [], right: [] });
        setPerfectBalanceTime(0);
        setTotalThoughts(0);
        setCorrectPlacements(0);
        setStabilityPercentage(100);
        setCurrentThought(null);
    };

    const endGame = async () => {
        setIsPlaying(false);
        setGameOver(true);
        setCurrentThought(null);

        const finalStability = totalThoughts > 0 ? (correctPlacements / totalThoughts) * 100 : 0;
        setStabilityPercentage(finalStability);

        if (score > 50) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#a78bfa', '#c084fc', '#e9d5ff']
            });
        }

        try {
            await api.post('/games/emotion-balance/score', {
                score,
                stability: finalStability,
                level,
                metadata: {
                    totalThoughts,
                    correctPlacements,
                    perfectBalanceTime
                }
            });
        } catch (error) {
            console.error('Failed to save score:', error);
        }
    };

    const getTiltRotation = () => {
        return (balance / BALANCE_TOLERANCE) * 15; // Max 15 degrees tilt
    };

    const getBalanceColor = () => {
        const absBalance = Math.abs(balance);
        if (absBalance <= 5) return 'text-green-500';
        if (absBalance <= 15) return 'text-yellow-500';
        if (absBalance <= 25) return 'text-orange-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 py-12 select-none">
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => navigate('/games')} className="gap-2">
                        <ArrowLeft size={20} /> Exit
                    </Button>
                    <div className="flex gap-8">
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</p>
                            <p className="text-3xl font-bold text-purple-600">{score}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</p>
                            <p className={`text-3xl font-bold ${timeLeft < 20 ? 'text-red-500' : 'text-slate-700'}`}>{timeLeft}s</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Level</p>
                            <p className="text-3xl font-bold text-blue-600">{level}</p>
                        </div>
                    </div>
                </div>

                {/* Game Area */}
                <Card className="relative min-h-[70vh] bg-white/80 backdrop-blur-sm border-2 border-purple-100 shadow-xl rounded-[3rem] overflow-hidden">
                    {!isPlaying && !gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md z-50 p-8">
                            <div className="w-24 h-24 bg-purple-100 rounded-[2rem] flex items-center justify-center mb-8">
                                <Scale size={48} className="text-purple-600" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Emotion Balance Puzzle</h2>
                            <p className="text-slate-600 mb-10 text-center max-w-md leading-relaxed">
                                Drag emotional thoughts onto the balance scale. Keep it stable by placing negative thoughts on the left and positive thoughts on the right.
                                <span className="block mt-3 font-bold text-purple-600">Maintain equilibrium for 90 seconds!</span>
                            </p>
                            <Button
                                onClick={startGame}
                                size="lg"
                                className="rounded-full px-16 py-8 text-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-purple-500/50 transition-all"
                            >
                                <Brain size={24} className="mr-3" /> Begin Training
                            </Button>
                        </div>
                    )}

                    {gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-lg z-50 p-8">
                            <Trophy size={64} className="text-purple-500 mb-6" />
                            <h2 className="text-4xl font-black text-slate-900 mb-2">Emotional Stability Result</h2>
                            <p className="text-xl text-slate-500 mb-10">Final Score: <strong className="text-purple-600 text-3xl">{score}</strong></p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-10">
                                <div className="bg-purple-50 p-6 rounded-3xl text-center">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Stability</p>
                                    <p className="text-3xl font-bold text-purple-600">{Math.round(stabilityPercentage)}%</p>
                                </div>
                                <div className="bg-pink-50 p-6 rounded-3xl text-center">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Level</p>
                                    <p className="text-3xl font-bold text-pink-600">{level}</p>
                                </div>
                            </div>

                            <p className="text-lg text-slate-600 mb-8 italic">
                                "You are learning to balance your thoughts 🌿"
                            </p>

                            <div className="flex gap-4">
                                <Button onClick={() => navigate('/games')} variant="ghost" className="px-10 rounded-2xl">
                                    Close
                                </Button>
                                <Button
                                    onClick={startGame}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl shadow-xl"
                                >
                                    Play Again
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Active Game */}
                    {isPlaying && (
                        <div className="p-8">
                            {/* Current Thought Card */}
                            <div className="flex justify-center mb-12">
                                <AnimatePresence mode="wait">
                                    {currentThought && (
                                        <motion.div
                                            key={currentThought.text}
                                            initial={{ opacity: 0, y: -50, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="bg-white px-8 py-6 rounded-3xl shadow-xl border-2 border-purple-200 cursor-move max-w-md"
                                            drag
                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                            dragElastic={0.1}
                                            onDragEnd={(e, info) => {
                                                if (info.offset.x < -100) {
                                                    handleDrop('left');
                                                } else if (info.offset.x > 100) {
                                                    handleDrop('right');
                                                }
                                            }}
                                        >
                                            <p className="text-lg font-semibold text-slate-800 text-center">{currentThought.text}</p>
                                            <p className="text-xs text-slate-400 text-center mt-2">Drag left or right</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Balance Scale */}
                            <div className="relative flex justify-center items-center mb-8">
                                <motion.div
                                    animate={{ rotate: getTiltRotation() }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    className="relative"
                                >
                                    {/* Scale Beam */}
                                    <div className="w-[70vw] max-w-[24rem] min-w-[15rem] h-3 sm:h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full shadow-lg relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-slate-800 rounded-full" />
                                    </div>

                                    {/* Left Plate */}
                                    <div className="absolute -left-6 sm:-left-4 -top-8 sm:-top-16 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-br from-red-100 to-red-50 rounded-full border-2 sm:border-4 border-red-300 shadow-xl flex items-center justify-center">
                                        <Heart className="text-red-500 w-6 h-6 sm:w-12 sm:h-12" />
                                    </div>

                                    {/* Right Plate */}
                                    <div className="absolute -right-6 sm:-right-4 -top-8 sm:-top-16 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-br from-green-100 to-green-50 rounded-full border-2 sm:border-4 border-green-300 shadow-xl flex items-center justify-center">
                                        <Sparkles className="text-green-500 w-6 h-6 sm:w-12 sm:h-12" />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Balance Indicator */}
                            <div className="text-center mb-8">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Balance</p>
                                <p className={`text-5xl font-black ${getBalanceColor()}`}>{Math.abs(balance)}</p>
                                <div className="w-full max-w-md mx-auto mt-4 h-3 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${balance < 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                        animate={{ width: `${(Math.abs(balance) / BALANCE_TOLERANCE) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Perfect Balance Bonus */}
                            <AnimatePresence>
                                {perfectBalanceTime >= 5 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 2 }}
                                        className="fixed bottom-10 right-10 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-lg"
                                    >
                                        Perfect Balance! +10
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default EmotionBalanceGame;
