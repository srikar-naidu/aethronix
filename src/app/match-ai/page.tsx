"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Star, ChevronRight, UserCheck, AlertTriangle, TrendingUp, Info, MapPin, Clock, IndianRupee, Building2, X, Briefcase } from 'lucide-react';

const internships = [
    {
        id: 1,
        title: 'Frontend Engineering Intern',
        company: 'Vercel Labs',
        location: 'Bangalore, India (Remote)',
        duration: '6 months',
        stipend: '₹40,000/month',
        skills: ['React', 'Next.js', 'TypeScript'],
        posted: '2 days ago',
        applicants: 48,
    },
    {
        id: 2,
        title: 'React Developer Intern',
        company: 'Flipkart',
        location: 'Bangalore, India',
        duration: '3 months',
        stipend: '₹25,000/month',
        skills: ['React', 'Redux', 'JavaScript'],
        posted: '5 days ago',
        applicants: 120,
    },
    {
        id: 3,
        title: 'UI/UX Engineering Intern',
        company: 'Razorpay',
        location: 'Pune, India (Hybrid)',
        duration: '4 months',
        stipend: '₹30,000/month',
        skills: ['React', 'Figma', 'CSS'],
        posted: '1 day ago',
        applicants: 65,
    },
    {
        id: 4,
        title: 'Full Stack Intern',
        company: 'CRED',
        location: 'Mumbai, India',
        duration: '6 months',
        stipend: '₹35,000/month',
        skills: ['React', 'Node.js', 'PostgreSQL'],
        posted: '3 days ago',
        applicants: 89,
    },
    {
        id: 5,
        title: 'Software Engineering Intern',
        company: 'Google India',
        location: 'Hyderabad, India',
        duration: '3 months',
        stipend: '₹80,000/month',
        skills: ['React', 'TypeScript', 'GraphQL'],
        posted: 'Just now',
        applicants: 210,
    },
];

