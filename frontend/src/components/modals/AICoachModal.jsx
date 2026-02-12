import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { Button } from '../UI';

const AICoachModal = ({ isOpen, onClose }) => {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            type: 'ai',
            message: "Hello! 👋 I'm your AI Wellness Coach. I'm here to listen and help you navigate your emotional well-being.",
        },
        {
            type: 'ai',
            message: "Based on our anonymous session, I'm ready to support you. How are you feeling right now?",
        },
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSendMessage = () => {
        if (!userMessage.trim()) return;

        const newMsg = { type: 'user', message: userMessage };
        setChatHistory(prev => [...prev, newMsg]);
        setUserMessage('');

        // Mock AI Response
        setTimeout(() => {
            const responses = [
                "I hear you. That sounds important. Can you tell me more?",
                "It's completely normal to feel that way. How does that sit with you?",
                "I'm here for you. Taking a few deep breaths might help ground you right now.",
                "Thank you for sharing that. Awareness is the first step.",
                "That's a valid perspective. What do you think would help you feel better in this moment?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setChatHistory(prev => [...prev, { type: 'ai', message: randomResponse }]);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-md w-full max-h-[600px] flex flex-col h-[600px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Your AI Coach</h2>
                        <p className="text-sm text-green-600">Always here to help 🤖</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {chatHistory.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.type === 'ai'
                                    ? 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md rounded-tr-none'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.message}</p>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-4 bg-white rounded-b-2xl">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95 transform duration-100"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AICoachModal;
