"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Search, Users, Clock, DollarSign, Target,
    CheckCircle2, TrendingUp, Star, ChevronRight,
    Sparkles, BarChart3, Calendar, Shield, Loader2
} from 'lucide-react';

// ===== Mock Data =====
const skillOptions = [
    'React', 'Node.js', 'Python', 'TypeScript', 'Flutter', 'AWS',
    'Docker', 'Figma', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Next.js',
    'TensorFlow', 'Kotlin', 'Swift', 'Go', 'Rust', 'Vue.js',
];

const mockCandidates = [
    {
        name: 'Anika Sharma',
        avatar: '👩‍💻',
        skills: ['React', 'TypeScript', 'Next.js'],
        match: 96,
        availability: 'Immediate',
        predictedSuccess: 94,
        experience: '2 yrs',
        rating: 4.9,
        location: 'Bangalore',
    },
    {
        name: 'Rohan Patel',
        avatar: '👨‍💻',
        skills: ['Node.js', 'Python', 'AWS'],
        match: 91,
        availability: '1 week',
        predictedSuccess: 89,
        experience: '3 yrs',
        rating: 4.7,
        location: 'Hyderabad',
    },
    {
        name: 'Priya Desai',
        avatar: '👩‍🎨',
        skills: ['Figma', 'React', 'TypeScript'],
        match: 88,
        availability: 'Immediate',
        predictedSuccess: 85,
        experience: '1.5 yrs',
        rating: 4.8,
        location: 'Pune',
    },
    {
        name: 'Arjun Mehta',
        avatar: '🧑‍💻',
        skills: ['Python', 'TensorFlow', 'PostgreSQL'],
        match: 84,
        availability: '2 weeks',
        predictedSuccess: 82,
        experience: '2.5 yrs',
        rating: 4.6,
        location: 'Chennai',
    },
    {
        name: 'Kavya Nair',
        avatar: '👩‍🔬',
        skills: ['Flutter', 'Kotlin', 'GraphQL'],
        match: 79,
        availability: '3 days',
        predictedSuccess: 77,
        experience: '1 yr',
        rating: 4.5,
        location: 'Kochi',
    },
];

