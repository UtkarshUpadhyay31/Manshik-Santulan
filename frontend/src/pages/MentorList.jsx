import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MessageCircle, Phone, ArrowLeft } from 'lucide-react';
import { Button, Container, Card, Input } from '../components/UI';
import api from '../services/api';

const MentorList = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: '', language: '' });

    useEffect(() => {
        fetchMentors();
    }, [filters]);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/professionals/mentors`, { params: filters });
            console.log('Mentors fetched:', res.data);
            setMentors(res.data.mentors || []);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            if (error.response) console.error('Response data:', error.response.data);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Career', 'Life', 'Relationship', 'Mental Wellness'];
    const languages = ['Hindi', 'English'];

    return (
        <div className="min-h-screen bg-[#FDFCFB] pt-20 sm:pt-24 pb-12 sm:pb-16">
            <Container>
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Find Your Mentor</h1>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex-1 min-w-[140px] sm:min-w-[200px]">
                        <label className="block text-xs sm:text-sm font-semibold text-slate-500 mb-2">Category</label>
                        <select
                            className="w-full p-2.5 sm:p-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 text-sm"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px] sm:min-w-[200px]">
                        <label className="block text-xs sm:text-sm font-semibold text-slate-500 mb-2">Language</label>
                        <select
                            className="w-full p-2.5 sm:p-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 text-sm"
                            value={filters.language}
                            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                        >
                            <option value="">All Languages</option>
                            {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>

                {/* Mentor Cards */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : mentors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                        <p className="text-xl text-slate-500">No mentors available for the selected filters.</p>
                        <Button variant="ghost" className="mt-4" onClick={() => setFilters({ category: '', language: '' })}>
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentors.map((mentor) => (
                            <motion.div
                                key={mentor._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card className="h-full bg-white border border-slate-100 shadow-lg shadow-slate-200/40 rounded-3xl p-5 sm:p-6 flex flex-col">
                                    <div className="flex flex-col min-[375px]:flex-row items-center min-[375px]:items-start gap-3 sm:gap-6 mb-6 text-center min-[375px]:text-left">
                                        <img
                                            src={mentor.photo}
                                            alt={mentor.name}
                                            className="w-16 h-16 min-[375px]:w-20 min-[375px]:h-20 rounded-2xl object-cover border-2 border-purple-100 flex-shrink-0"
                                        />
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{mentor.name}</h3>
                                            <p className="text-purple-600 font-semibold text-xs sm:text-sm">{mentor.category}</p>
                                            <div className="flex items-center justify-center min-[375px]:justify-start gap-1 mt-1 text-yellow-500 fill-yellow-500">
                                                <Star size={14} />
                                                <span className="text-xs sm:text-sm font-bold text-slate-700">{mentor.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8 flex-1">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <span className="font-semibold">Experience:</span> {mentor.experience} years
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium flex-wrap">
                                            {mentor.expertise && mentor.expertise.map(exp => (
                                                <span key={exp} className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">{exp}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Link to={`/professional/${mentor._id}?type=mentor`} className="flex-1">
                                            <Button className="w-full rounded-xl bg-slate-900 text-white">
                                                Book Call
                                            </Button>
                                        </Link>
                                        <Link to={`/session/${mentor._id}?type=mentor`} className="flex-1">
                                            <Button variant="secondary" className="w-full rounded-xl">
                                                Chat
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default MentorList;
