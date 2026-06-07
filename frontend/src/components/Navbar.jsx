import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, 
    Users, 
    Heart, 
    Brain, 
    Sparkles, 
    Gift, 
    HelpCircle, 
    LogOut, 
    ShieldCheck, 
    Gamepad2, 
    User, 
    MoreHorizontal, 
    X,
    ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Container } from './UI';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, isAuthenticated, isAdmin, user } = useAuth();
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);

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

    const bottomNavItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Wellness', path: '/wellness', icon: Sparkles },
        { label: 'Games', path: '/games', icon: Gamepad2 },
        { label: 'Rewards', path: '/rewards', icon: Gift },
        { label: 'Dashboard', path: '/dashboard', icon: User },
    ];

    const moreItems = [
        { label: 'Mentors', path: '/mentors', icon: Users },
        { label: 'Therapists', path: '/therapists', icon: Heart },
        { label: 'Help Now', path: '/help', icon: HelpCircle },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Desktop Top Navbar */}
            <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/60 backdrop-blur-xl border-b border-white/40 supports-[backdrop-filter]:bg-white/30 hidden md:block">
                <Container className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                        <img
                            src="/mainlogo.jpg"
                            alt="Manshik Santulan"
                            className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
                        />
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all hidden lg:inline">
                            Manshik Santulan
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="flex items-center gap-2 lg:gap-4 xl:gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-xs lg:text-sm font-bold px-3 py-1.5 rounded-full transition-all duration-300 ${
                                    isActive(item.path)
                                        ? 'bg-purple-50 text-purple-600'
                                        : 'text-slate-600 hover:bg-slate-55 hover:text-purple-600'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 lg:gap-4 border-l border-slate-200 pl-3 lg:pl-6 ml-1 lg:ml-2">
                                {isAdmin && (
                                    <Link to="/admin">
                                        <Button variant="ghost" size="sm" className="gap-1 lg:gap-2 text-amber-600 hover:bg-amber-50 text-xs px-2.5 lg:px-4">
                                            <ShieldCheck size={16} /> <span className="hidden lg:inline">Admin</span>
                                        </Button>
                                    </Link>
                                )}
                                <span className="text-xs font-semibold text-slate-700 hidden lg:block">
                                    Hi, {user?.firstName}
                                </span>
                                <Link to="/dashboard">
                                    <Button size="sm" className="rounded-full px-4 lg:px-6 text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all">
                                        Dashboard
                                    </Button>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-slate-500 hover:text-red-500 transition-colors p-1"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="text-slate-700 px-3 text-xs">
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" className="rounded-full px-4 text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </Container>
            </nav>

            {/* Mobile Top Header (Fixed top branding, md:hidden) */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2.5">
                    <img
                        src="/mainlogo.jpg"
                        alt="Manshik Santulan"
                        className="h-8 w-auto"
                    />
                    <span className="text-base font-bold tracking-tight text-slate-900">
                        Manshik Santulan
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <Link to="/dashboard">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                                {user?.firstName?.charAt(0)}
                            </div>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <Button size="sm" className="rounded-full px-3.5 py-1.5 bg-slate-900 text-white text-xs min-h-[32px] font-bold">
                                Log In
                            </Button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Mobile Fixed Floating Bottom Pill Navigation (md:hidden) */}
            <div className="md:hidden fixed bottom-5 left-4 right-4 z-50 max-w-md mx-auto">
                <div className="bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-full py-2 px-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center justify-between text-white">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const isCurrentActive = isActive(item.path);

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="flex-1 py-1"
                            >
                                <motion.div
                                    whileTap={{ scale: 0.85 }}
                                    className={`flex flex-col items-center justify-center transition-all duration-300 ${
                                        isCurrentActive ? 'text-purple-400 font-bold' : 'text-slate-400 font-medium'
                                    }`}
                                >
                                    <Icon size={20} className={isCurrentActive ? 'text-purple-400' : 'text-slate-400'} />
                                    <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* More tab button */}
                    <button
                        onClick={() => setMoreMenuOpen(true)}
                        className="flex-1 py-1"
                    >
                        <motion.div
                            whileTap={{ scale: 0.85 }}
                            className="flex flex-col items-center justify-center text-slate-400 font-medium transition-all duration-300"
                        >
                            <MoreHorizontal size={20} />
                            <span className="text-[10px] mt-1 tracking-tight">More</span>
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Mobile "More Options" sliding bottom sheet */}
            <AnimatePresence>
                {moreMenuOpen && (
                    <>
                        {/* Dimmed backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMoreMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90]"
                        />

                        {/* Bottom Sheet Drawer */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-[100] px-6 pt-8 pb-10 border-t border-slate-100 flex flex-col"
                        >
                            {/* Drag handle */}
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-900">Explore Options</h3>
                                <button onClick={() => setMoreMenuOpen(false)} className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={18} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {moreItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.label}
                                            to={item.path}
                                            onClick={() => setMoreMenuOpen(false)}
                                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-purple-50 hover:border-purple-200 transition-all active:scale-95 text-center group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 group-hover:text-purple-600 transition-colors">
                                                <Icon size={22} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 mt-2.5">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Auth controls on bottom sheet */}
                            <div className="border-t border-slate-100 pt-6">
                                {isAuthenticated ? (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 px-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                                                {user?.firstName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Logged in as</p>
                                                <p className="text-base font-bold text-slate-900 leading-none">{user?.firstName}</p>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <Link to="/admin" onClick={() => setMoreMenuOpen(false)} className="w-full">
                                                <Button variant="secondary" className="w-full text-amber-700 border-amber-200 bg-amber-50 py-3 rounded-xl text-sm font-bold">
                                                    <ShieldCheck size={18} /> Admin Panel
                                                </Button>
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                logout();
                                                setMoreMenuOpen(false);
                                            }}
                                            className="w-full py-4 text-red-500 font-bold flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-sm"
                                        >
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to="/login" onClick={() => setMoreMenuOpen(false)}>
                                            <Button variant="secondary" className="w-full py-3.5 rounded-xl text-sm font-bold">
                                                Log In
                                            </Button>
                                        </Link>
                                        <Link to="/signup" onClick={() => setMoreMenuOpen(false)}>
                                            <Button className="w-full py-3.5 rounded-xl text-sm font-bold">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
