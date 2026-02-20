import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Coins, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StreakBar = () => {
    const { isAuthenticated } = useAuth();
    const [data, setData] = useState(null);
    const [rewardInfo, setRewardInfo] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            updateStreak();
        }
    }, [isAuthenticated]);

    const updateStreak = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/streak/update`, {}, {
                withCredentials: true
            });

            if (response.data.success) {
                setData({
                    streakCount: response.data.streakCount,
                    tokens: response.data.tokens
                });

                if (response.data.message !== 'Already claimed today') {
                    setRewardInfo({
                        message: response.data.message,
                        tokensEarned: response.data.tokensEarned,
                        bonus: response.data.bonusAwarded
                    });
                    setTimeout(() => setRewardInfo(null), 5000);
                }
            }
        } catch (error) {
            console.error('Error updating streak:', error);
        }
    };

    if (!isAuthenticated || !data) return null;

    return (
        <div className="relative">
            <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm overflow-x-auto">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <Flame size={20} className="sm:size-6" fill={data.streakCount > 0 ? "currentColor" : "none"} />
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Streak</p>
                            <p className="text-sm sm:text-lg font-black text-gray-900 leading-tight">{data.streakCount} Days</p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-100 hidden sm:block" />

                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                            <Coins size={20} className="sm:size-6" fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Tokens</p>
                            <p className="text-sm sm:text-lg font-black text-gray-900 leading-tight">{data.tokens}</p>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-purple-600 italic">
                        {data.streakCount > 0 ? "Keep that momentum going! 🔥" : "Start your wellness journey today! 🌱"}
                    </p>
                </div>
            </div>

            {/* Reward Popups */}
            <AnimatePresence>
                {rewardInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-8 right-8 z-[100] bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 border-2 border-white/20"
                    >
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Sparkles className="text-yellow-300 w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{rewardInfo.message}</p>
                            <p className="text-2xl font-black">+{rewardInfo.tokensEarned} Tokens Earned! 🎉</p>
                            {rewardInfo.bonus > 0 && (
                                <p className="text-xs font-bold text-yellow-300 mt-1">
                                    🔥 {rewardInfo.bonus} Day Milestone Bonus Included!
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StreakBar;
