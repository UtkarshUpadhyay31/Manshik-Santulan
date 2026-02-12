import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Home, Users, Heart, LayoutDashboard, HelpCircle } from 'lucide-react';
import { Button, Container } from './UI';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
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
                    <Link to="/dashboard">
                        <Button size="sm" className="rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                            Dashboard <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </Container>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-white/40 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 text-lg font-medium p-3 rounded-2xl transition-colors ${isActive(item.path)
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mt-2">
                        <Button className="w-full rounded-2xl bg-slate-900 text-white py-4">
                            Dashboard <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
