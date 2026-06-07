
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card } from '../UI';
import { ArrowLeft, Play, RotateCcw, Trophy, Smile, Frown } from 'lucide-react';
import api from '../../services/api';
import confetti from 'canvas-confetti';

const POSITIVE_WORDS = ['Joy', 'Peace', 'Love', 'Calm', 'Hope', 'Kind', 'Heal', 'Smile', 'Glow', 'Relax'];
const NEGATIVE_WORDS = ['Stress', 'Fear', 'Anger', 'Sad', 'Hate', 'Pain', 'Gloom', 'Worry', 'Doubt', 'Tired'];

const MoodCatcherGame = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [items, setItems] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const gameAreaRef = useRef(null);
    const [basketPos, setBasketPos] = useState(50); // percentage

    useEffect(() => {
        let interval;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            endGame();
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);

    useEffect(() => {
        let spawnInterval;
        if (isPlaying && timeLeft > 0) {
            spawnInterval = setInterval(() => {
                spawnItem();
            }, 1000);
        }
        return () => clearInterval(spawnInterval);
    }, [isPlaying, timeLeft]);

    useEffect(() => {
        if (isPlaying) {
            const handleMove = (e) => {
                if (!gameAreaRef.current) return;
                const { left, width } = gameAreaRef.current.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                let pos = ((clientX - left) / width) * 100;
                pos = Math.max(5, Math.min(95, pos));
                setBasketPos(pos);
            };

            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove, { passive: true });
            window.addEventListener('touchstart', handleMove, { passive: true });
            return () => {
                window.removeEventListener('mousemove', handleMove);
                window.removeEventListener('touchmove', handleMove);
                window.removeEventListener('touchstart', handleMove);
            };
        }
    }, [isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            const gameLoop = setInterval(() => {
                setItems((prevItems) => {
                    return prevItems
                        .map((item) => ({ ...item, y: item.y + item.speed }))
                        .filter((item) => {
                            // Check collision
                            if (item.y > 85 && item.y < 95 && Math.abs(item.x - basketPos) < 10) {
                                if (item.isPositive) {
                                    setScore((s) => s + 10);
                                } else {
                                    setScore((s) => Math.max(0, s - 5));
                                }
                                return false;
                            }
                            // Remove if out of bounds
                            return item.y < 100;
                        });
                });
            }, 50);
            return () => clearInterval(gameLoop);
        }
    }, [isPlaying, basketPos]);

    const spawnItem = () => {
        const isPositive = Math.random() > 0.3;
        const text = isPositive
            ? POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)]
            : NEGATIVE_WORDS[Math.floor(Math.random() * NEGATIVE_WORDS.length)];

        const newItem = {
            id: Date.now() + Math.random(),
            x: Math.random() * 90 + 5,
            y: 0,
            text,
            isPositive,
            speed: Math.random() * 1.2 + 1.2
        };
        setItems((prev) => [...prev, newItem]);
    };

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTimeLeft(60);
        setItems([]);
        setGameOver(false);
    };

    const endGame = async () => {
        setIsPlaying(false);
        setGameOver(true);
        setItems([]);

        if (score > 50) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        try {
            await api.post('/games/score', {
                gameId: 'mood',
                score: score,
                duration: 60
            });
        } catch (error) {
            console.error('Failed to save score:', error);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 py-12 select-none overflow-hidden">
            <Container>
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => navigate('/games')} className="gap-2">
                        <ArrowLeft size={20} /> Exit
                    </Button>
                    <div className="flex gap-8">
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</p>
                            <p className="text-3xl font-bold text-green-600">{score}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</p>
                            <p className={`text-3xl font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700'}`}>{timeLeft}</p>
                        </div>
                    </div>
                </div>

                <Card className="relative h-[70vh] bg-white border-2 border-green-100 shadow-inner rounded-[3rem] overflow-hidden" ref={gameAreaRef}>
                    {!isPlaying && !gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
                            <Smile size={64} className="text-green-500 mb-4" />
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Mood Catcher</h2>
                            <p className="text-slate-500 mb-8 text-center max-w-md font-medium">
                                Catch the positive words to boost your mood. <br />
                                Avoid the negative ones! Move your mouse or touch to control the catcher.
                            </p>
                            <Button onClick={startGame} size="lg" className="rounded-full px-12 py-6 text-xl bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-200">
                                <Play size={24} className="mr-2" /> Start Catching
                            </Button>
                        </div>
                    )}

                    {gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-50">
                            <Trophy size={64} className="text-green-500 mb-4" />
                            <h2 className="text-4xl font-bold text-slate-900 mb-2">Well Done!</h2>
                            <p className="text-xl text-slate-500 mb-8">You caught <strong className="text-green-600">{score}</strong> positive vibes!</p>
                            <div className="flex gap-4">
                                <Button onClick={() => navigate('/games')} variant="secondary">Exit</Button>
                                <Button onClick={startGame} variant="primary" className="bg-green-600 hover:bg-green-700">
                                    <RotateCcw size={20} className="mr-2" /> Play Again
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Basket / Catcher */}
                    <motion.div
                        className="absolute bottom-10 h-16 w-32 bg-green-600 rounded-b-3xl rounded-t-lg shadow-lg flex items-center justify-center"
                        style={{ left: `${basketPos}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="absolute -top-4 w-full h-4 bg-green-500/50 rounded-t-full" />
                        <div className="text-white font-bold text-sm">CATCHER</div>
                    </motion.div>

                    {/* Falling Items */}
                    <AnimatePresence>
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`absolute px-4 py-2 rounded-2xl font-bold shadow-sm whitespace-nowrap transition-colors ${item.isPositive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                                    }`}
                                style={{
                                    left: `${item.x}%`,
                                    top: `${item.y}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {item.isPositive ? <Smile size={16} /> : <Frown size={16} />}
                                    {item.text}
                                </div>
                            </div>
                        ))}
                    </AnimatePresence>
                </Card>
            </Container>
        </div>
    );
};

export default MoodCatcherGame;
