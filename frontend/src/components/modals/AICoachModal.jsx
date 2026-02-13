import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, AlertTriangle, RefreshCw, MessageCircle, Wrench } from 'lucide-react';
import { Button } from '../UI';
import api from '../../services/api';
import MentalMicroTools from '../AICoach/MentalMicroTools';

const AICoachModal = ({ isOpen, onClose }) => {
    const [userMessage, setUserMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'tools'
    const [chatHistory, setChatHistory] = useState([
        {
            type: 'ai',
            message: "Hello! 👋 I'm your AI Wellness Coach. I'm here to listen and help you navigate your emotional well-being.",
        }
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isTyping]);

    const handleSendMessage = async () => {
        if (!userMessage.trim() || isTyping) return;

        const messageText = userMessage;
        const newMsg = { type: 'user', message: messageText };
        setChatHistory(prev => [...prev, newMsg]);
        setUserMessage('');
        setIsTyping(true);

        try {
            const guestId = localStorage.getItem('guestId') || `guest_${Math.random().toString(36).substr(2, 9)}`;
            if (!localStorage.getItem('guestId')) localStorage.setItem('guestId', guestId);

            const response = await api.post('/ai-coach/chat', {
                message: messageText,
                userId: guestId,
                userName: 'Friend'
            });

            const { message, analysis: aiAnalysis, isCrisis } = response.data;
            setAnalysis(aiAnalysis);

            // Simulate "thinking" time based on message length
            const delay = Math.min(Math.max(messageText.length * 10, 1000), 3000);

            setTimeout(() => {
                setIsTyping(false);
                setChatHistory(prev => [...prev, {
                    type: 'ai',
                    message,
                    isCrisis,
                    analysis: aiAnalysis
                }]);
            }, delay);

        } catch (error) {
            console.error('AI Chat Error:', error);
            setIsTyping(false);
            setChatHistory(prev => [...prev, {
                type: 'ai',
                message: "I'm having a bit of trouble connecting right now. Can we try again in a moment?"
            }]);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white rounded-3xl max-w-lg w-full max-h-[700px] flex flex-col h-[700px] shadow-2xl overflow-hidden border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <Bot className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">AI Wellness Coach</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-slate-300 font-medium">Always listening</span>
                                {analysis && (
                                    <div className="ml-2 px-2 py-0.5 bg-purple-500/20 rounded-full border border-purple-500/30 flex items-center gap-1">
                                        <Sparkles size={10} className="text-purple-300" />
                                        <span className="text-[10px] text-purple-200 uppercase tracking-wider font-bold">
                                            Role: {analysis.mode}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-900 border-t border-white/5">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all ${activeTab === 'chat' ? 'text-white border-b-2 border-purple-500' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <MessageCircle size={14} /> AI Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('tools')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all ${activeTab === 'tools' ? 'text-white border-b-2 border-purple-500' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Wrench size={14} /> Wellness Tools
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {activeTab === 'chat' ? (
                        <>
                            <AnimatePresence mode="popLayout">
                                {chatHistory.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'} items-end gap-2`}
                                    >
                                        {msg.type === 'ai' && (
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <Bot size={16} className="text-slate-600" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${msg.type === 'ai'
                                                    ? msg.isCrisis
                                                        ? 'bg-red-50 text-red-900 border border-red-100 rounded-bl-none shadow-sm'
                                                        : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                                                    : 'bg-slate-900 text-white shadow-md rounded-br-none font-medium'
                                                }`}
                                        >
                                            {msg.isCrisis && (
                                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-200/50">
                                                    <AlertTriangle size={16} className="text-red-500" />
                                                    <span className="font-bold uppercase tracking-wider text-xs">Emergency Support</span>
                                                </div>
                                            )}
                                            <p>{msg.message}</p>
                                            {msg.analysis && (
                                                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                                                    <span className="text-[10px] text-slate-400 font-medium">Detected: {msg.analysis.dominantEmotion}</span>
                                                    <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${msg.analysis.confidence * 100}%` }}
                                                            className="h-full bg-purple-500"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Bot size={16} className="text-slate-400" />
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 rounded-bl-none">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <MentalMicroTools />
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area (Only for chat) */}
                {activeTab === 'chat' && (
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex gap-3 items-center">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Share what's on your mind..."
                                    className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:bg-white focus:border-slate-900 transition-all text-sm"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="h-4 w-[1px] bg-slate-200" />
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                                        <Sparkles size={18} />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!userMessage.trim() || isTyping}
                                className={`p-3.5 rounded-2xl transition-all shadow-lg active:scale-95 ${!userMessage.trim() || isTyping
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
                                    }`}
                            >
                                {isTyping ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </div>
                        <p className="mt-3 text-center text-[10px] text-slate-400 font-medium">
                            Your session is private and anonymous. AI can make mistakes.
                        </p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AICoachModal;
