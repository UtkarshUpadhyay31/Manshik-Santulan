import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Brain, TrendingUp, ArrowRight, Menu, X, Activity, Users, Star, UserCheck, LayoutDashboard, Sparkles } from 'lucide-react';
import { Button, Container, Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StressBreathingPopup from '../components/StressBreathingPopup';
import MoodModal from '../components/modals/MoodModal';
import AICoachModal from '../components/modals/AICoachModal';
import { saveGuestMoodEntry, getGuestMoodHistory } from '../utils/guestMode';
import { INTERVENTION_MESSAGE } from '../utils/riskEngine';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moodModalOpen, setMoodModalOpen] = useState(false);
  const [coachModalOpen, setCoachModalOpen] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);

  // State for featured content
  const [featuredMentors, setFeaturedMentors] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [recentMoods, setRecentMoods] = useState([]);

  // Mood Tracker State
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  const fetchFeaturedContent = async () => {
    try {
      console.log('Fetching featured experts from:', api.defaults.baseURL);
      const mentorRes = await api.get('/professionals/mentors');
      const doctorRes = await api.get('/professionals/doctors');
      console.log('API Response (Mentors):', mentorRes.data);
      console.log('API Response (Doctors):', doctorRes.data);
      setFeaturedMentors(mentorRes.data.mentors?.slice(0, 2) || []);
      setFeaturedDoctors(doctorRes.data.doctors?.slice(0, 2) || []);
    } catch (error) {
      console.error('Error fetching featured content:', error);
    }
  };

  useEffect(() => {
    // Load recent moods for history preview
    setRecentMoods(getGuestMoodHistory().slice(-7));
    fetchFeaturedContent();
  }, [moodSubmitted]);

  const handleMoodSelect = (moodValue) => {
    setSelectedMood(moodValue);
    const moodEntry = {
      mood: moodValue,
      emotion: moodValue, // Simplified for quick check
      stressLevel: 5,
      description: 'Quick check-in'
    };
    saveGuestMoodEntry(moodEntry);
    setMoodSubmitted(true);
    setTimeout(() => setMoodSubmitted(false), 3000); // Reset for nice UX
    setMoodModalOpen(true); // Open full modal for details/feedback if they want, or just show success
  };

  const handleActionClick = (actionId) => {
    switch (actionId) {
      case 'breathing':
        setShowBreathing(true);
        break;
      case 'mood':
        setMoodModalOpen(true);
        break;
      case 'coach':
        setCoachModalOpen(true);
        break;
      default:
        // Check if item has a path for navigation
        const ritual = [
          { title: "Mentor Connect", icon: Users, desc: "Get professional guidance", color: "indigo", path: '/mentors', time: "15 min" },
          { title: "Therapy Connect", icon: Heart, desc: "Professional mental support", color: "teal", path: '/therapists', time: "30 min" }
        ].find(r => r.path && actionId === r.title);

        if (ritual) {
          navigate(ritual.path);
        }
        break;
    }
  };

  const moods = [
    { emoji: '😢', label: 'Rough', value: 'sad' },
    { emoji: '😕', label: 'Meh', value: 'neutral' },
    { emoji: '🙂', label: 'Okay', value: 'content' },
    { emoji: '😊', label: 'Good', value: 'happy' },
    { emoji: '🤩', label: 'Great', value: 'excited' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
      {/* Abstract Background - Enhanced smoothness */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-50/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation removed - handled by global Navbar component */}

      {/* Main Content Area */}
      <div className="relative z-10 pt-16 pb-6 lg:pt-20 lg:pb-10">

        {/* Hero Section */}
        <Container className="mb-10 md:mb-14" id="overview">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-purple-100 shadow-sm mb-4 text-xs font-semibold text-purple-700 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
              </span>
              Over 10,000+ daily check-ins this week
            </motion.div>

            {/* Logo */}
            <motion.div variants={itemVariants} className="mb-4">
              <img
                src="/mainlogo.jpg"
                alt="Manshik Santulan Logo"
                className="h-16 sm:h-20 md:h-24 w-auto mx-auto drop-shadow-md"
              />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-4"
            >
              Support your mind,<br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-300% animate-gradient">
                find your balance.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 max-w-xl leading-relaxed">
              A safe, compassionate space to track your emotions, build resilience, and find your inner calm.
            </motion.p>

            {/* Premium Mood Selector Interface */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] border border-white/50 relative overflow-hidden group hover:shadow-[0_30px_80px_-20px_rgba(124,58,237,0.15)] transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-slate-800">How are you feeling right now?</h2>

              <div className="flex justify-between items-center sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-3 sm:pb-0 px-1 no-scrollbar">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => handleMoodSelect(m.value)}
                    className="flex flex-col items-center gap-2.5 min-w-[56px] sm:min-w-[70px] group/btn transition-all duration-300 p-1 rounded-xl hover:bg-white hover:shadow-md hover:-translate-y-1 relative animate-none"
                  >
                    <span className="text-3xl sm:text-4xl md:text-5xl filter grayscale group-hover/btn:grayscale-0 transition-all duration-300 transform group-hover/btn:scale-105 drop-shadow-sm">
                      {m.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-400 group-hover/btn:text-slate-800 transition-colors">
                      {m.label}
                    </span>
                    {selectedMood === m.value && (
                      <motion.div layoutId="mood-ring" className="absolute inset-0 border-2 border-purple-500 rounded-xl" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-5 sm:pt-8 border-t border-slate-100">
                <Button onClick={() => setShowBreathing(true)} className="w-full sm:w-auto rounded-full px-6 py-4 text-sm sm:px-8 sm:py-5 sm:text-base bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                  Start Breathing
                </Button>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full rounded-full px-6 py-4 text-sm sm:px-8 sm:py-5 sm:text-base gap-2 group">
                      <LayoutDashboard size={18} className="text-purple-600" /> Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full rounded-full px-6 py-4 text-sm sm:px-8 sm:py-5 sm:text-base gap-2 group">
                      Join Manshik <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>

          </motion.div>

          {/* History Ribbon */}
          {recentMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm mx-auto">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Recent Flow</span>
                <div className="flex gap-2 items-end h-8">
                  {recentMoods.map((m, i) => (
                    <div
                      key={i}
                      className="w-2 rounded-full bg-gradient-to-b from-purple-400 to-blue-400 opacity-60 hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                      title={new Date(m.timestamp).toLocaleDateString()}
                      style={{ height: `${Math.random() * 100}%`, minHeight: '20%' }}
                    />
                  ))}
                </div>
                <Link to="/dashboard" className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline">VIEW ALL</Link>
              </div>
            </motion.div>
          )}
        </Container>

        {/* Daily Actions Section - Refined */}
        <section id="actions" className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none" />
          <Container className="relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Today's Rituals</h2>
                <p className="text-lg text-slate-600">Small, intentional actions to ground yourself. Pick one to start.</p>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: "Morning Check-in", icon: Activity, desc: "Quick emotional weather report", color: "blue", action: 'mood', time: "1 min", styles: { bg: 'bg-blue-50', text: 'text-blue-600' } },
                { title: "Breathing Space", icon: Heart, desc: "Box breathing for instant calm", color: "purple", action: 'breathing', time: "4 min", styles: { bg: 'bg-purple-50', text: 'text-purple-600' } },
                { title: "Mentor Connect", icon: Users, desc: "Get professional guidance", color: "indigo", path: '/mentors', time: "15 min", styles: { bg: 'bg-indigo-50', text: 'text-indigo-600' } },
                { title: "Therapy Connect", icon: Heart, desc: "Professional mental support", color: "teal", path: '/therapists', time: "30 min", styles: { bg: 'bg-teal-50', text: 'text-teal-600' } },
                { title: "Reflection", icon: Brain, desc: "Unpack your thoughts safely", color: "pink", action: 'coach', time: "5 min", styles: { bg: 'bg-pink-50', text: 'text-pink-600' } }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -8 }}
                    className="group p-1"
                  >
                    <div className="bg-white rounded-[2rem] p-8 h-full border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${item.styles.text}`}>
                        <Icon size={120} />
                      </div>

                      <div className={`w-14 h-14 rounded-2xl ${item.styles.bg} flex items-center justify-center mb-6 ${item.styles.text} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={28} />
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                        <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600">{item.time}</span>
                      </div>

                      <p className="text-slate-500 mb-8 leading-relaxed">{item.desc}</p>

                      <Button
                        onClick={() => item.path ? navigate(item.path) : handleActionClick(item.action)}
                        variant="secondary"
                        className="w-full justify-between group-hover:bg-slate-900 group-hover:text-white transition-colors"
                      >
                        Start <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Healing & Wellness Premium Hub Promo Banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-12 md:mt-16 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-[2.5rem] blur-xl" />
              <div className="bg-white/80 backdrop-blur-xl border border-emerald-100/30 rounded-[2.5rem] p-8 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(16,185,129,0.12)] transition-all duration-500 group">
                {/* Subtle light leak blobs */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl group-hover:bg-emerald-200/30 transition-all duration-500" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl group-hover:bg-indigo-200/30 transition-all duration-500" />
                
                <div className="space-y-4 max-w-2xl relative z-10 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                    <Sparkles size={14} className="animate-pulse" /> PREMIUM MODULE
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                    Healing & Wellness Hub
                  </h3>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                    Restore your mind's natural equilibrium. Explore mental health yoga, ayurvedic guidance, natural precautions, and interactive calming sound spaces.
                  </p>
                </div>
                
                <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
                  <Button
                    onClick={() => navigate('/wellness')}
                    className="w-full md:w-auto rounded-full px-8 py-5 text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold group"
                  >
                    Start Healing Journey
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Featured Selection Section */}
            {(featuredMentors.length > 0 || featuredDoctors.length > 0) && (
              <div className="mt-16 md:mt-24">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Experts</h2>
                  <p className="text-slate-500 text-lg">Verified professionals ready to support your journey.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Show Mentors */}
                  {featuredMentors.map(mentor => (
                    <motion.div key={mentor._id} whileHover={{ y: -5 }}>
                      <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 h-full flex flex-col">
                        <img src={mentor.photo} alt={mentor.name} className="w-full h-40 rounded-2xl object-cover mb-4" />
                        <h4 className="font-bold text-slate-900 mb-1">{mentor.name}</h4>
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4">{mentor.category}</p>
                        <div className="flex items-center gap-1 text-yellow-500 mb-6 mt-auto">
                          <Star size={14} className="fill-current" />
                          <span className="text-sm font-bold text-slate-700">{mentor.rating}</span>
                        </div>
                        <Button
                          onClick={() => navigate(`/professional/${mentor._id}?type=mentor`)}
                          variant="secondary"
                          size="sm"
                          className="w-full rounded-xl"
                        >
                          View Profile
                        </Button>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Show Doctors */}
                  {featuredDoctors.map(doctor => (
                    <motion.div key={doctor._id} whileHover={{ y: -5 }}>
                      <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 h-full flex flex-col">
                        <div className="relative">
                          <img src={doctor.photo} alt={doctor.name} className="w-full h-40 rounded-2xl object-cover mb-4" />
                          {doctor.verified && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                              <UserCheck size={12} />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">{doctor.name}</h4>
                        <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-4">{doctor.qualification}</p>
                        <div className="flex items-center gap-1 text-yellow-500 mb-6 mt-auto">
                          <Star size={14} className="fill-current" />
                          <span className="text-sm font-bold text-slate-700">{doctor.rating}</span>
                        </div>
                        <Button
                          onClick={() => navigate(`/professional/${doctor._id}?type=doctor`)}
                          variant="primary"
                          size="sm"
                          className="w-full rounded-xl"
                        >
                          Connect Now
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>

        {/* Mental Wellness Games Section */}
        <section className="py-16 md:py-20 relative bg-gradient-to-b from-white/50 to-transparent">
          <Container>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-medium mb-6">
                <Brain size={16} />
                Interactive Wellness
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Mental Wellness Games</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Engage your mind with science-backed games designed to reduce stress, improve focus, and boost your mood.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  title: "Focus Tap",
                  desc: "Test your reflexes and sharpen your concentration",
                  icon: "🎯",
                  color: "amber",
                  path: "/games/focus",
                  time: "60 sec",
                  styles: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' }
                },
                {
                  title: "Memory Flip",
                  desc: "Challenge your memory with matching pairs",
                  icon: "🧠",
                  color: "purple",
                  path: "/games/memory",
                  time: "5 min",
                  styles: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' }
                },
                {
                  title: "Emotion Balance Puzzle",
                  desc: "Balance your thoughts on a scale. Train emotional stability.",
                  icon: "⚖️",
                  color: "purple",
                  path: "/games/breathing",
                  time: "90 sec",
                  styles: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' }
                },
                {
                  title: "Mood Catcher",
                  desc: "Catch positive vibes and boost your spirits",
                  icon: "😊",
                  color: "green",
                  path: "/games/mood",
                  time: "60 sec",
                  styles: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
                }
              ].map((game, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <div className={`bg-white rounded-3xl p-8 h-full border-2 ${game.styles.border} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${game.styles.bg} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity`} />

                    <div className="relative z-10">
                      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {game.icon}
                      </div>

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-slate-900">{game.title}</h3>
                        <span className={`text-xs font-bold px-3 py-1 ${game.styles.bg} rounded-full ${game.styles.text}`}>
                          {game.time}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        {game.desc}
                      </p>

                      <Button
                        onClick={() => navigate(game.path)}
                        variant="secondary"
                        className={`w-full justify-center group-hover:bg-gradient-to-r group-hover:from-${game.color}-500 group-hover:to-${game.color}-600 group-hover:text-white group-hover:border-transparent transition-all`}
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/games">
                <Button
                  size="lg"
                  className="rounded-full px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group"
                >
                  Explore All Games
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Insight Feature - Immersive */}
        <section className="py-12 md:py-16">
          <Container>
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-center md:text-left">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20" />

              <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-purple-300 text-sm font-medium mb-6">
                    <Brain size={14} /> Daily Insight
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                    "You seem 30% calmer after breathing exercises."
                  </h2>
                  <p className="text-slate-300 text-lg mb-10 max-w-lg leading-relaxed">
                    Our anonymous AI notices patterns in your mood that you might miss. No data leaves your browser.
                  </p>
                  <Link to="/dashboard">
                    <Button className="bg-white text-slate-900 hover:bg-purple-50 px-8 py-4 h-auto rounded-xl text-lg font-semibold shadow-lg shadow-white/10">
                      View Your Insights
                    </Button>
                  </Link>
                </div>

                <div className="relative hidden md:block">
                  {/* Abstract visualization or glass card */}
                  <div className="aspect-square rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="text-center">
                      <TrendingUp size={64} className="text-purple-400 mx-auto mb-4" />
                      <div className="text-white font-bold text-xl">Privacy First</div>
                      <div className="text-white/60 text-sm">Your data stays with you.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

      </div>


      {/* Modals */}
      <StressBreathingPopup
        isOpen={showBreathing}
        onClose={() => setShowBreathing(false)}
        message={INTERVENTION_MESSAGE}
      />
      <MoodModal isOpen={moodModalOpen} onClose={() => setMoodModalOpen(false)} />
      <AICoachModal isOpen={coachModalOpen} onClose={() => setCoachModalOpen(false)} />
    </div>
  );
};

export default Landing;
