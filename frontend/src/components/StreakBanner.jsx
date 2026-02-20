import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, Circle, Coins, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StreakBanner = () => {
    const { isAuthenticated, user } = useAuth();
    const [streakData, setStreakData] = useState(null);
    const [userTokens, setUserTokens] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchStreak();
        }
    }, [isAuthenticated]);

    const fetchStreak = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/streak`, {
                withCredentials: true
            });

            if (response.data.success) {
                setStreakData(response.data.streak);

                // Fetch tokens as well
                const rewardsRes = await axios.get(`${import.meta.env.VITE_API_URL}/rewards`, {
                    withCredentials: true
                });
                if (rewardsRes.data.success) {
                    setUserTokens(rewardsRes.data.userTokens);
                }

                // Check for milestone celebration
                const currentStreak = response.data.streak.currentStreak;
                if (currentStreak > 0 && currentStreak % 7 === 0) {
                    setShowCelebration(true);
                    setTimeout(() => setShowCelebration(false), 3000);
                }
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching streak:', error);
            setIsLoading(false);
        }
    };

    if (!isAuthenticated || isLoading || !streakData) {
        return null;
    }

    const currentStreak = streakData.currentStreak || 0;
    const streakHistory = streakData.streakHistory || [];

    // Get last 7 days of history
    const last7Days = streakHistory.slice(-7);

    // Generate day labels
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDay();
    const reorderedLabels = [...dayLabels.slice(today - 6), ...dayLabels.slice(0, today + 1)];

    const getMotivationalMessage = () => {
        if (currentStreak === 0) return "Start your journey today 🌱";
        if (currentStreak === 1) return "Great start! Keep it up 🌿";
        if (currentStreak < 7) return "Building momentum ✨";
        if (currentStreak < 14) return "You're on fire! 🔥";
        if (currentStreak < 30) return "Incredible dedication 💪";
        return "Mental wellness master! 🏆";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 border-b border-purple-100 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-6 flex-wrap">
                    {/* Left: Streak Counter */}
                    <div className="flex items-center gap-4">
                        <motion.div
                            animate={{
                                scale: currentStreak > 0 ? [1, 1.1, 1] : 1
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                                <Flame className="w-8 h-8 text-white" fill="white" />
                            </div>
                            {currentStreak > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center border-2 border-white"
                                >
                                    {currentStreak}
                                </motion.div>
                            )}
                        </motion.div>

                        <div>
                            <motion.p
                                key={currentStreak}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                            >
                                {currentStreak}
                            </motion.p>
                            <p className="text-sm font-bold text-slate-600">Day Streak</p>
                        </div>
                    </div>

                    {/* Center: 7-Day Calendar */}
                    <div className="flex items-center gap-2">
                        {last7Days.map((isActive, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex flex-col items-center gap-1"
                            >
                                <p className="text-xs font-bold text-slate-400">
                                    {reorderedLabels[index]}
                                </p>
                                <div className="relative">
                                    {isActive ? (
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md"
                                        >
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </motion.div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center opacity-40">
                                            <Circle className="w-6 h-6 text-slate-400" />
                                        </div>
                                    )}

                                    {/* Today indicator */}
                                    {index === 6 && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-600" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right: Tokens & Rewards */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white/50 px-4 py-2 rounded-2xl border border-purple-100 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-white">
                                <Coins size={18} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900">{userTokens}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Calm Tokens</p>
                            </div>
                            <Link to="/rewards">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="ml-2 p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                >
                                    <Gift size={16} />
                                </motion.button>
                            </Link>
                        </div>

                        <div className="hidden lg:block h-10 w-px bg-purple-100" />

                        <div className="text-right">
                            <p className="text-sm font-bold text-purple-700 italic">
                                {getMotivationalMessage()}
                            </p>
                            <div className="flex items-center justify-end gap-2 mt-1">
                                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(currentStreak % 7) / 7 * 100}%` }}
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500">
                                    {7 - (currentStreak % 7)} days to bonus
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Celebration Animation */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-8 text-center border-4 border-purple-500"
                    >
                        <p className="text-6xl mb-4">🎉</p>
                        <p className="text-2xl font-black text-purple-600 mb-2">
                            {currentStreak} Day Milestone!
                        </p>
                        <p className="text-slate-600">
                            You're building mental strength every day!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StreakBanner;
