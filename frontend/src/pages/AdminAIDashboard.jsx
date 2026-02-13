import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Database, MessageSquare, AlertCircle, Save, Plus,
    Trash2, Search, TrendingUp, Users, Heart, AlertTriangle
} from 'lucide-react';
import { Button, Container } from '../components/UI';
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

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading AI Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <Container>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">AI Engine Admin</h1>
                        <p className="text-slate-500">Manage keywords, response templates, and monitor AI effectiveness.</p>
                    </div>
                    <Button
                        onClick={handleUpdateConfig}
                        className="bg-slate-900 text-white rounded-2xl px-8 flex items-center gap-2 hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                    >
                        <Save size={18} /> Deploy Changes
                    </Button>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total AI Sessions', value: analytics?.totalSessions || 0, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Avg Confidence', value: `${((analytics?.avgConfidence || 0) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Dominant Emotion', value: analytics?.topEmotion || 'None', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
                        { label: 'Crisis Triggers', value: analytics?.crisisCount || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                        >
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Main Config Area */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-100">
                        {['emotions', 'crisis', 'global'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-5 text-sm font-bold capitalize transition-all relative ${activeTab === tab
                                    ? 'text-slate-900'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="adminTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {activeTab === 'emotions' && config?.emotions && (
                            <div className="space-y-8">
                                <div className="flex gap-4 mb-6">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search emotions or keywords..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:bg-white transition-all text-sm"
                                        />
                                    </div>
                                    <Button className="bg-slate-100 text-slate-900 rounded-2xl px-6 font-bold text-sm">
                                        <Plus size={18} className="mr-2" /> Add Emotion
                                    </Button>
                                </div>

                                {config.emotions
                                    .filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((emotion, eIdx) => (
                                        <div key={eIdx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h4 className="text-xl font-bold text-slate-900 capitalize">{emotion.name}</h4>
                                                    <p className="text-slate-500 text-xs">Keywords and response templates for {emotion.name}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="bg-white text-red-500 border border-red-50 rounded-xl hover:bg-red-50">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Keywords */}
                                                <div className="space-y-4">
                                                    <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <Settings size={14} /> Keywords (English & Hindi)
                                                    </h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {emotion.keywords.en.map((k, kIdx) => (
                                                            <span key={kIdx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs flex items-center gap-2">
                                                                {k.word} <span className="text-[10px] text-slate-400">({k.weight})</span>
                                                            </span>
                                                        ))}
                                                        <button className="px-3 py-1.5 border border-dashed border-slate-300 rounded-xl text-[10px] text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all font-bold uppercase tracking-wider">
                                                            + Add
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Templates */}
                                                <div className="space-y-4">
                                                    <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <Database size={14} /> Response Count
                                                    </h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {['validation', 'reflection', 'insight', 'action', 'followup'].map((type) => (
                                                            <div key={type} className="p-4 bg-white rounded-2xl border border-slate-100">
                                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">{type}</p>
                                                                <p className="text-lg font-bold text-slate-900">{emotion.templates[type]?.en?.length || 0}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {activeTab === 'crisis' && config?.crisisKeywords && (
                            <div className="space-y-6">
                                <h4 className="text-xl font-bold text-slate-900">Crisis Intervention Training</h4>
                                <p className="text-slate-500 text-sm">Engine immediately triggers emergency mode if these keywords are detected.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                                        <h5 className="font-bold text-red-900 mb-4 flex items-center gap-2 underline underline-offset-4 decoration-red-200">
                                            <AlertCircle size={16} /> Suicide Intent (EN)
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {config.crisisKeywords.suicideIntent.en.map((k, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-white border border-red-100 text-red-700 text-xs rounded-xl font-medium">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                                        <h5 className="font-bold text-orange-900 mb-4 flex items-center gap-2 underline underline-offset-4 decoration-orange-200">
                                            <AlertCircle size={16} /> Self Harm (EN)
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {config.crisisKeywords.selfHarm.en.map((k, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-white border border-orange-100 text-orange-700 text-xs rounded-xl font-medium">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'global' && config?.globalTemplates && (
                            <div className="space-y-8">
                                <h4 className="text-xl font-bold text-slate-900">Universal Response Templates</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100">
                                        <h5 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                                            <Settings size={16} /> Fallback Responses
                                        </h5>
                                        <div className="space-y-3">
                                            {config.globalTemplates.fallback.en.map((t, idx) => (
                                                <div key={idx} className="p-4 bg-white rounded-2xl text-xs text-slate-600 border border-purple-100 shadow-sm leading-relaxed">
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                        <h5 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                                            <Settings size={16} /> Greetings
                                        </h5>
                                        <div className="space-y-3">
                                            {config.globalTemplates.greetings.en.map((t, idx) => (
                                                <div key={idx} className="p-4 bg-white rounded-2xl text-xs text-slate-600 border border-blue-100 shadow-sm leading-relaxed">
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default AdminAIDashboard;