export default function MatchAIPage() {
    const [view, setView] = useState<'student' | 'recruiter'>('student');
    const [showInternships, setShowInternships] = useState(false);
    const [appliedIds, setAppliedIds] = useState<number[]>([]);

    const handleApply = (id: number) => {
        setAppliedIds(prev => [...prev, id]);
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                {/* Header & Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <Brain className="w-10 h-10 text-[var(--color-primary)]" />
                            MatchAI
                        </h1>
                        <p className="text-[var(--color-muted)]">Groq-powered bidirectional matching based on verified skills.</p>
                    </div>

                    <div className="flex p-1 bg-white/5 rounded-xl border border-[var(--color-border)]">
                        <button
                            onClick={() => setView('student')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'student'
                                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                                : 'text-[var(--color-muted)] hover:text-white'
                                }`}
                        >
                            For Candidates
                        </button>
                        <button
                            onClick={() => setView('recruiter')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'recruiter'
                                ? 'bg-[var(--color-accent)] text-white shadow-lg'
                                : 'text-[var(--color-muted)] hover:text-white'
                                }`}
                        >
                            For Recruiters
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'student' ? (
                        <motion.div
                            key="student"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="glass p-6 rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Star className="w-5 h-5 text-[var(--color-accent)] fill-current" />
                                        Top Recommendation
                                    </h3>
                                    <span className="px-3 py-1 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-sm font-bold border border-[var(--color-accent)]/30">
                                        98% Match
                                    </span>
                                </div>

                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-bold mb-1">Frontend Engineering Intern</h4>
                                        <p className="text-lg text-[var(--color-muted)] mb-4">at Vercel Labs</p>

                                        <div className="bg-black/30 rounded-xl p-4 mb-4">
                                            <p className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                                <Brain className="w-4 h-4 text-[var(--color-primary)]" />
                                                Why AI Matched You:
                                            </p>
                                            <p className="text-sm text-[var(--color-muted)]">
                                                Your verified React score (92%) perfectly aligns with their core requirement. You also completed the identical "state management" milestone in MockPrep yesterday.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-orange-400 flex items-center gap-1 font-medium">
                                                <AlertTriangle className="w-4 h-4" /> Skill Gap:
                                            </span>
                                            <span className="text-[var(--color-muted)]">GraphQL (Basic knowledge preferred)</span>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto">
                                        <button
                                            onClick={() => setShowInternships(!showInternships)}
                                            className={`w-full md:w-auto py-4 px-8 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${showInternships
                                                    ? 'bg-white/10 text-white border border-[var(--color-border)]'
                                                    : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90'
                                                }`}
                                        >
                                            {showInternships ? (
                                                <><X className="w-5 h-5" /> Close</>
                                            ) : (
                                                <>Fast-Track Apply <ChevronRight className="w-5 h-5" /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Internship Listings Panel */}
                            <AnimatePresence>
                                {showInternships && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
                                            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Briefcase className="w-6 h-6 text-[var(--color-primary)]" />
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Available Internships</h3>
                                                        <p className="text-sm text-[var(--color-muted)]">{internships.length} internships matched to your profile</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="divide-y divide-[var(--color-border)]">
                                                {internships.map((internship, index) => (
                                                    <motion.div
                                                        key={internship.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.08 }}
                                                        className="p-6 hover:bg-white/5 transition-colors"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <h4 className="text-lg font-bold text-white">{internship.title}</h4>
                                                                        <p className="text-[var(--color-muted)] flex items-center gap-1.5 mt-0.5">
                                                                            <Building2 className="w-4 h-4" />
                                                                            {internship.company}
                                                                        </p>
                                                                    </div>
                                                                    <span className="text-xs text-[var(--color-muted)] whitespace-nowrap md:hidden">{internship.posted}</span>
                                                                </div>

                                                                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <IndianRupee className="w-4 h-4 text-[var(--color-accent)]" />
                                                                        <span className="font-semibold text-[var(--color-accent)]">{internship.stipend}</span>
                                                                    </span>
                                                                    <span className="flex items-center gap-1.5">
                                                                        <MapPin className="w-4 h-4 text-[var(--color-muted)]" />
                                                                        {internship.location}
                                                                    </span>
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Clock className="w-4 h-4 text-[var(--color-muted)]" />
                                                                        {internship.duration}
                                                                    </span>
                                                                </div>

                                                                <div className="flex flex-wrap gap-2 mt-1">
                                                                    {internship.skills.map(s => (
                                                                        <span key={s} className="px-2.5 py-1 bg-white/5 rounded-lg text-xs text-gray-300 border border-white/10">{s}</span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                                <span className="text-xs text-[var(--color-muted)] hidden md:block">{internship.posted}</span>
                                                                <span className="text-xs text-[var(--color-muted)]">{internship.applicants} applicants</span>
                                                                <button
                                                                    onClick={() => handleApply(internship.id)}
                                                                    disabled={appliedIds.includes(internship.id)}
                                                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${appliedIds.includes(internship.id)
                                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                                                                            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/80 hover:scale-105'
                                                                        }`}
                                                                >
                                                                    {appliedIds.includes(internship.id) ? '✓ Applied' : 'Apply Now'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Other Matches */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Item 2 */}
                                <div className="glass p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-white">Full Stack Intern</h4>
                                            <p className="text-sm text-[var(--color-muted)]">Supabase</p>
                                        </div>
                                        <span className="px-3 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg text-sm font-bold">85% Match</span>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">React</span>
                                        <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">PostgreSQL</span>
                                    </div>
                                </div>
                                {/* Item 3 */}
                                <div className="glass p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-white">UI Developer</h4>
                                            <p className="text-sm text-[var(--color-muted)]">Framer</p>
                                        </div>
                                        <span className="px-3 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg text-sm font-bold">82% Match</span>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">React</span>
                                        <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Framer Motion</span>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    ) : (
                        <motion.div
                            key="recruiter"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="glass rounded-3xl border border-[var(--color-border)] overflow-hidden">
                                <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">Smart Candidate Ranking</h3>
                                        <p className="text-sm text-[var(--color-muted)]">For: Frontend Developer Intern</p>
                                    </div>
                                    <button className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">Export CSV</button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-black/20 text-sm text-[var(--color-muted)] uppercase tracking-wider">
                                                <th className="px-6 py-4 font-medium">Candidate</th>
                                                <th className="px-6 py-4 font-medium">Match %</th>
                                                <th className="px-6 py-4 font-medium">Predicted Success</th>
                                                <th className="px-6 py-4 font-medium">Risk Indicator</th>
                                                <th className="px-6 py-4 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--color-border)]">
                                            {/* Row 1 */}
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center font-bold text-white">AK</div>
                                                        <div>
                                                            <div className="font-bold text-white">Arjun Kumar</div>
                                                            <div className="text-xs text-[var(--color-muted)]">Tier-3 College</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[var(--color-accent)] font-bold text-lg">98%</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                                        <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" /> High
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs border border-green-500/30">Low Risk</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="px-4 py-2 bg-[var(--color-primary)] rounded-lg text-sm font-medium text-white hover:bg-[var(--color-primary)]/90 transition">
                                                        Invite
                                                    </button>
                                                </td>
                                            </tr>
                                            {/* Row 2 */}
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white">SP</div>
                                                        <div>
                                                            <div className="font-bold text-white">Sarah Patel</div>
                                                            <div className="text-xs text-[var(--color-muted)]">NIT Trichy</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[var(--color-primary)] font-bold text-lg">85%</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                                        <TrendingUp className="w-4 h-4 text-yellow-400" /> Medium
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30 flex items-center gap-1">
                                                        <Info className="w-3 h-3" /> Skill Gap: Tailwind
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="px-4 py-2 glass rounded-lg text-sm font-medium text-white hover:bg-white/10 transition">
                                                        View Profile
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
