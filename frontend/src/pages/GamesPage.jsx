
import React from 'react';
import { motion } from 'framer-motion';
import { Container, Button, Card } from '../components/UI';
import { Brain, Zap, Wind, Smile, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GamesPage = () => {
    const navigate = useNavigate();
    const games = [
        {
            id: 'focus',
            title: 'Focus Tap',
            description: 'Train your attention span by tapping targets before they disappear.',
            icon: Zap,
            color: 'text-amber-500',
            bgColor: 'bg-amber-50',
            path: '/games/focus'
        },
        {
            id: 'memory',
            title: 'Memory Flip',
            description: 'Enhance your short-term memory with this classic card matching game.',
            icon: Brain,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            path: '/games/memory'
        },
        {
            id: 'breathing',
            title: 'Emotion Balance Puzzle',
            description: 'Balance your thoughts by placing emotions on a scale. Train emotional stability.',
            icon: Wind,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            path: '/games/breathing'
        },
        {
            id: 'mood',
            title: 'Mood Catcher',
            description: 'Catch positive vibes and dodge the negativity in this uplifting game.',
            icon: Smile,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            path: '/games/mood'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-6 pb-16">
            <Container>
                {/* Header Actions */}
                <div className="flex justify-start mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="gap-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-all rounded-xl"
                      >
                        <ArrowLeft size={20} /> Back to Home
                    </Button>
                </div>

                {/* Header */}
                <div className="text-center mb-8 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
                    >
                        Mind Training Games
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 font-medium"
                    >
                        Play. Relax. Strengthen your Mind.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block bg-white px-6 py-2 rounded-full shadow-sm border border-slate-200 mt-4"
                    >
                        <p className="text-purple-600 font-semibold italic">
                            "The mind is like a muscle - the more you exercise it, the stronger it gets."
                        </p>
                    </motion.div>
                </div>

                {/* Games Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                    {games.map((game, index) => {
                        const Icon = game.icon;
                        return (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                whileHover={{ y: -8 }}
                            >
                                <Card className="h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-100">
                                    <div>
                                        <div className={`w-16 h-16 rounded-2xl ${game.bgColor} flex items-center justify-center mb-6`}>
                                            <Icon className={`w-8 h-8 ${game.color}`} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{game.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed mb-6">
                                            {game.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Progress Placeholder */}
                                        <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-slate-400">
                                            <span>LEVEL 1</span>
                                            <span>0 XP</span>
                                        </div>

                                        <Link to={game.path} className="block">
                                            <Button className="w-full bg-slate-900 text-white hover:bg-purple-600 transition-colors py-6 rounded-2xl group">
                                                Play Now
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </div>
    );
};

export default GamesPage;
