import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Gift, ArrowRight, History, CheckCircle2, AlertCircle, ShoppingBag, CreditCard, Ticket } from 'lucide-react';
import { Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const RewardsPage = () => {
    const [rewards, setRewards] = useState([]);
    const [history, setHistory] = useState([]);
    const [userTokens, setUserTokens] = useState(0);
    const [totalCashback, setTotalCashback] = useState(0);
    const [loading, setLoading] = useState(true);
    const [redeemingId, setRedeemingId] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [notification, setNotification] = useState(null);
    const { isAuthenticated } = useAuth();

    const fetchRewards = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/rewards`, { withCredentials: true });
            if (response.data.success) {
                setRewards(response.data.rewards);
                setUserTokens(response.data.userTokens);
                setTotalCashback(response.data.totalCashback);
            }
        } catch (error) {
            console.error('Error fetching rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/rewards/history`, { withCredentials: true });
            if (response.data.success) {
                setHistory(response.data.history);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchRewards();
            fetchHistory();
        }
    }, [isAuthenticated]);

    const handleRedeem = async (rewardId) => {
        setRedeemingId(rewardId);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/rewards/redeem`, { rewardId }, { withCredentials: true });
            if (response.data.success) {
                setNotification({ type: 'success', message: response.data.message });
                setUserTokens(response.data.remainingTokens);
                // Refresh data
                fetchRewards();
                fetchHistory();
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to redeem reward'
            });
        } finally {
            setRedeemingId(null);
            setTimeout(() => setNotification(null), 5000);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'voucher': return <ShoppingBag className="text-blue-500" />;
            case 'cashback': return <CreditCard className="text-green-500" />;
            case 'coupon': return <Ticket className="text-purple-500" />;
            default: return <Gift className="text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Available Tokens</p>
                            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-2">
                                <Coins className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8" />
                                {userTokens}
                            </h3>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2"
                        >
                            <History size={16} />
                            <span className="hidden sm:inline">{showHistory ? "Catalog" : "History"}</span>
                            <span className="sm:hidden">{showHistory ? "Cat" : "Hist"}</span>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-purple-600 rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-200 text-white"
                    >
                        <p className="text-purple-100 text-xs sm:text-sm font-medium mb-1">Total Savings Earned</p>
                        <h3 className="text-3xl sm:text-4xl font-black flex items-center gap-2">
                            ₹{totalCashback}
                        </h3>
                        <p className="text-purple-200 text-[10px] sm:text-xs mt-2 font-medium">Consistency pays off! Keep going.</p>
                    </motion.div>
                </div>

                {/* Notifications */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}
                        >
                            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <p className="font-medium">{notification.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!showHistory ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Exclusive Rewards</h2>
                            <p className="text-sm text-gray-500">Redeem your hard-earned tokens</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rewards.map((reward, index) => (
                                <motion.div
                                    key={reward._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-purple-100 transition-all group"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={reward.image || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c"}
                                            alt={reward.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-purple-600 shadow-sm">
                                            {reward.rewardType.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-lg font-bold text-gray-900">{reward.title}</h4>
                                            {getIcon(reward.rewardType)}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-6 line-clamp-2">{reward.description}</p>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-6">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Cost</p>
                                                <p className="text-lg font-black text-gray-900">{reward.tokenCost} <span className="text-sm font-normal text-gray-500">Tokens</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Value</p>
                                                <p className="text-lg font-black text-green-600">₹{reward.cashbackValue}</p>
                                            </div>
                                        </div>

                                        <Button
                                            variant={userTokens >= reward.tokenCost ? "primary" : "secondary"}
                                            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                                            onClick={() => handleRedeem(reward._id)}
                                            disabled={redeemingId === reward._id || userTokens < reward.tokenCost}
                                        >
                                            {redeemingId === reward._id ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                                            ) : userTokens < reward.tokenCost ? (
                                                "Insufficient Tokens"
                                            ) : (
                                                <>
                                                    Redeem Now
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Redemption History</h2>
                            <p className="text-sm text-gray-500">{history.length} rewards claimed</p>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {history.length === 0 ? (
                                <div className="p-20 text-center">
                                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-400 font-medium">No redemptions yet. Start earning tokens!</p>
                                </div>
                            ) : (
                                history.map((item) => (
                                    <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                                {getIcon(item.rewardId?.rewardType)}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-900">{item.rewardId?.title || "Deleted Reward"}</h5>
                                                <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()} • {item.tokensUsed} Tokens</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-green-600">₹{item.cashbackValue}</p>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${item.status === 'approved' ? 'text-green-500' : 'text-yellow-500'
                                                }`}>
                                                {item.status}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RewardsPage;
