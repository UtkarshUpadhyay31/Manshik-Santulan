import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center p-8 backdrop-blur-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-full mb-6">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">403</h1>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Access Forbidden</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Sorry, you don’t have permission to access this page. This area is reserved for administrators only.
                </p>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all transform hover:-translate-y-0.5"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
            </motion.div>
        </div>
    );
};

export default UnauthorizedPage;
