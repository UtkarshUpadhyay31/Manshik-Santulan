import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Heart, Brain, Activity, TrendingUp, Users, ArrowRight, ArrowLeft, User, ShieldCheck } from 'lucide-react';
import { Card, Container, Button } from '../components/UI';
import { useMoodStore } from '../context/store';
import { useAuth } from '../context/AuthContext';
import {
  getGuestMoodHistory,
  saveGuestMoodEntry,
} from '../utils/guestMode';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { todayMood, setTodayMood, moodHistory, setMoodHistory, suggestions, setSuggestions } = useMoodStore();
  const [isLoading, setIsLoading] = useState(true);
  const [mood, setMood] = useState('');
  const [emotion, setEmotion] = useState('');
  const [stressLevel, setStressLevel] = useState(5);
  const [description, setDescription] = useState('');

  // COLORS for charts
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#02e6ffff'];

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);

    if (isAuthenticated && user) {
      try {
        // Fetch from API
        const [historyRes, todayRes, suggestionRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/mood/history`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/mood/today`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/mood/suggestions`, { withCredentials: true })
        ]);

        if (historyRes.data.success) {
          setMoodHistory(historyRes.data.moodHistory);
        }

        if (todayRes.data.success && todayRes.data.moodEntry) {
          setTodayMood(todayRes.data.moodEntry);
        }

        if (suggestionRes.data.success) {
          setSuggestions(suggestionRes.data.suggestions);
        }

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    } else {
      // Guest Mode
      const guestHistory = getGuestMoodHistory();
      setMoodHistory(guestHistory);

      if (guestHistory.length > 0) {
        setTodayMood(guestHistory[guestHistory.length - 1]);
      }

      setSuggestions([
        { _id: '1', title: 'Deep Breathing', duration: '5', description: 'Take a moment to center yourself.', content: 'Box breathing technique.' },
        { _id: '2', title: 'Gratitude Journal', duration: '3', description: 'Write down 3 things you are grateful for.', content: 'Positive reflection.' }
      ]);
    }

    setIsLoading(false);
  };

  const handleSubmitMood = async (e) => {
    e.preventDefault();

    const moodData = {
      mood,
      emotion,
      stressLevel: parseInt(stressLevel),
      description,
      userId: user?.id || null
    };

    if (isAuthenticated) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/mood/entry`, {
          mood,
          emotion,
          stressLevel: parseInt(stressLevel),
          description,
          triggers: [], // Add fields if form expands
          activities: []
        }, { withCredentials: true });
      } catch (error) {
        console.error('Failed to save mood:', error);
        // Optionally show error toast
      }
    } else {
      saveGuestMoodEntry(moodData);
    }

    setMood('');
    setEmotion('');
    setStressLevel(5);
    setDescription('');

    if (isAuthenticated) {
      // Re-fetch to update charts and suggestions immediately
      loadDashboardData();
    } else {
      loadDashboardData();
    }
  };

  const moodDistribution = moodHistory.reduce((acc, entry) => {
    const existing = acc.find(item => item.name === entry.mood);
    if (existing) existing.value++;
    else acc.push({ name: entry.mood, value: 1 });
    return acc;
  }, []);

  const stressData = moodHistory.slice(-7).map((entry, i) => ({
    date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stress: entry.stressLevel
  }));

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Welcome back, {user?.firstName || 'Friend'}
              </h1>
              <p className="text-slate-500 font-medium">
                {isAuthenticated ? "You're logged in and synchronized." : "Guest Mode - Your data is stored locally."}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="secondary" className="gap-2 border-amber-200 text-amber-700 bg-amber-50">
                  <ShieldCheck size={18} /> Admin Panel
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-600"
            >
              <ArrowLeft className="w-4 h-4" /> Home
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Heart, label: 'Latest Mood', value: todayMood?.mood || 'Not recorded', color: 'text-red-500' },
            { icon: Brain, label: 'Avg Stress', value: moodHistory.length > 0 ? (moodHistory.reduce((sum, m) => sum + m.stressLevel, 0) / moodHistory.length).toFixed(1) : '-', color: 'text-purple-500' },
            { icon: Activity, label: 'Total Entries', value: moodHistory.length, color: 'text-green-500' },
            { icon: TrendingUp, label: 'Suggestions', value: suggestions.length, color: 'text-blue-500' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} whileHover={{ y: -5 }}>
                <Card className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{stat.value}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>



        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Entry Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <h2 className="text-2xl font-bold mb-6">How are you feeling?</h2>
              <form onSubmit={handleSubmitMood} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    required
                    className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select mood</option>
                    <option value="happy">Happy 😊</option>
                    <option value="excited">Excited 🤩</option>
                    <option value="content">Content 🙂</option>
                    <option value="neutral">Neutral 😐</option>
                    <option value="sad">Sad 😕</option>
                    <option value="tired">Tired 😴</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Emotion</label>
                  <select
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    required
                    className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select emotion</option>
                    <option value="calm">Calm</option>
                    <option value="stressed">Stressed</option>
                    <option value="anxious">Anxious</option>
                    <option value="happy">Happy</option>
                    <option value="frustrated">Frustrated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stress Level: {stressLevel}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(e.target.value)}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    rows="3"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Save Entry
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Charts */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-8">
            {/* Stress Trend */}
            {stressData.length > 0 ? (
              <Card>
                <h3 className="text-xl font-bold mb-4">Stress Trend (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="stress" stroke="#667eea" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            ) : (
              <Card className="text-center py-12 flex flex-col items-center justify-center h-64">
                <Activity className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No stress data available yet.</p>
              </Card>
            )}

            {/* Mood Distribution */}
            {moodDistribution.length > 0 && (
              <Card>
                <h3 className="text-xl font-bold mb-4">Mood Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={moodDistribution} cx="50%" cy="50%" labelLine={false} label dataKey="value" outerRadius={100}>
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Empty state */}
            {moodHistory.length === 0 && (
              <Card className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No mood entries yet</p>
                <p className="text-gray-400 text-sm">Start tracking your mood to see insights here</p>
              </Card>
            )}
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
