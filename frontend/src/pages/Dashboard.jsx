import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Heart, Brain, Activity, TrendingUp, Users, ArrowRight, ArrowLeft, User, ShieldCheck, Clock, CheckCircle, Calendar, Zap, Wind, Smile, UserPlus, Link2, Send, Mail, Phone, AlertTriangle, Gift } from 'lucide-react';
import { Card, Container, Button } from '../components/UI';
import AIEmotionMirror from '../components/AIEmotionMirror';
import StressBreathingPopup from '../components/StressBreathingPopup';
import { useMoodStore } from '../context/store';
import { useAuth } from '../context/AuthContext';
import { getGuestMoodHistory, saveGuestMoodEntry } from '../utils/guestMode';
import { shouldTriggerBreathing, INTERVENTION_MESSAGE } from '../utils/riskEngine';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { todayMood, setTodayMood, moodHistory, setMoodHistory, suggestions, setSuggestions } = useMoodStore();
  const [workHistory, setWorkHistory] = useState([]);
  const [gameStats, setGameStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [mood, setMood] = useState('');
  const [emotion, setEmotion] = useState('');
  const [stressLevel, setStressLevel] = useState(5);
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState('moods'); // 'moods' or 'activities'
  const [trustedContact, setTrustedContact] = useState({
    name: '',
    relation: '',
    email: '',
    phone: '',
    preferred: 'email'
  });
  const [trustedSaved, setTrustedSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [alertSettings, setAlertSettings] = useState({
    lastAlertedAt: null
  });
  const [showIntervention, setShowIntervention] = useState(false);
  const [interventionMsg, setInterventionMsg] = useState('');
  // COLORS for charts
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#02e6ffff'];
  const TRUSTED_CONTACT_KEY = 'trusted_contact_v1';
  const TRUSTED_ALERT_KEY = 'trusted_alert_settings_v1';
  const HIGH_STRESS_THRESHOLD = 7;
  const REQUIRED_DAYS = 7;

  useEffect(() => {
    loadDashboardData();
    loadTrustedContact();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);

    if (isAuthenticated && user) {
      try {
        // Fetch from API
        const [historyRes, todayRes, suggestionRes, workRes, gameRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/mood/history?fullHistory=true`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/mood/today`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/mood/suggestions`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/mood/work-history`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/games/stats`, { withCredentials: true })
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

        if (workRes.data.success) {
          setWorkHistory(workRes.data.workHistory);
        }

        if (gameRes.data.success) {
          setGameStats(gameRes.data.stats);
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

  const loadTrustedContact = () => {
    try {
      const stored = localStorage.getItem(TRUSTED_CONTACT_KEY);
      if (stored) {
        setTrustedContact(JSON.parse(stored));
      }
      const storedSettings = localStorage.getItem(TRUSTED_ALERT_KEY);
      if (storedSettings) {
        setAlertSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load trusted contact:', error);
    }
  };

  const persistTrustedContact = (nextContact) => {
    setTrustedContact(nextContact);
    setTrustedSaved(true);
    setShareStatus('');
    try {
      localStorage.setItem(TRUSTED_CONTACT_KEY, JSON.stringify(nextContact));
    } catch (error) {
      console.error('Failed to save trusted contact:', error);
    }
  };

  const persistAlertSettings = (nextSettings) => {
    setAlertSettings(nextSettings);
    try {
      localStorage.setItem(TRUSTED_ALERT_KEY, JSON.stringify(nextSettings));
    } catch (error) {
      console.error('Failed to save alert settings:', error);
    }
  };

  const buildAlertMessage = () => {
    const name = trustedContact.name || 'there';
    const userName = user?.firstName || 'your friend';
    const siteLink = `${window.location.origin}/help`;
    return `Hi ${name}, ${userName} added you as a trusted person on Manshik Santulan. If you receive this, please check in on them. Help page: ${siteLink}`;
  };

  const handleShareLink = async () => {
    const message = buildAlertMessage();
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(message);
        setShareStatus('Invite message copied.');
      } catch (error) {
        console.error('Failed to copy invite message:', error);
        setShareStatus('Copy failed. You can manually copy the message below.');
      }
    } else {
      window.prompt('Copy this invite message:', message);
    }
  };

  const handleSendAlert = () => {
    const message = buildAlertMessage();
    const subject = encodeURIComponent('Trusted Person Alert');
    const body = encodeURIComponent(message);
    if (trustedContact.preferred === 'sms' && trustedContact.phone) {
      window.location.href = `sms:${trustedContact.phone}?body=${body}`;
    } else if (trustedContact.email) {
      window.location.href = `mailto:${trustedContact.email}?subject=${subject}&body=${body}`;
    } else if (trustedContact.phone) {
      window.location.href = `sms:${trustedContact.phone}?body=${body}`;
    }

    const nextSettings = {
      ...alertSettings,
      lastAlertedAt: new Date().toISOString()
    };
    persistAlertSettings(nextSettings);
  };

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedReward, setEarnedReward] = useState(null);

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
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/mood/entry`, {
          mood,
          emotion,
          stressLevel: parseInt(stressLevel),
          description,
          triggers: [],
          activities: []
        }, { withCredentials: true });

        if (response.data.success && response.data.rewards?.tokensEarned > 0) {
          setEarnedReward(response.data.rewards);
          setShowRewardModal(true);
        }
      } catch (error) {
        console.error('Failed to save mood:', error);
      }
    } else {
      saveGuestMoodEntry(moodData);
    }

    setMood('');
    setEmotion('');
    setStressLevel(5);
    setDescription('');

    loadDashboardData();

    // Unified Risk Assessment
    if (shouldTriggerBreathing(mood, parseInt(stressLevel))) {
      setInterventionMsg(INTERVENTION_MESSAGE);
      setShowIntervention(true);
    }
  };

  const moodDistribution = moodHistory.reduce((acc, entry) => {
    const existing = acc.find(item => item.name === entry.mood);
    if (existing) existing.value++;
    else acc.push({ name: entry.mood, value: 1 });
    return acc;
  }, []);

  const stressData = moodHistory.slice().reverse().map((entry, i) => ({
    date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    stress: entry.stressLevel
  }));

  const highStressInfo = useMemo(() => {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - (REQUIRED_DAYS - 1));
    start.setHours(0, 0, 0, 0);

    const daily = new Map();
    moodHistory.forEach((entry) => {
      const timestamp = entry.timestamp || entry.createdAt || entry.updatedAt;
      const date = new Date(timestamp);
      if (Number.isNaN(date.getTime())) return;
      if (date < start) return;
      const key = date.toISOString().slice(0, 10);
      const current = daily.get(key) || { sum: 0, count: 0 };
      const level = Number(entry.stressLevel || 0);
      current.sum += level;
      current.count += 1;
      daily.set(key, current);
    });

    const averages = [];
    let missingDays = 0;
    for (let i = 0; i < REQUIRED_DAYS; i += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const key = day.toISOString().slice(0, 10);
      const data = daily.get(key);
      if (!data) {
        missingDays += 1;
        continue;
      }
      averages.push(data.sum / data.count);
    }

    const weekAverage = averages.length > 0
      ? averages.reduce((sum, value) => sum + value, 0) / averages.length
      : null;
    const isHighStressWeek = missingDays === 0 && averages.length === REQUIRED_DAYS && averages.every((value) => value >= HIGH_STRESS_THRESHOLD);
    const rangeLabel = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    return {
      isHighStressWeek,
      weekAverage,
      missingDays,
      rangeLabel
    };
  }, [moodHistory]);

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
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

        {/* Reward Modal */}
        <AnimatePresence>
          {showRewardModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400" />
                <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto mb-6">
                  <Zap size={40} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Awesome Job!</h3>
                <p className="text-slate-500 mb-6">You've earned some tokens for checking in today.</p>

                <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tokens</p>
                    <p className="text-3xl font-black text-slate-900">+{earnedReward?.tokensEarned}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Streak</p>
                    <p className="text-3xl font-black text-slate-900">{earnedReward?.streak}d</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="primary" className="w-full py-4 rounded-xl font-bold" onClick={() => setShowRewardModal(false)}>
                    Keep it up!
                  </Button>
                  <Link to="/rewards">
                    <Button variant="ghost" className="w-full text-purple-600 font-bold hover:bg-purple-50">
                      Go to Rewards <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {[
            { icon: Heart, label: 'Mood', value: todayMood?.mood || 'None', color: 'text-red-500' },
            { icon: Gift, label: 'Tokens', value: user?.tokens || 0, color: 'text-yellow-600', link: '/rewards' },
            { icon: Activity, label: 'Entries', value: moodHistory.length, color: 'text-green-500' },
            { icon: TrendingUp, label: 'Tips', value: suggestions.length, color: 'text-blue-500' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            const content = (
              <Card className={`text-center p-4 sm:p-6 ${stat.link ? 'hover:shadow-md hover:border-yellow-200 transition-all cursor-pointer' : ''}`}>
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-black text-gray-900 capitalize truncate">{stat.value}</p>
              </Card>
            );
            return (
              <motion.div key={i} whileHover={{ y: -5 }}>
                {stat.link ? <Link to={stat.link}>{content}</Link> : content}
              </motion.div>
            );
          })}
        </div>



        <div className="grid lg:grid-cols-3 gap-6">
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

        {/* Trusted Person Alert */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-emerald-600" />
                Trusted Person Alert
              </h2>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                Personal Safety
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-500 text-sm">
                  Add one trusted person and share an invite message. If your stress stays high for 7 days, you can send an alert quickly.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={trustedContact.name}
                      onChange={(e) => persistTrustedContact({ ...trustedContact, name: e.target.value })}
                      placeholder="Trusted person's name"
                      className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Relation</label>
                    <input
                      type="text"
                      value={trustedContact.relation}
                      onChange={(e) => persistTrustedContact({ ...trustedContact, relation: e.target.value })}
                      placeholder="Friend, sibling, mentor"
                      className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={trustedContact.email}
                      onChange={(e) => persistTrustedContact({ ...trustedContact, email: e.target.value })}
                      placeholder="name@email.com"
                      className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={trustedContact.phone}
                      onChange={(e) => persistTrustedContact({ ...trustedContact, phone: e.target.value })}
                      placeholder="+91 9XXXXXXXXX"
                      className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Alert Method</label>
                  <select
                    value={trustedContact.preferred}
                    onChange={(e) => persistTrustedContact({ ...trustedContact, preferred: e.target.value })}
                    className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleShareLink}
                    className="gap-2 w-full"
                  >
                    <Link2 size={18} /> Share Invite
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSendAlert}
                    disabled={!trustedContact.name || (!trustedContact.email && !trustedContact.phone)}
                    className="gap-2 w-full bg-emerald-600 border-none"
                  >
                    <Send size={18} />
                    {highStressInfo.isHighStressWeek ? 'Send Alert Now' : 'Send Test Alert'}
                  </Button>
                </div>
                {trustedSaved && (
                  <p className="text-xs text-emerald-600">Trusted person saved locally on this device.</p>
                )}
                {shareStatus && (
                  <p className="text-xs text-slate-500">{shareStatus}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${highStressInfo.isHighStressWeek ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className={`w-5 h-5 ${highStressInfo.isHighStressWeek ? 'text-red-600' : 'text-slate-400'}`} />
                    <p className="font-semibold text-slate-900">
                      {highStressInfo.isHighStressWeek ? 'High stress detected for 7 days' : 'Monitoring stress trends'}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Tracking window: {highStressInfo.rangeLabel}
                  </p>
                  <p className="text-sm text-slate-600">
                    {highStressInfo.weekAverage !== null
                      ? `Average stress: ${highStressInfo.weekAverage.toFixed(1)}/10`
                      : 'No stress data yet for the last 7 days.'}
                  </p>
                  {highStressInfo.missingDays > 0 && (
                    <p className="text-xs text-slate-500 mt-2">
                      Missing {highStressInfo.missingDays} day(s) of check-ins in the last week.
                    </p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
                      <Mail size={16} /> Email
                    </div>
                    <p className="text-xs text-slate-500">
                      {trustedContact.email || 'Add an email for alerts.'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
                      <Phone size={16} /> SMS
                    </div>
                    <p className="text-xs text-slate-500">
                      {trustedContact.phone || 'Add a phone number for alerts.'}
                    </p>
                  </div>
                </div>
                {alertSettings.lastAlertedAt && (
                  <p className="text-xs text-slate-500">
                    Last alert sent: {new Date(alertSettings.lastAlertedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Emotional Mirror */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <AIEmotionMirror />
        </motion.div>

        {/* Mind Training Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            Mind Training Progress
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { id: 'focus', title: 'Focus Tap', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
              { id: 'memory', title: 'Memory Flip', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
              { id: 'breathing', title: 'Emotion Balance Puzzle', icon: Wind, color: 'text-purple-500', bg: 'bg-purple-50' },
              { id: 'mood', title: 'Mood Catcher', icon: Smile, color: 'text-green-500', bg: 'bg-green-50' }
            ].map((game) => {
              const stats = gameStats[game.id] || { bestScore: 0, totalPlays: 0 };
              const Icon = game.icon;
              return (
                <Link key={game.id} to="/games">
                  <Card className="hover:shadow-md transition-shadow group cursor-pointer border-2 border-transparent hover:border-indigo-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${game.bg} ${game.color}`}>
                        <Icon size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900">{game.title}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Best Score</p>
                        <p className="text-lg font-bold text-slate-700">{stats.bestScore}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Plays</p>
                        <p className="text-lg font-bold text-slate-700">{stats.totalPlays}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* History Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-6 h-6 text-purple-600" />
                Your History
              </h2>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('moods')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'moods'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Mood Log
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'activities'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Past Work
                </button>
              </div>
            </div>

            {activeTab === 'moods' ? (
              <div className="space-y-4">
                {moodHistory.length > 0 ? (
                  moodHistory.map((entry) => (
                    <div key={entry._id} className="flex flex-col gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full shrink-0 ${entry.mood === 'happy' || entry.mood === 'excited' ? 'bg-green-100 text-green-600' :
                          entry.mood === 'sad' || entry.mood === 'tired' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                          <Heart size={20} fill="currentColor" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-slate-900 capitalize">{entry.mood}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-100 text-slate-500 capitalize font-medium">
                              {entry.emotion}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2">{entry.description || 'No notes added'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 text-[10px] sm:text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Activity size={14} className="text-slate-300" />
                          <span>Stress: {entry.stressLevel}/10</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-300" />
                          <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">No mood history available.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {workHistory.length > 0 ? (
                  workHistory.map((work) => (
                    <div key={work._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-start gap-4 mb-2 md:mb-0">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{work.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{work.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 pl-14 md:pl-0">
                        <span className="capitalize px-2 py-1 bg-white rounded border border-slate-200">{work.category}</span>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{new Date(work.completedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-slate-500">No completed activities yet.</p>
                    <p className="text-slate-400 text-sm">Complete AI suggestions to build your history!</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </Container>

      {/* Intervention Popup */}
      <StressBreathingPopup
        isOpen={showIntervention}
        onClose={() => setShowIntervention(false)}
        message={interventionMsg}
      />
    </div>
  );
};

export default Dashboard;
