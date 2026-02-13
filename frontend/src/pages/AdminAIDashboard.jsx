import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Database, MessageSquare, AlertCircle, Save, Plus,
    Trash2, Search, TrendingUp, Users, Heart, AlertTriangle, ArrowRight
} from 'lucide-react';
import { Button, Container, Card } from '../components/UI';
import api from '../services/api';

const AdminAIDashboard = () => {
    const [config, setConfig] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('emotions');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [configRes, analyticsRes] = await Promise.all([
                api.get('/admin/ai-config'),
                api.get('/admin/ai-analytics')
            ]);
            setConfig(configRes.data.config);
            setAnalytics(analyticsRes.data.analytics);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setIsLoading(false);
        }
    };

    const handleUpdateConfig = async () => {
        try {
            await api.put('/admin/ai-config', config);
            alert('AI Configuration updated successfully!');
        } catch (error) {
            console.error('Update Error:', error);
            alert('Failed to update configuration');
        }
    };

    if (isLoading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <Database className="w-12 h-12 text-slate-900 animate-pulse" />
                <div className="absolute inset-0 blur-xl bg-slate-400/20 animate-pulse" />
            </div>
            <p className="text-slate-500 font-bold tracking-tight">Accessing Neural Core...</p>
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter mb-2 underline underline-offset-8 decoration-purple-100">Neural Configuration</h1>
                    <p className="text-slate-500 font-medium">Fine-tune linguistics, emotional triggers, and response heuristics.</p>
                </div>
                <Button
                    onClick={handleUpdateConfig}
                    className="bg-slate-900 text-white rounded-[1.5rem] px-8 py-6 h-auto flex items-center gap-3 hover:bg-slate-800 shadow-2xl shadow-slate-200 hover:-translate-y-1 transition-all font-bold"
                >
                    <Save size={20} /> Deploy Heuristics
                </Button>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Conversational Load', value: analytics?.totalSessions || 0, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Precision Score', value: `${((analytics?.avgConfidence || 0) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Dominant Affect', value: analytics?.topEmotion || 'None', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
                    { label: 'Critical Thresholds', value: analytics?.crisisCount || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500"
                    >
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                            <stat.icon size={26} />
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Main Config Area */}
            <Card className="bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white/40 shadow-2xl shadow-slate-200/40 overflow-hidden relative">
                <div className="flex bg-slate-50/40 border-b border-white">
                    {['emotions', 'crisis', 'global'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-10 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab
                                ? 'text-slate-900 bg-white/40'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="aiTab"
                                    className="absolute bottom-0 left-0 right-0 h-1.5 bg-purple-600 shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'emotions' && config?.emotions && (
                            <motion.div
                                key="emotions"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search mapped emotions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white/60 border border-white rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-sm font-medium shadow-sm"
                                        />
                                    </div>
                                    <Button className="bg-slate-900 text-white rounded-[1.5rem] px-8 py-4 h-auto font-bold shadow-xl shadow-slate-200">
                                        <Plus size={18} className="mr-2" /> Map New Affect
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    {config.emotions
                                        .filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((emotion, eIdx) => (
                                            <div key={eIdx} className="p-8 bg-white/40 border border-white rounded-[2.5rem] shadow-sm group hover:shadow-xl hover:bg-white/60 transition-all duration-500">
                                                <div className="flex justify-between items-start mb-10">
                                                    <div>
                                                        <h4 className="text-2xl font-bold text-slate-900 tracking-tight capitalize mb-1">{emotion.name}</h4>
                                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest px-2 py-1 bg-white/80 rounded-lg w-fit">Affect Profile • {emotion.name}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="p-3 text-red-500 bg-white shadow-sm border border-red-50 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                    {/* Keywords */}
                                                    <div className="space-y-6">
                                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <Settings size={14} /> Semantic Tokens
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {emotion.keywords.en.map((k, kIdx) => (
                                                                <span key={kIdx} className="px-4 py-2 bg-white/80 border border-white rounded-2xl text-xs font-bold text-slate-700 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-default">
                                                                    {k.word} <span className="text-[10px] text-purple-600 ml-1">w:{k.weight}</span>
                                                                </span>
                                                            ))}
                                                            <button className="px-5 py-2 border border-dashed border-slate-300 rounded-2xl text-[10px] text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all font-black uppercase tracking-wider bg-white/20">
                                                                + TOKEN
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Templates */}
                                                    <div className="space-y-6">
                                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <Database size={14} /> Heuristic Repository
                                                        </h5>
                                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {['validation', 'reflection', 'insight', 'action', 'followup'].map((type) => (
                                                                <div key={type} className="p-4 bg-white/60 rounded-2xl border border-white shadow-sm transition-all group-hover:bg-white/80">
                                                                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">{type}</p>
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-xl font-bold text-slate-900 tracking-tighter">{emotion.templates[type]?.en?.length || 0}</p>
                                                                        <ArrowRight size={12} className="text-slate-200 group-hover:text-purple-600 transition-colors" />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'crisis' && config?.crisisKeywords && (
                            <motion.div
                                key="crisis"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="max-w-xl">
                                    <h4 className="text-3xl font-bold text-slate-900 tracking-tighter mb-2">Protocol Interruption</h4>
                                    <p className="text-slate-500 font-medium">Linguistic markers that immediately suspend standard heuristics for emergency response.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <Card className="p-8 bg-red-50/40 backdrop-blur-xl rounded-[2.5rem] border border-red-100/60 shadow-xl shadow-red-200/20">
                                        <h5 className="font-black text-red-700 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <AlertCircle size={14} /> Lethal Intent Mode
                                        </h5>
                                        <div className="flex flex-wrap gap-2.5">
                                            {config.crisisKeywords.suicideIntent.en.map((k, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-white/80 border border-red-50 text-red-600 text-xs rounded-xl font-bold shadow-sm">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </Card>
                                    <Card className="p-8 bg-orange-50/40 backdrop-blur-xl rounded-[2.5rem] border border-orange-100/60 shadow-xl shadow-orange-200/20">
                                        <h5 className="font-black text-orange-700 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <AlertCircle size={14} /> Physical Harm Markers
                                        </h5>
                                        <div className="flex flex-wrap gap-2.5">
                                            {config.crisisKeywords.selfHarm.en.map((k, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-white/80 border border-orange-50 text-orange-600 text-xs rounded-xl font-bold shadow-sm">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'global' && config?.globalTemplates && (
                            <motion.div
                                key="global"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="max-w-xl">
                                    <h4 className="text-3xl font-bold text-slate-900 tracking-tighter mb-2">Standard Heuristics</h4>
                                    <p className="text-slate-500 font-medium">Foundation responses for state-agnostic interactions.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Settings size={14} /> Fallback Protocols
                                        </h5>
                                        <div className="space-y-4">
                                            {config.globalTemplates.fallback.en.map((t, idx) => (
                                                <div key={idx} className="p-6 bg-white border border-white rounded-[1.5rem] text-xs font-medium text-slate-600 shadow-sm leading-relaxed border-l-4 border-l-purple-600 transition-all hover:shadow-md">
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Settings size={14} /> Interaction Headers
                                        </h5>
                                        <div className="space-y-4">
                                            {config.globalTemplates.greetings.en.map((t, idx) => (
                                                <div key={idx} className="p-6 bg-white border border-white rounded-[1.5rem] text-xs font-medium text-slate-600 shadow-sm leading-relaxed border-l-4 border-l-blue-600 transition-all hover:shadow-md">
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </div>
    );
};

export default AdminAIDashboard;
