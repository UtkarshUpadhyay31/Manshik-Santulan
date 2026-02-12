import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, ArrowRight, Menu, X, Activity, Phone, MessageSquare, Wind, Zap, Sun, ShieldAlert, ChevronRight, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Button, Container, Card } from '../components/UI';

const HelpPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeExercise, setActiveExercise] = useState(null); // 'box', '478', 'grounding'
    const [panicActive, setPanicActive] = useState(false);
    const [groundiningStep, setGroundingStep] = useState(0);

    // Breathing Timer State
    const [timer, setTimer] = useState(0);
    const [phase, setPhase] = useState(''); // 'In', 'Hold', 'Out'
    const [isRunning, setIsRunning] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isAudioBlocked, setIsAudioBlocked] = useState(false);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const fadeIntervalRef = useRef(null);

    // Initialize Audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio('/audio/breathing-bg.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        };
    }, []);

    // Handle Fade Logic
    const fadeAudio = (targetVolume) => {
        if (!audioRef.current) return;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

        const step = 0.025;
        const intervalTime = 50; // Fade time approx 0.5s

        fadeIntervalRef.current = setInterval(() => {
            if (!audioRef.current) {
                clearInterval(fadeIntervalRef.current);
                return;
            }
            const currentVol = audioRef.current.volume;
            if (Math.abs(currentVol - targetVolume) < step) {
                audioRef.current.volume = targetVolume;
                clearInterval(fadeIntervalRef.current);
                if (targetVolume === 0 && audioRef.current) {
                    audioRef.current.pause();
                }
            } else {
                const nextVol = currentVol < targetVolume ? currentVol + step : currentVol - step;
                audioRef.current.volume = Math.max(0, Math.min(1, nextVol));
            }
        }, intervalTime);
    };

    // Sync Audio with Exercise State
    useEffect(() => {
        if (!audioRef.current) return;

        if (isRunning && soundEnabled && (activeExercise === 'box' || activeExercise === '478')) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    setIsAudioBlocked(true);
                });
            }
            fadeAudio(0.25);
        } else {
            fadeAudio(0);
        }
    }, [isRunning, soundEnabled, activeExercise]);

    // Box Breathing: 4-4-4-4
    // 4-7-8 Breathing: 4 (In), 7 (Hold), 8 (Out)

    const startBreathing = (type) => {
        setIsRunning(true);
        setActiveExercise(type);
        setTimer(type === 'box' ? 4 : 4);
        setPhase('Inhale');
    };

    const stopBreathing = () => {
        setIsRunning(false);
        setActiveExercise(null);
        setPhase('');
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        if (isRunning && (activeExercise === 'box' || activeExercise === '478')) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        // Switch Phase
                        if (activeExercise === 'box') {
                            if (phase === 'Inhale') { setPhase('Hold'); return 4; }
                            if (phase === 'Hold') { setPhase('Exhale'); return 4; }
                            if (phase === 'Exhale') { setPhase('Hold '); return 4; }
                            if (phase === 'Hold ') { setPhase('Inhale'); return 4; }
                        } else if (activeExercise === '478') {
                            if (phase === 'Inhale') { setPhase('Hold'); return 7; }
                            if (phase === 'Hold') { setPhase('Exhale'); return 8; }
                            if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, activeExercise, phase]);

    const quotes = [
        "This feeling is temporary. You are safe.",
        "Take it one breath at a time. Just one.",
        "You have survived 100% of your hardest days.",
        "Be gentle with yourself. You are doing enough.",
        "Your peace is more important than the chaos.",
        "You are stronger than the thoughts that haunt you."
    ];

    const [selectedQuote, setSelectedQuote] = useState(null);

    const groundingSteps = [
        { id: 5, label: "5 things you can SEE", items: ["Clouds", "Desk", "Phone", "Window", "Plant"] },
        { id: 4, label: "4 things you can TOUCH", items: ["Cloth", "Table", "Skin", "Hair"] },
        { id: 3, label: "3 things you can HEAR", items: ["Fan", "Traffic", "Breathing"] },
        { id: 2, label: "2 things you can SMELL", items: ["Coffee", "Fresh Air"] },
        { id: 1, label: "1 thing you can TASTE", items: ["Water"] }
    ];

    const emergencyContacts = [
        { name: "Vandrevala Foundation", phone: "9999666555", desc: "24/7 Crisis Support" },
        { name: "iCall (TISS)", phone: "02225521111", desc: "Psychosocial Helpline" },
        { name: "AASRA", phone: "9820466726", desc: "Suicide Prevention" }
    ];

    const handlePanic = () => {
        setPanicActive(true);
        startBreathing('box');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
            {/* Navigation - Same as LandingPage */}
            <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/60 backdrop-blur-xl border-b border-white/40 supports-[backdrop-filter]:bg-white/30">
                <Container className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                            Manshik Santulan
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors relative">Home</Link>
                        <Link to="/help" className="text-sm font-bold text-purple-600 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-purple-600">Help Now</Link>
                        <Link to="/dashboard">
                            <Button size="sm" className="rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all hover:-translate-y-0.5">
                                Dashboard <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </Link>
                    </div>

                    <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </Container>
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-white/40 p-6 flex flex-col gap-6">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-900 border-b border-slate-50 pb-2">Home</Link>
                        <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-purple-600 border-b border-slate-50 pb-2">Help Now</Link>
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full rounded-full bg-slate-900 text-white">Dashboard</Button>
                        </Link>
                    </div>
                )}
            </nav>

            <div className="relative z-10 pt-32 pb-20">
                <Container>
                    {/* Reassurance Header (Always Visible) */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-6"
                        >
                            <ShieldAlert size={16} /> Offline Support Active
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">You're not alone.</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Take a deep breath. We are here to help you get through this moment.</p>

                        {!panicActive && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePanic}
                                className="mt-10 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-2xl shadow-red-200 transition-all flex items-center gap-3 mx-auto"
                            >
                                <ShieldAlert /> I NEED HELP NOW
                            </motion.button>
                        )}
                    </div>

                    {panicActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-16 p-8 bg-red-50 border border-red-100 rounded-[2.5rem] text-center"
                        >
                            <h2 className="text-2xl font-bold text-red-900 mb-2">Emergency Mode Active</h2>
                            <p className="text-red-700 mb-6">Focus on the circle below. Breathe with the rhythm. Help is available.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {emergencyContacts.map((c, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center">
                                        <span className="font-bold text-slate-900">{c.name}</span>
                                        <a href={`tel:${c.phone}`} className="text-red-600 font-bold text-xl my-2">{c.phone}</a>
                                        <div className="flex gap-2">
                                            <a href={`tel:${c.phone}`} className="p-2 bg-red-50 text-red-600 rounded-lg"><Phone size={18} /></a>
                                            <a href={`sms:${c.phone}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MessageSquare size={18} /></a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setPanicActive(false)} className="mt-8 text-red-900 underline font-medium">I'm feeling better now</button>
                        </motion.div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Breathing Section */}
                        <Card className="p-8 md:p-12 relative overflow-hidden">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <Wind className="text-blue-500" /> Breathing Space
                            </h2>

                            <div className="flex flex-col items-center justify-center min-h-[300px]">
                                <AnimatePresence mode="wait">
                                    {activeExercise ? (
                                        <motion.div
                                            key="timer"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center"
                                        >
                                            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                                                <motion.div
                                                    animate={{
                                                        scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : 1.5,
                                                        opacity: phase === 'Hold' || phase === 'Hold ' ? 0.8 : 1
                                                    }}
                                                    transition={{ duration: timer, ease: "linear" }}
                                                    className="absolute inset-0 bg-blue-100 rounded-full"
                                                />
                                                <div className="relative z-10 text-4xl font-bold text-blue-600">{timer}</div>
                                            </div>
                                            <div className="text-2xl font-bold text-slate-800 mb-2 uppercase tracking-widest">{phase}</div>
                                            <p className="text-slate-500 mb-8">{activeExercise === 'box' ? "Box Breathing (4-4-4-4)" : "4-7-8 Technique"}</p>

                                            <div className="flex flex-col items-center gap-4">
                                                {isAudioBlocked && isRunning && (
                                                    <motion.button
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        onClick={() => { setSoundEnabled(true); setIsAudioBlocked(false); }}
                                                        className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold animate-pulse"
                                                    >
                                                        Tap to enable calming sound
                                                    </motion.button>
                                                )}

                                                <div className="flex gap-4">
                                                    <Button onClick={stopBreathing} variant="secondary" className="rounded-full">Stop Exercise</Button>
                                                    <Button
                                                        onClick={() => { setSoundEnabled(!soundEnabled); setIsAudioBlocked(false); }}
                                                        variant="ghost"
                                                        className={`rounded-full p-3 transition-all ${soundEnabled ? 'text-purple-600 bg-purple-50' : 'text-slate-400 bg-slate-50'}`}
                                                    >
                                                        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="grid gap-4 w-full"
                                        >
                                            <button
                                                onClick={() => startBreathing('box')}
                                                className="p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-100 text-left transition-all group"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-lg text-blue-900">Box Breathing</span>
                                                    <ArrowRight size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <p className="text-sm text-blue-700">Equal inhale, hold, exhale, and hold. Great for instant focus.</p>
                                            </button>
                                            <button
                                                onClick={() => startBreathing('478')}
                                                className="p-6 bg-purple-50 hover:bg-purple-100 rounded-2xl border border-purple-100 text-left transition-all group"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-lg text-purple-900">4-7-8 Technique</span>
                                                    <ArrowRight size={20} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <p className="text-sm text-purple-700">Deep relaxation technique. Inhale for 4, hold for 7, exhale for 8.</p>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>

                        {/* Grounding Section */}
                        <Card className="p-8 md:p-12">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <Zap className="text-yellow-500" /> Grounding Exercise
                            </h2>

                            <div className="min-h-[300px]">
                                <div className="mb-8">
                                    <div className="flex gap-2 mb-4">
                                        {[5, 4, 3, 2, 1].map((step) => (
                                            <div
                                                key={step}
                                                className={`h-2 flex-1 rounded-full ${5 - step <= groundiningStep ? 'bg-yellow-400' : 'bg-slate-100'}`}
                                            />
                                        ))}
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 mb-2">{groundingSteps[groundiningStep].id}</h3>
                                    <p className="text-lg text-slate-600">{groundingSteps[groundiningStep].label}</p>
                                </div>

                                <div className="space-y-3 mb-12">
                                    {groundingSteps[groundiningStep].items.map((item, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400" /> {item}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => setGroundingStep((prev) => (prev + 1) % 5)}
                                    className="w-full rounded-xl py-6 bg-slate-900 hover:bg-slate-800 text-white flex justify-between px-8"
                                >
                                    {groundiningStep === 4 ? "Restart Exercise" : "Next Sensory Step"}
                                    <ChevronRight />
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Quotes Grid */}
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                            <Heart className="text-pink-500" /> Reassuring Words
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {quotes.map((quote, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedQuote(i)}
                                    className={`p-8 rounded-[2rem] border transition-all cursor-pointer h-full flex items-center justify-center text-center ${selectedQuote === i ? 'bg-pink-50 border-pink-200 shadow-xl shadow-pink-100' : 'bg-white border-slate-100 hover:border-pink-100 shadow-lg shadow-slate-200/50'}`}
                                >
                                    <p className={`text-lg font-medium ${selectedQuote === i ? 'text-pink-900' : 'text-slate-600'}`}>"{quote}"</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Emergency Contacts Table */}
                    <div className="mt-24 bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="max-w-md">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-purple-300 text-sm font-medium mb-6">
                                    <Phone size={14} /> Available 24/7
                                </div>
                                <h2 className="text-3xl font-bold mb-6">Crisis Support Network</h2>
                                <p className="text-slate-300">If you are in immediate danger, please call your local emergency services (112 or 100 in India) or reach out to someone you trust.</p>
                            </div>

                            <div className="w-full max-w-xl space-y-4">
                                {emergencyContacts.map((contact, i) => (
                                    <div key={i} className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all">
                                        <div>
                                            <div className="font-bold text-xl mb-1">{contact.name}</div>
                                            <div className="text-slate-400 text-sm">{contact.desc}</div>
                                        </div>
                                        <div className="flex gap-3">
                                            <a href={`tel:${contact.phone}`} className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-purple-50 transition-colors">
                                                <Phone size={20} />
                                            </a>
                                            <a href={`sms:${contact.phone}`} className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors">
                                                <MessageSquare size={20} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default HelpPage;