export default function QuickHirePage() {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [urgency, setUrgency] = useState('normal');
    const [budget, setBudget] = useState('mid');
    const [duration, setDuration] = useState('1-3 months');
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleSearch = () => {
        if (selectedSkills.length === 0) return;
        setIsSearching(true);
        setShowResults(false);
        setTimeout(() => {
            setIsSearching(false);
            setShowResults(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <Zap className="w-8 h-8 text-yellow-400" />
                        QuickHire
                    </h1>
                    <p className="text-[var(--color-muted)] text-lg">AI-powered instant candidate matching for startups. Define your needs, get top matches in seconds.</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">

                    {/* Left: Startup Input Form (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Required Skills */}
                        <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-[var(--color-primary)]" />
                                Required Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skillOptions.map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${selectedSkills.includes(skill)
                                            ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                                            : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                            {selectedSkills.length > 0 && (
                                <p className="text-xs text-[var(--color-accent)] mt-3 font-medium">
                                    {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>

                        {/* Urgency */}
                        <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-400" />
                                Urgency
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'low', label: 'Flexible', desc: '2+ weeks', color: 'text-green-400' },
                                    { value: 'normal', label: 'Normal', desc: '1 week', color: 'text-yellow-400' },
                                    { value: 'urgent', label: 'Urgent', desc: 'ASAP', color: 'text-red-400' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setUrgency(opt.value)}
                                        className={`p-3 rounded-2xl border text-center transition-all ${urgency === opt.value
                                            ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <p className={`font-bold text-sm ${opt.color}`}>{opt.label}</p>
                                        <p className="text-xs text-[var(--color-muted)]">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-400" />
                                Budget Range
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'low', label: '₹5K-15K', desc: '/month' },
                                    { value: 'mid', label: '₹15K-30K', desc: '/month' },
                                    { value: 'high', label: '₹30K+', desc: '/month' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setBudget(opt.value)}
                                        className={`p-3 rounded-2xl border text-center transition-all ${budget === opt.value
                                            ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <p className="font-bold text-sm text-white">{opt.label}</p>
                                        <p className="text-xs text-[var(--color-muted)]">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                Duration
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['< 1 month', '1-3 months', '3-6 months'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setDuration(opt)}
                                        className={`p-3 rounded-2xl border text-center transition-all ${duration === opt
                                            ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <p className="font-bold text-sm text-white">{opt}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            disabled={selectedSkills.length === 0 || isSearching}
                            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${selectedSkills.length === 0
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[var(--color-primary)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary)]/30 hover:scale-[1.02] hover:shadow-xl'
                                }`}
                        >
                            {isSearching ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> AI Matching...</>
                            ) : (
                                <><Sparkles className="w-5 h-5" /> Find Top Candidates</>
                            )}
                        </button>
                    </div>

                    {/* Right: AI Output Panel (3 cols) */}
                    <div className="lg:col-span-3">
                        <div className="glass rounded-3xl p-6 border border-[var(--color-border)] min-h-[600px]">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                                AI Match Results
                                {showResults && (
                                    <span className="text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-2 py-0.5 rounded-full font-bold ml-2">
                                        Top 5 Matches
                                    </span>
                                )}
                            </h3>

                            <AnimatePresence mode="wait">
                                {isSearching ? (
                                    <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full border-4 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] animate-spin" />
                                            <Sparkles className="w-8 h-8 text-[var(--color-primary)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        <p className="text-white font-bold mt-6 text-lg">AI is analyzing candidates...</p>
                                        <p className="text-[var(--color-muted)] text-sm mt-2">Matching skills, availability, and success predictions</p>
                                    </motion.div>
                                ) : showResults ? (
                                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        {mockCandidates.map((candidate, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-[var(--color-primary)]/30 transition-all group hover:bg-black/50"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Avatar & Rank */}
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-purple-500/20 flex items-center justify-center text-2xl border border-white/10">
                                                            {candidate.avatar}
                                                        </div>
                                                        <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shadow-lg">
                                                            #{idx + 1}
                                                        </span>
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-white">{candidate.name}</h4>
                                                            <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                                                <Star className="w-3 h-3 fill-current" />
                                                                {candidate.rating}
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-[var(--color-muted)] mb-2">{candidate.location} · {candidate.experience} experience</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {candidate.skills.map(skill => (
                                                                <span key={skill} className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedSkills.includes(skill) ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30' : 'bg-white/10 text-gray-400'}`}>
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center gap-4 shrink-0">
                                                        {/* Match % */}
                                                        <div className="text-center">
                                                            <div className="relative w-14 h-14">
                                                                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                                                    <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                                                    <circle cx="28" cy="28" r="24" fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeDasharray={`${candidate.match * 1.508} 150.8`} strokeLinecap="round" />
                                                                </svg>
                                                                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">{candidate.match}%</span>
                                                            </div>
                                                            <p className="text-[10px] text-[var(--color-muted)] mt-1">Match</p>
                                                        </div>

                                                        {/* Availability */}
                                                        <div className="text-center hidden md:block">
                                                            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${candidate.availability === 'Immediate' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                                {candidate.availability}
                                                            </div>
                                                            <p className="text-[10px] text-[var(--color-muted)] mt-1">Availability</p>
                                                        </div>

                                                        {/* Predicted Success */}
                                                        <div className="text-center hidden md:block">
                                                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/20">
                                                                <TrendingUp className="w-3 h-3 text-purple-400" />
                                                                <span className="text-xs font-bold text-purple-400">{candidate.predictedSuccess}%</span>
                                                            </div>
                                                            <p className="text-[10px] text-[var(--color-muted)] mt-1">Success</p>
                                                        </div>

                                                        {/* Action */}
                                                        <button className="p-2 rounded-xl bg-white/5 hover:bg-[var(--color-primary)]/20 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-all group-hover:border-[var(--color-primary)]/30 border border-transparent">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Mobile Stats Row */}
                                                <div className="flex items-center gap-3 mt-3 md:hidden">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${candidate.availability === 'Immediate' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                        {candidate.availability}
                                                    </span>
                                                    <span className="text-xs text-purple-400 font-bold flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" /> {candidate.predictedSuccess}% Success
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Summary */}
                                        <div className="mt-6 p-4 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-bold text-white mb-1">AI Confidence Report</p>
                                                <p className="text-sm text-gray-400">
                                                    Based on {selectedSkills.length} required skills, <strong className="text-white">{urgency}</strong> urgency, and <strong className="text-white">{duration}</strong> duration,
                                                    our AI recommends <strong className="text-[var(--color-accent)]">{mockCandidates[0].name}</strong> as the strongest match with a {mockCandidates[0].predictedSuccess}% predicted success rate.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 text-center text-[var(--color-muted)]">
                                        <Users className="w-16 h-16 mb-4 opacity-30" />
                                        <p className="text-lg font-medium mb-2">No search yet</p>
                                        <p className="text-sm opacity-70">Select required skills and click &ldquo;Find Top Candidates&rdquo; to get AI-powered matches.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
