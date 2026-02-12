import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Shield, AlertTriangle } from 'lucide-react';
import { Button, Container, Card, Input } from '../components/UI';
import { io } from 'socket.io-client';
import api from '../services/api';

const SessionPage = () => {
    const { id } = useParams(); // professional ID
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');

    const [professional, setProfessional] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [chatId, setChatId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [callActive, setCallActive] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        fetchProfessional();
        initChat();

        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        return () => newSocket.close();
    }, [id, type]);

    useEffect(() => {
        if (socket && chatId) {
            socket.emit('join-chat', chatId);
            socket.on('receive-message', (message) => {
                setMessages((prev) => [...prev, message]);
            });
        }
    }, [socket, chatId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchProfessional = async () => {
        try {
            const endpoint = type === 'mentor' ? 'mentors' : 'doctors';
            const res = await api.get(`/professionals/${endpoint}/${id}`);
            setProfessional(type === 'mentor' ? res.data.mentor : res.data.doctor);
        } catch (error) {
            console.error(error);
        }
    };

    const initChat = async () => {
        try {
            const res = await api.post('/professionals/chat/init', {
                userId: 'guest_user',
                professionalId: id,
                professionalModel: type === 'mentor' ? 'Mentor' : 'Doctor'
            });
            setChatId(res.data.chat._id);
            setMessages(res.data.chat.messages || []);
        } catch (error) {
            console.error(error);
        }
    };

    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim() || !chatId) return;

        const messageData = {
            chatId,
            senderId: 'guest_user',
            senderName: 'You',
            professionalId: id,
            text: inputText
        };

        socket.emit('send-message', messageData);

        try {
            await api.post('/professionals/chat/message', messageData);
        } catch (error) {
            console.error(error);
        }

        setInputText('');
    };

    const startCall = () => {
        setCallActive(true);
    };

    if (!professional) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Preparing your session...</p>
            <Link to="/" className="mt-8 text-sm text-slate-400 hover:text-slate-900 underline">Return Home</Link>
        </div>
    );

    return (
        <div className="h-screen bg-[#FDFCFB] flex flex-col">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-20 z-40">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <img src={professional.photo} alt={professional.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <h3 className="font-bold text-slate-900 leading-tight">{professional.name}</h3>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="p-2 rounded-full" onClick={startCall}>
                        <Phone size={20} />
                    </Button>
                    <Button variant="ghost" className="p-2 rounded-full group relative">
                        <Video size={20} className="text-slate-300" />
                        <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Video call coming soon</span>
                    </Button>
                    <Button variant="ghost" className="p-2 rounded-full">
                        <MoreVertical size={20} />
                    </Button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar" ref={scrollRef}>
                <div className="text-center py-10">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">Secure Encrypted Session Started</p>
                    <p className="text-[10px] text-slate-300">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.senderId === 'guest_user' ? 'justify-end' : 'justify-start'}`}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`max-w-[80%] p-4 rounded-3xl ${msg.senderId === 'guest_user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'}`}
                        >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className={`text-[9px] mt-2 ${msg.senderId === 'guest_user' ? 'text-slate-400' : 'text-slate-300'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4 items-center">
                <Input
                    placeholder="Type your message..."
                    className="rounded-2xl border-transparent bg-slate-50 focus:bg-white"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <Button size="icon" className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex-shrink-0" type="submit">
                    <Send size={20} />
                </Button>
            </form>

            {/* Disclaimer Overlay */}
            <AnimatePresence>
                {showDisclaimer && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ y: 20 }} animate={{ y: 0 }}
                            className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative"
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Professional Consultation</h3>
                            <p className="text-slate-600 mb-10 leading-relaxed text-lg font-medium">
                                "This is professional medical support. Please share accurate information."
                            </p>
                            <Button onClick={() => setShowDisclaimer(false)} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg">
                                I Understand
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mock Call UI */}
            <AnimatePresence>
                {callActive && (
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-12 text-center"
                    >
                        <div className="w-32 h-32 rounded-full border-4 border-purple-500 p-2 mb-8 animate-pulse">
                            <img src={professional.photo} alt={professional.name} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">{professional.name}</h2>
                        <p className="text-purple-400 font-mono text-sm tracking-widest mb-20 animate-pulse">CONNECTING AUDIO SECURELY...</p>

                        <div className="flex gap-8">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white"><Video size={24} /></div>
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer" onClick={() => setCallActive(false)}><Phone size={24} className="rotate-[135deg]" /></div>
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white"><Shield size={24} /></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SessionPage;
