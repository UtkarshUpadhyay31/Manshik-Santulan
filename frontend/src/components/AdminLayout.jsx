import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UsersRound,
    BookOpen,
    BarChart3,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Bell,
    Search,
    Settings,
    Shield,
    Sparkles,
    ArrowLeft,
    MonitorDot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Professionals', icon: UsersRound, path: '/admin/mentors' },
        { name: 'Content', icon: BookOpen, path: '/admin/blogs' },
        { name: 'Reports', icon: BarChart3, path: '/admin/analytics' },
        { name: 'AI Engine', icon: Sparkles, path: '/admin/ai-coach' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-slate-800 font-sans flex overflow-hidden selection:bg-purple-100 selection:text-purple-900 relative">
            {/* Abstract Background Blobs - Mirroring Landing Page Precisely */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-50/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
            </div>

            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 300 : 96 }}
                className="hidden md:flex flex-col bg-white/70 backdrop-blur-3xl border-r border-white/50 relative z-30 transition-all duration-500 ease-in-out shadow-[20px_0_40px_-15px_rgba(0,0,0,0.02)]"
            >
                <div className="p-8 flex items-center gap-4">
                    <Link to="/" className="relative flex-shrink-0 group">
                        <div className="absolute inset-0 bg-purple-200 blur-xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full" />
                        <img
                            src="/mainlogo.jpg"
                            alt="Logo"
                            className="w-12 h-12 rounded-2xl shadow-xl shadow-slate-200 border border-white relative z-10 hover:scale-105 active:scale-95 transition-transform"
                        />
                    </Link>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <span className="font-extrabold text-xl text-slate-900 leading-none tracking-tighter">Manshik</span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <MonitorDot size={10} className="text-purple-600 animate-pulse" />
                                <span className="text-[10px] font-black text-purple-600 tracking-[0.2em] uppercase">Control Center</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                <nav className="flex-1 px-5 space-y-3 mt-8">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-300 group relative
                                ${isActive
                                    ? 'bg-slate-900 text-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.2)] scale-[1.02]'
                                    : 'text-slate-500 hover:text-purple-600 hover:bg-white/60'}
                            `}
                        >
                            <item.icon size={20} className={`flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? '' : 'mx-auto'} ${isSidebarOpen ? 'group-hover:scale-110' : ''}`} />
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-bold text-sm tracking-tight"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                            {isSidebarOpen && (
                                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            )}

                            {/* Active Indicator Bar */}
                            <AnimatePresence>
                                <NavLink to={item.path} className={({ isActive }) => isActive ? "absolute left-[-1.25rem] w-1.5 h-8 bg-purple-600 rounded-r-full shadow-[0_0_15px_rgba(124,58,237,0.6)]" : "hidden"} />
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="bg-white/60 border border-white/80 rounded-[2.5rem] p-5 shadow-sm group hover:shadow-md transition-all">
                        {isSidebarOpen ? (
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white font-black shadow-xl border border-slate-700">
                                    {user?.firstName?.[0] || 'A'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-black text-slate-900 truncate leading-tight">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-[10px] text-purple-600 font-black uppercase tracking-[0.1em] mt-0.5">Global Admin</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center mb-5">
                                <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black shadow-xl">
                                    {user?.firstName?.[0] || 'A'}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={logout}
                            className={`
                                flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-black tracking-tight
                                ${!isSidebarOpen && 'justify-center'}
                            `}
                        >
                            <LogOut size={18} />
                            {isSidebarOpen && <span>Exit Console</span>}
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Top Header - Glassmorphism Enhanced */}
                <header className="h-24 flex items-center justify-between px-10 bg-white/40 backdrop-blur-2xl border-b border-white/50 sticky top-0 z-20">
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 text-slate-900 bg-white shadow-xl rounded-2xl border border-white">
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <img src="/mainlogo.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow-md" />
                            <span className="font-black text-lg text-slate-900 tracking-tighter">Manshik</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 bg-white/90 border border-white px-6 py-3.5 rounded-3xl w-full max-w-lg focus-within:ring-[6px] focus-within:ring-purple-500/5 focus-within:border-purple-500/30 transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)] group/search">
                        <Search size={18} className="text-slate-400 group-focus-within/search:text-purple-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search patients, experts, or analytics..."
                            className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-900 placeholder:text-slate-400"
                        />
                        <div className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 tracking-widest uppercase">Alt+K</div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex flex-col items-end mr-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server Uptime</span>
                            <span className="text-xs font-bold text-green-600">99.98% Stable</span>
                        </div>
                        <button className="relative w-14 h-14 flex items-center justify-center text-slate-500 hover:text-purple-600 transition-all bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-white hover:shadow-2xl hover:-translate-y-0.5 group">
                            <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-4 right-4 w-3 h-3 bg-purple-600 rounded-full border-[3px] border-white shadow-[0_0_10px_rgba(124,58,237,0.4)]"></span>
                        </button>
                        <button className="relative w-14 h-14 flex items-center justify-center text-slate-500 hover:text-purple-600 transition-all bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-white hover:shadow-2xl hover:-translate-y-0.5 group">
                            <Settings size={22} className="group-hover:rotate-45 transition-transform" />
                        </button>
                    </div>
                </header>

                {/* Viewport */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar relative z-10 scroll-smooth">
                    <Outlet />
                    {/* Subtle Brand Watermark */}
                    <div className="opacity-[0.03] fixed bottom-10 right-10 pointer-events-none select-none">
                        <img src="/mainlogo.jpg" alt="Watermark" className="w-64 grayscale" />
                    </div>
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-50 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white/90 backdrop-blur-3xl w-80 h-full p-8 flex flex-col shadow-2xl border-r border-white/50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <img src="/mainlogo.jpg" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                                    <span className="font-extrabold text-2xl text-slate-900 tracking-tighter">Manshik</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-3">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all font-black tracking-tight
                                            ${isActive ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-500 hover:bg-slate-50'}
                                        `}
                                    >
                                        <item.icon size={22} />
                                        <span className="text-base">{item.name}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            <button
                                onClick={logout}
                                className="flex items-center gap-4 px-6 py-5 rounded-[2rem] text-red-600 bg-red-50 hover:bg-red-100 transition-all mt-auto border border-red-100 font-black"
                            >
                                <LogOut size={22} />
                                <span className="text-base">Logout</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLayout;
