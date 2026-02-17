
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card } from '../UI';
import { ArrowLeft, RotateCcw, Trophy, Brain, Zap, Heart, Star, Sun, Moon, Cloud, Music } from 'lucide-react';
import api from '../../services/api';
import confetti from 'canvas-confetti';

const ICONS = [Brain, Zap, Heart, Star, Sun, Moon, Cloud, Music];

const MemoryGame = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const duplicatedIcons = [...ICONS, ...ICONS];
        const shuffled = duplicatedIcons
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({
                id: index,
                icon,
                isFlipped: false,
                isSolved: false
            }));

        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setGameOver(false);
        setIsDisabled(false);
    };

    const handleCardClick = (id) => {
        if (isDisabled || gameOver) return;

        const clickedCard = cards.find(c => c.id === id);
        if (flipped.includes(id) || solved.includes(id)) return;

        setFlipped([...flipped, id]);
        setMoves(moves + 1);

        if (flipped.length === 1) {
            setIsDisabled(true);
            const firstId = flipped[0];
            const secondId = id;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = clickedCard;

            if (firstCard.icon === secondCard.icon) {
                setSolved([...solved, firstId, secondId]);
                setFlipped([]);
                setIsDisabled(false);

                if (solved.length + 2 === cards.length) {
                    endGame(moves + 1);
                }
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setIsDisabled(false);
                }, 1000);
            }
        }
    };

    const endGame = async (finalMoves) => {
        setGameOver(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#a855f7', '#ec4899', '#3b82f6'] // Pastel-ish colors
        });

        // Calculate score: Max 100, deduct based on moves (Ideal moves ~16-20)
        // Simple formula: Math.max(10, 100 - (finalMoves - 16) * 2)
        const score = Math.max(10, 100 - (finalMoves - 16) * 3);

        try {
            await api.post('/games/score', {
                gameId: 'memory',
                score: score,
                metadata: { moves: finalMoves }
            });
        } catch (error) {
            console.error('Failed to save score:', error);
        }
    };

    return (
        <div className="min-h-screen bg-purple-50 py-12 select-none">
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => navigate('/games')} className="gap-2 hover:bg-white/50">
                        <ArrowLeft size={20} /> Exit
                    </Button>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moves</span>
                            <span className="text-3xl font-bold text-purple-600">{moves}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pairs</span>
                            <span className="text-3xl font-bold text-purple-600">{solved.length / 2} / 8</span>
                        </div>
                    </div>
                </div>

                {/* Game Board */}
                <div className="max-w-xl mx-auto">
                    <div className="grid grid-cols-4 gap-4 aspect-square">
                        {cards.map((card) => {
                            const Icon = card.icon;
                            const isFlipped = flipped.includes(card.id) || solved.includes(card.id);

                            return (
                                <motion.div
                                    key={card.id}
                                    className="relative cursor-pointer"
                                    onClick={() => handleCardClick(card.id)}
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={`w-full h-full rounded-2xl transition-all duration-300 transform style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                        <div className={`absolute inset-0 bg-white rounded-2xl shadow-sm border-2 border-purple-100 flex items-center justify-center backface-hidden transition-all duration-300 ${isFlipped ? 'opacity-0 rotate-y-180' : 'opacity-100'}`}>
                                            <div className="w-8 h-8 rounded-full bg-purple-100/50" />
                                        </div>
                                        <div className={`absolute inset-0 bg-white rounded-2xl shadow-md border-2 border-purple-200 flex items-center justify-center backface-hidden rotate-y-180 transition-all duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                                            <Icon size={32} className="text-purple-600" />
                                        </div>
                                    </div>
                                    {/* Temporary simplistic Flip for MVP without complex CSS 3D transforms if above fails visually */}
                                    <div className={`absolute inset-0 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isFlipped ? 'bg-white border-2 border-purple-400' : 'bg-purple-200 border-2 border-white'}`}>
                                        {isFlipped ? <Icon size={32} className="text-purple-600" /> : <div className="w-4 h-4 rounded-full bg-purple-300/50" />}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Game Over Modal */}
                <AnimatePresence>
                    {gameOver && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
                            >
                                <Trophy size={64} className="text-purple-500 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold mb-2 text-slate-900">Mental Sharpness!</h2>
                                <p className="text-slate-500 mb-6">Completed in <strong className="text-purple-600 text-xl">{moves}</strong> moves</p>

                                <div className="space-y-3">
                                    <Button onClick={initializeGame} variant="primary" className="w-full bg-purple-600 hover:bg-purple-700">
                                        <RotateCcw size={20} className="mr-2" /> Play Again
                                    </Button>
                                    <Button onClick={() => navigate('/games')} variant="ghost" className="w-full">
                                        Exit to Menu
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </Container>
        </div>
    );
};

export default MemoryGame;
