import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, Phone, MessageSquare, ArrowRight, Wind } from 'lucide-react';
import { Button } from '../UI';

const CrisisAlertModal = ({ isOpen, onAction }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl border border-red-100 overflow-hidden relative"
                >
                    {/* Background Highlight */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-100/50">
                            <AlertCircle size={40} className="text-red-600" />
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">We are here for you.</h2>
                        <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                            I'm sensing that you're going through a very difficult time right now. Please know that you're not alone, and there is immediate support available to help you through this.
                        </p>

                        <div className="flex flex-col gap-4">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => onAction('help')}
                                className="w-full rounded-2xl py-5 bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-200 flex items-center justify-center gap-3 text-lg font-bold"
                            >
                                <ShieldAlert /> Get Help Now
                            </Button>

                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => onAction('breathe')}
                                className="w-full rounded-2xl py-5 border-slate-200 text-slate-700 flex items-center justify-center gap-3 text-lg font-bold"
                            >
                                <Wind size={24} className="text-blue-500" /> Pause and Breathe
                            </Button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Immediate Crisis Lines (24/7)</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 mb-1">AASRA</p>
                                    <a href="tel:9820466726" className="text-red-600 font-bold">9820466726</a>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 mb-1">iCall</p>
                                    <a href="tel:02225521111" className="text-red-600 font-bold">02225521111</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CrisisAlertModal;
