import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Trash2,
    ShieldAlert,
    ShieldCheck,
    Search,
    Filter,
    MoreVertical,
    Plus,
    BookOpen,
    UserCheck,
    Star,
    FileText,
    Download,
    Calendar,
    Loader2,
    ExternalLink,
    Ban,
    ArrowRight,
    Brain,
    Zap,
    Wind,
    Smile
} from 'lucide-react';
import { Button, Card } from '../components/UI';
import api from '../services/api';

// --- Manage Users View ---
export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const endpoint = currentStatus ? 'deactivate' : 'reactivate';
            const response = await api.put(`/admin/users/${userId}/${endpoint}`);
            if (response.data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user and all their data?')) return;
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            if (response.data.success) {
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-purple-600" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">User Community</h2>
                    <p className="text-slate-500 font-medium">Review, moderate and safeguard user accounts.</p>
                </div>
                <div className="relative group w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md border border-white rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 w-full md:w-64 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 overflow-hidden shadow-xl shadow-slate-200/40 relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/30 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Identity</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Persistence</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Verification</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Clearance</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-[0.15em] text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-purple-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-700 font-bold border border-white shadow-sm transition-transform group-hover:scale-105">
                                                {u.firstName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm tracking-tight">{u.firstName} {u.lastName}</p>
                                                <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-600 tracking-tight">
                                        {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm border ${u.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {u.isActive ? 'Compliant' : 'Restricted'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-bold text-slate-600 px-3 py-1 bg-slate-100/80 rounded-lg uppercase tracking-wider border border-white">{u.role}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleToggleStatus(u._id, u.isActive)}
                                                className={`p-2.5 rounded-xl transition-all shadow-sm ${u.isActive ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100' : 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-100'}`}
                                                title={u.isActive ? 'Restrict Access' : 'Restore Access'}
                                            >
                                                {u.isActive ? <Ban size={18} /> : <UserCheck size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all shadow-sm"
                                                title="Purge Data"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Users size={40} />
                        </div>
                        <p className="text-slate-400 font-bold tracking-tight">No matching entities found.</p>
                        <p className="text-slate-300 text-sm">Refine your search parameters.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

// --- Manage Mentors View ---
export const AdminMentors = () => {
    const [mentors, setMentors] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'mentor',
        name: '',
        photo: '',
        category: 'Life',
        qualification: '',
        specialization: '',
        experience: 0,
        expertise: '',
        therapyType: ''
    });

    const handleCreateProfessional = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                expertise: formData.type === 'mentor' && formData.expertise ? formData.expertise.split(',').map(s => s.trim()) : undefined,
                therapyType: formData.type === 'doctor' && formData.therapyType ? formData.therapyType.split(',').map(s => s.trim()) : undefined
            };

            const response = await api.post('/admin/professionals', payload);
            if (response.data.success) {
                if (formData.type === 'mentor') {
                    setMentors([response.data.professional, ...mentors]);
                } else {
                    setDoctors([response.data.professional, ...doctors]);
                }
                setIsModalOpen(false);
                setFormData({
                    type: 'mentor',
                    name: '',
                    photo: '',
                    category: 'Life',
                    qualification: '',
                    specialization: '',
                    experience: 0,
                    expertise: '',
                    therapyType: ''
                });
            }
        } catch (error) {
            console.error('Error creating professional:', error);
            alert('Failed to create professional');
        }
    };


    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        try {
            const response = await api.get('/admin/professionals');
            if (response.data.success) {
                setMentors(response.data.mentors);
                setDoctors(response.data.doctors);
            }
        } catch (error) {
            console.error('Error fetching professionals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleProStatus = async (id, type, currentStatus) => {
        try {
            const body = type === 'mentor' ? { isActive: !currentStatus } : { verified: !currentStatus };
            const response = await api.put(`/admin/professionals/${type}/${id}`, body);
            if (response.data.success) {
                if (type === 'mentor') {
                    setMentors(mentors.map(m => m._id === id ? { ...m, isActive: !currentStatus } : m));
                } else {
                    setDoctors(doctors.map(d => d._id === id ? { ...d, verified: !currentStatus } : d));
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-purple-600" /></div>;

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Expert Verification</h2>
                    <p className="text-slate-500 font-medium">Coordinate and authorize peer mentors & clinical experts.</p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    className="gap-2 bg-slate-900 shadow-xl shadow-slate-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} /> Onboard Expert
                </Button>
            </div>

            {/* Create Professional Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold mb-6">Onboard New Expert</h3>
                            <form onSubmit={handleCreateProfessional} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border rounded-xl"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="mentor">Peer Mentor</option>
                                        <option value="doctor">Clinical Expert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border rounded-xl"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Photo URL</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-xl"
                                        value={formData.photo}
                                        onChange={e => setFormData({ ...formData, photo: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2 border rounded-xl"
                                        value={formData.experience}
                                        onChange={e => setFormData({ ...formData, experience: Number(e.target.value) })}
                                    />
                                </div>

                                {formData.type === 'mentor' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Category</label>
                                            <select
                                                className="w-full p-2 border rounded-xl"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="Career">Career</option>
                                                <option value="Life">Life</option>
                                                <option value="Relationship">Relationship</option>
                                                <option value="Mental Wellness">Mental Wellness</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Expertise (Comma separated)</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded-xl"
                                                value={formData.expertise}
                                                onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                                                placeholder="Stress, anxiety, resume building"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Qualification</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 border rounded-xl"
                                                value={formData.qualification}
                                                onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                                                placeholder="MD, PhD, etc."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Specialization</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 border rounded-xl"
                                                value={formData.specialization}
                                                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                                placeholder="Clinical Psychologist"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Therapy Types (Comma separated)</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded-xl"
                                                value={formData.therapyType}
                                                onChange={e => setFormData({ ...formData, therapyType: e.target.value })}
                                                placeholder="CBT, DBT, etc."
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary">Create</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Mentors Table */}
                <Card className="bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white/40 overflow-hidden shadow-xl shadow-slate-200/40">
                    <div className="p-8 border-b border-slate-100/50 bg-slate-50/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                                <Users size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 tracking-tight">Peer Mentors</h3>
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 px-3 py-1 bg-purple-50 rounded-full border border-purple-100">{mentors.length} Verified</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-100/50">
                                {mentors.map(m => (
                                    <tr key={m._id} className="hover:bg-purple-50/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img src={m.photo} alt={m.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform" />
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900 tracking-tight">{m.name}</p>
                                                    <p className="text-[10px] text-purple-600 uppercase font-bold tracking-[0.1em]">{m.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-xl w-fit border border-amber-100 shadow-sm">
                                                <Star size={12} className="fill-current" />
                                                <span className="text-xs font-bold">{m.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleToggleProStatus(m._id, 'mentor', m.isActive)}
                                                className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all border shadow-sm ${m.isActive ? 'text-green-700 bg-green-50 border-green-100' : 'text-slate-500 bg-slate-100 border-slate-200'}`}
                                            >
                                                {m.isActive ? 'OPERATIONAL' : 'STANDBY'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Doctors Table */}
                <Card className="bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white/40 overflow-hidden shadow-xl shadow-slate-200/40">
                    <div className="p-8 border-b border-slate-100/50 bg-slate-50/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                                <UserCheck size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 tracking-tight">Clinical Experts</h3>
                        </div>
                        <span className="text-[10px] font-bold text-teal-600 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">{doctors.length} Authorized</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-100/50">
                                {doctors.map(d => (
                                    <tr key={d._id} className="hover:bg-teal-50/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img src={d.photo} alt={d.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform" />
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900 tracking-tight">{d.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight line-clamp-1">{d.qualification}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`text-[10px] font-bold px-4 py-1.5 rounded-full inline-block border shadow-sm ${d.verified ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                {d.verified ? 'VERIFIED' : 'PENDING'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleToggleProStatus(d._id, 'doctor', d.verified)}
                                                className={`p-3 rounded-2xl transition-all shadow-sm ${d.verified ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-400 bg-white hover:bg-slate-50 border border-slate-100'}`}
                                                title={d.verified ? 'Revoke Protocol' : 'Authorize Protocol'}
                                            >
                                                {d.verified ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- Manage Blogs View ---
export const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Blog Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: 'Admin',
        category: 'Mental Health',
        image: '',
        readTime: '5 min'
    });

    const handleCreateBlog = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/blogs', formData);
            if (response.data.success) {
                setBlogs([response.data.blog, ...blogs]);
                setIsModalOpen(false);
                setFormData({
                    title: '',
                    content: '',
                    author: 'Admin',
                    category: 'Mental Health',
                    image: '',
                    readTime: '5 min'
                });
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            alert('Failed to create blog');
        }
    };


    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/admin/blogs');
            if (response.data.success) {
                setBlogs(response.data.blogs);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeatured = async (id) => {
        try {
            const response = await api.put(`/admin/blogs/${id}/featured`);
            if (response.data.success) {
                setBlogs(blogs.map(b => b._id === id ? response.data.blog : b));
            }
        } catch (error) {
            console.error('Error toggling featured:', error);
        }
    };

    const handleDeleteBlog = async (id) => {
        if (!window.confirm('Delete this blog post?')) return;
        try {
            const response = await api.delete(`/admin/blogs/${id}`);
            if (response.data.success) {
                setBlogs(blogs.filter(b => b._id !== id));
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-purple-600" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Curation Studio</h2>
                    <p className="text-slate-500 font-medium">Engineer and showcase impactful mental health literature.</p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    className="gap-2 bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-100"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} /> New Publication
                </Button>
            </div>

            {/* Create Blog Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold mb-6">Publish New Article</h3>
                            <form onSubmit={handleCreateBlog} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border rounded-xl"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Author</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border rounded-xl"
                                        value={formData.author}
                                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Category</label>
                                    <select
                                        className="w-full p-2 border rounded-xl"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Mental Health">Mental Health</option>
                                        <option value="Self-Care">Self-Care</option>
                                        <option value="Resilience">Resilience</option>
                                        <option value="Mindfulness">Mindfulness</option>
                                        <option value="Stress Management">Stress Management</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-xl"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Content</label>
                                    <textarea
                                        required
                                        className="w-full p-2 border rounded-xl"
                                        rows={5}
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary">Publish</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(blog => (
                    <Card key={blog._id} className="relative group overflow-hidden border border-white/60 bg-white/70 backdrop-blur-2xl flex flex-col p-5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 rounded-[2.5rem]">
                        <div className="relative mb-6 overflow-hidden rounded-[2rem] shadow-sm">
                            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="text-[10px] font-bold px-3 py-1 bg-white/90 backdrop-blur-md text-purple-700 rounded-full uppercase tracking-wider shadow-sm">
                                    {blog.category}
                                </span>
                                {blog.isFeatured && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-[10px] font-bold px-3 py-1 bg-amber-500 text-white rounded-full uppercase tracking-wider shadow-md border border-amber-400"
                                    >
                                        Featured
                                    </motion.span>
                                )}
                            </div>
                        </div>

                        <h4 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 leading-tight tracking-tight">{blog.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-8">
                            <span className="text-purple-600">{blog.author}</span>
                            <span>•</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50/50">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggleFeatured(blog._id)}
                                    className={`p-2.5 rounded-xl transition-all shadow-sm ${blog.isFeatured ? 'text-amber-500 bg-amber-50 border-amber-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100 border-slate-100'}`}
                                    title="Highlight Article"
                                >
                                    <Star size={18} className={blog.isFeatured ? 'fill-current' : ''} />
                                </button>
                                <button
                                    onClick={() => handleDeleteBlog(blog._id)}
                                    className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all shadow-sm"
                                    title="Revoke Publication"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <button className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
            {blogs.length === 0 && (
                <div className="py-32 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-200 text-center shadow-inner">
                    <BookOpen size={48} className="mx-auto text-slate-300 mb-6" />
                    <p className="text-slate-500 font-bold tracking-tight">Studio is empty.</p>
                    <p className="text-slate-400 text-sm">Generate some insightful content to begin.</p>
                </div>
            )}
        </div>
    );
};

// --- Reports View ---
export const AdminReports = () => {
    const [gameAnalytics, setGameAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGameAnalytics();
    }, []);

    const fetchGameAnalytics = async () => {
        try {
            const response = await api.get('/games/admin/analytics');
            if (response.data.success) {
                setGameAnalytics(response.data.analytics);
            }
        } catch (error) {
            console.error('Error fetching game analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Game Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { id: 'focus', title: 'Focus Tap', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { id: 'memory', title: 'Memory Flip', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { id: 'breathing', title: 'Rhythmic Breathing', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { id: 'mood', title: 'Mood Catcher', icon: Smile, color: 'text-green-500', bg: 'bg-green-50' }
                ].map((game) => {
                    const stats = gameAnalytics.find(a => a._id === game.id) || { totalGlobalPlays: 0, avgScore: 0 };
                    const Icon = game.icon;
                    return (
                        <Card key={game.id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-4 rounded-2xl ${game.bg} ${game.color}`}>
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{game.title}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Performance</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500">Total Plays</span>
                                    <span className="text-lg font-bold text-slate-900">{stats.totalGlobalPlays}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500">Avg. Score</span>
                                    <span className="text-lg font-bold text-indigo-600">{Math.round(stats.avgScore)}</span>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="relative overflow-hidden bg-white/60 backdrop-blur-3xl rounded-[3.5rem] border border-white/40 shadow-2xl p-12 md:p-20 text-center group">

                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/30 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-purple-200/40" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-[100px] -ml-32 -mb-32 transition-all group-hover:bg-blue-200/40" />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="w-28 h-28 bg-white shadow-2xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-white group-hover:scale-110 transition-transform duration-500">
                        <FileText size={56} className="text-purple-600 drop-shadow-sm" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tighter">Strategic Intelligence</h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg mx-auto">Access real-time clinical analytics, patient outcome trajectories, and platform health telemetry.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">
                        <Button className="gap-3 px-10 py-5 rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-slate-300 hover:shadow-purple-200/50 h-auto font-bold text-lg hover:-translate-y-1.5 transition-all">
                            <Download size={22} /> Engagement Ledger
                        </Button>
                        <Button variant="secondary" className="gap-3 px-10 py-5 rounded-[2rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl h-auto font-bold text-lg hover:-translate-y-1.5 transition-all">
                            <Download size={22} /> Clinical Synopsis
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-24 px-4 relative z-10">
                    {[
                        { label: 'Growth Velocity', value: '+28.4%', color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Patient Retention', value: '74.2%', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Efficacy Rate', value: '31.8%', color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Net Satisfaction', value: '4.91', color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="text-center p-6 bg-white/80 backdrop-blur-md rounded-[2rem] border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{item.label}</p>
                            <p className={`text-2xl font-bold ${item.color} tracking-tight`}>{item.value}</p>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
