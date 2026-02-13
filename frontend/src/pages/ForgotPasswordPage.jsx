import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        // Mock API call
        setTimeout(() => {
            if (email === 'error@test.com') {
                setErrorMessage('User with this email was not found.');
                setIsSubmitting(false);
            } else {
                setIsSent(true);
                setIsSubmitting(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 px-4">
            {/* Background Decor */}
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-300/10 rounded-full blur-[80px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md p-8 backdrop-blur-xl bg-white/70 dark:bg-slate-900/40 border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-2xl"
            >
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to login
                </Link>

                {!isSent ? (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Forgot Password?</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">No worries! Enter your email and we'll send you a link to reset it.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm flex gap-2 items-center">
                                    <AlertCircle size={16} /> {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                            >
                                {isSubmitting ? <Loader className="animate-spin" size={20} /> : "Reset Password"}
                            </button>
                        </form>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-6">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Check your mail</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                            We've sent a password reset link to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Didn't receive it? Check your spam or <button onClick={() => setIsSent(false)} className="text-blue-500 hover:underline">try again</button>
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
