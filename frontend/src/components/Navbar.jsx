import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Home, Users, Heart, LayoutDashboard, HelpCircle, LogOut, ShieldCheck, Brain, Gift, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Container } from './UI';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, isAuthenticated, isAdmin, user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Mentors', path: '/mentors', icon: Users },
        { label: 'Therapists', path: '/therapists', icon: Heart },
        { label: 'Games', path: '/games', icon: Brain },
        { label: 'Wellness', path: '/wellness', icon: Sparkles },
        { label: 'Rewards', path: '/rewards', icon: Gift },
        { label: 'Help Now', path: '/help', icon: HelpCircle },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/60 backdrop-blur-xl border-b border-white/40 supports-[backdrop-filter]:bg-white/30">
            <Container className="flex items-center justify-between h-20">
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/mainlogo.jpg"
                        alt="Manshik Santulan"
                        className="h-12 w-auto transition-transform group-hover:scale-105"
                    />
                    <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        Manshik Santulan
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`text-sm font-medium transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-purple-600 after:transition-all ${isActive(item.path)
                                ? 'text-purple-600 after:w-full'
                                : 'text-slate-600 hover:text-purple-600 after:w-0 hover:after:w-full'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4 border-l border-slate-200 pl-8 ml-4">
                            {isAdmin && (
                                <Link to="/admin">
                                    <Button variant="ghost" size="sm" className="gap-2 text-amber-600 hover:bg-amber-50">
                                        <ShieldCheck size={16} /> Admin
                                    </Button>
                                </Link>
                            )}
                            <span className="text-sm font-semibold text-slate-700">
                                Hi, {user?.firstName}
                            </span>
                            <Link to="/dashboard">
                                <Button size="sm" className="rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white transition-all">
                                    Dashboard
                                </Button>
                            </Link>
                            <button
                                onClick={logout}
                                className="text-slate-500 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="text-slate-700">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm" className="rounded-full px-6 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </Container>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="md:hidden fixed inset-0 z-[60] bg-white pt-24 px-6 flex flex-col gap-4 overflow-y-auto"
                    >
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 text-xl font-bold p-4 rounded-2xl transition-all ${isActive(item.path)
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon size={24} />
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="border-t border-slate-100 pt-8 mt-4 space-y-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                                            {user?.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logged in as</p>
                                            <p className="text-lg font-bold text-slate-900">{user?.firstName}</p>
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="secondary" className="w-full text-amber-700 border-amber-200 bg-amber-50">
                                                <ShieldCheck size={20} /> Admin Panel
                                            </Button>
                                        </Link>
                                    )}

                                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full py-5">
                                            Go to Dashboard <ArrowRight size={20} className="ml-2" />
                                        </Button>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full py-5 text-red-500 font-bold flex items-center justify-center gap-2 bg-red-50 rounded-2xl"
                                    >
                                        <LogOut size={20} /> Log Out
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="secondary" className="w-full py-5">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full py-5">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
