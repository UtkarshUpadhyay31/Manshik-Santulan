import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Hand, Eye, Volume2, Ear, Brain, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../UI';

export const BreathingTool = () => {
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
    const [counter, setCounter] = useState(4);

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    if (phase === 'Inhale') { setPhase('Hold'); return 4; }
                    if (phase === 'Hold') { setPhase('Exhale'); return 6; }
                    if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [phase]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
            <motion.div
                animate={{
                    scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : 1.5,
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: phase === 'Hold' ? 4 : phase === 'Inhale' ? 4 : 6, ease: "easeInOut" }}
                className="w-32 h-32 bg-blue-400/20 rounded-full flex items-center justify-center"
            >
                <Wind className="text-blue-500" size={40} />
            </motion.div>
            <h3 className="text-2xl font-bold mt-6 text-slate-800">{phase}</h3>
            <p className="text-blue-600 font-mono text-xl">{counter}s</p>
            <p className="text-xs text-slate-400 mt-4 text-center">Focus only on your breath. Let everything else fade.</p>
        </div>
    );
};

export const GroundingTool = () => {
    const steps = [
        { icon: Eye, label: '5 things you see', color: 'text-purple-500', bg: 'bg-purple-50' },
        { icon: Hand, label: '4 things you can touch', color: 'text-blue-500', bg: 'bg-blue-50' },
        { icon: Ear, label: '3 things you hear', color: 'text-green-500', bg: 'bg-green-50' },
        { icon: Volume2, label: '2 things you can smell', color: 'text-orange-500', bg: 'bg-orange-50' },
        { icon: Brain, label: '1 thing you can taste', color: 'text-pink-500', bg: 'bg-pink-50' },
    ];
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">5-4-3-2-1 Grounding</h3>
                <span className="text-xs font-bold text-slate-400">{currentStep + 1} / 5</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-10 rounded-2xl ${steps[currentStep].bg} flex flex-col items-center text-center`}
                >
                    <div className={`p-4 rounded-2xl bg-white shadow-sm mb-4 ${steps[currentStep].color}`}>
                        {React.createElement(steps[currentStep].icon, { size: 32 })}
                    </div>
                    <p className="font-bold text-slate-800 text-lg mb-2">{steps[currentStep].label}</p>
                    <p className="text-sm text-slate-500">Take your time. Notice the details.</p>
                </motion.div>
            </AnimatePresence>

            <Button
                onClick={() => setCurrentStep((prev) => (prev + 1) % 5)}
                className="w-full mt-6 rounded-xl bg-slate-900 text-white flex justify-center items-center gap-2 py-4"
            >
                {currentStep === 4 ? 'Reset' : 'Next Step'} <ChevronRight size={18} />
            </Button>
        </div>
    );
};

const MentalMicroTools = () => {
    const [activeTool, setActiveTool] = useState('breathing');

    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                    onClick={() => setActiveTool('breathing')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeTool === 'breathing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                    Breathing
                </button>
                <button
                    onClick={() => setActiveTool('grounding')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeTool === 'grounding' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                    Grounding
                </button>
            </div>

            {activeTool === 'breathing' ? <BreathingTool /> : <GroundingTool />}
        </div>
    );
};

export default MentalMicroTools;
