import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    MessageSquare,
    TrendingUp,
    Shield,
    Activity,
    Brain,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import api from '../services/api';
import { Card } from '../components/UI';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [moodTrendData, setMoodTrendData] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/admin/analytics');
                if (response.data.success) {
                    const { analytics } = response.data;
                    setStats(analytics);

                    // Format mood trends for chart
                    const formattedTrends = Object.keys(analytics.moodTrends).map(key => ({
                        name: key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1),
                        value: analytics.moodTrends[key]
                    }));
                    setMoodTrendData(formattedTrends);
                }
            } catch (error) {
                console.error('Failed to fetch admin analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-purple-400/20 animate-pulse" />
                </div>
                <p className="text-slate-500 font-bold tracking-tight">Syncing clinical data...</p>
            </div>
        );
    }

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const overviewStats = [
        {
            label: 'Total Residents',
            value: stats?.totalUsers || 0,
            trend: '+12%',
            isUp: true,
            icon: Users,
            color: 'bg-blue-50 text-blue-600',
            glow: 'shadow-blue-200/50'
        },
        {
            label: 'Active Pulse',
            value: stats?.activeUsers || 0,
            trend: '+5%',
            isUp: true,
            icon: Activity,
            color: 'bg-green-50 text-green-600',
            glow: 'shadow-green-200/50'
        },
        {
            label: 'Stress Index',
            value: stats?.averageStressLevel || 0,
            trend: '-2%',
            isUp: false,
            icon: Brain,
            color: 'bg-purple-50 text-purple-600',
            glow: 'shadow-purple-200/50'
        },
        {
            label: 'Reflection Logs',
            value: stats?.totalMoodEntries || 0,
            trend: '+18%',
            isUp: true,
            icon: MessageSquare,
            color: 'bg-pink-50 text-pink-600',
            glow: 'shadow-pink-200/50'
        },
    ];

    return (
        <div className="space-y-10">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tighter mb-2">Platform Efficacy</h2>
                    <p className="text-slate-500 font-medium text-lg">Real-time health telemetry and engagement metrics.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-xl shadow-slate-200/40">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                    <span className="text-sm font-bold text-slate-700 tracking-tight uppercase tracking-widest">Protocol Active</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {overviewStats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] group hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${stat.color} ${stat.glow} shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                                    <Icon size={24} />
                                </div>
                                <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-black ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                    {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
                                </div>
                            </div>
                            <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.15em] mb-1">{stat.label}</h3>
                            <p className="text-4xl font-bold text-slate-900 tracking-tighter">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Mood Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-200/30" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-10 tracking-tight">Emotional Spectrum</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={moodTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                                />
                                <Bar dataKey="value" radius={[12, 12, 4, 4]}>
                                    {moodTrendData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Engagement Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-200/30" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-10 tracking-tight">Engagement Trajectory</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Mon', value: 400 },
                                { name: 'Tue', value: 300 },
                                { name: 'Wed', value: 600 },
                                { name: 'Thu', value: 800 },
                                { name: 'Fri', value: 500 },
                                { name: 'Sat', value: 900 },
                                { name: 'Sun', value: 1100 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
