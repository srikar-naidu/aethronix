"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wand2, Save, Trash2, Plus, ArrowRight, 
    User, Briefcase, Award, Linkedin, Github, 
    Mail, Sparkles, CheckCircle, Info
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PortfolioData {
    personalInfo: {
        name: string;
        role: string;
        email: string;
        github?: string;
        linkedin?: string;
    };
    summary: string;
    experience: Array<{
        role: string;
        company: string;
        duration: string;
        impact: string;
    }>;
    skills: {
        technical: string[];
        soft: string[];
    };
}

const EMPTY_PORTFOLIO: PortfolioData = {
    personalInfo: { name: "", role: "", email: "", github: "", linkedin: "" },
    summary: "",
    experience: [{ role: "", company: "", duration: "", impact: "" }],
    skills: { technical: [""], soft: [""] }
};

export default function CreatePortfolioPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState<PortfolioData>(EMPTY_PORTFOLIO);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'summary' | 'experience' | 'skills'>('info');

    useEffect(() => {
        const saved = localStorage.getItem('RUBIX_portfolio');
        if (saved) {
            setData(JSON.parse(saved));
        }

        // Handle magic import from parser
        if (searchParams.get('import') === 'true') {
            const lastParsed = localStorage.getItem('RUBIX_last_parsed');
            if (lastParsed) {
                const parsed = JSON.parse(lastParsed);
                setData({
                    personalInfo: {
                        name: parsed.personalInfo.name || "",
                        role: parsed.experience[0]?.role || "Expert Professional",
                        email: parsed.personalInfo.email || "",
                        github: "",
                        linkedin: ""
                    },
                    summary: parsed.analysisSummary || "",
                    experience: parsed.experience.map((exp: any) => ({
                        role: exp.role,
                        company: exp.company,
                        duration: exp.duration,
                        impact: exp.impact
                    })),
                    skills: {
                        technical: parsed.skills.technical || [],
                        soft: parsed.skills.soft || []
                    }
                });
            }
        }
    }, [searchParams]);

    const handleSave = () => {
        localStorage.setItem('RUBIX_portfolio', JSON.stringify(data));
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
    };

    const addExperience = () => {
        setData({
            ...data,
            experience: [...data.experience, { role: "", company: "", duration: "", impact: "" }]
        });
    };

    const removeExperience = (index: number) => {
        const newExp = data.experience.filter((_, i) => i !== index);
        setData({ ...data, experience: newExp });
    };

    const addSkill = (type: 'technical' | 'soft') => {
        setData({
            ...data,
            skills: { ...data.skills, [type]: [...data.skills[type], ""] }
        });
    };

    const handleImport = () => {
        const lastParsed = localStorage.getItem('RUBIX_last_parsed');
        if (lastParsed) {
            const parsed = JSON.parse(lastParsed);
             setData({
                personalInfo: {
                    name: parsed.personalInfo.name || data.personalInfo.name,
                    role: parsed.experience[0]?.role || data.personalInfo.role,
                    email: parsed.personalInfo.email || data.personalInfo.email,
                    github: data.personalInfo.github,
                    linkedin: data.personalInfo.linkedin
                },
                summary: parsed.analysisSummary || data.summary,
                experience: parsed.experience.map((exp: any) => ({
                    role: exp.role,
                    company: exp.company,
                    duration: exp.duration,
                    impact: exp.impact
                })),
                skills: {
                    technical: parsed.skills.technical || [],
                    soft: parsed.skills.soft || []
                }
            });
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2000);
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[var(--color-background)]">
            <div className="container mx-auto px-4 max-w-4xl">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-[var(--color-primary)]" />
                            Portfolio Builder
                        </h1>
                        <p className="text-[var(--color-muted)]">Design your digital identity for the skill-first market.</p>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        <button 
                            onClick={handleImport}
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl glass glass-hover text-white flex items-center justify-center gap-2 font-medium group transition-all"
                        >
                            <Wand2 className="w-4 h-4 text-[var(--color-primary)] transition-transform group-hover:rotate-12" />
                            Magic Import
                        </button>
                        <button 
                            onClick={() => router.push('/portfolio')}
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center gap-2 font-medium shadow-lg hover:bg-[var(--color-primary)]/90 transition shadow-primary/20"
                        >
                            View Final <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    
                    {/* Navigation Tabs */}
                    <div className="lg:col-span-1 space-y-2">
                        {[
                            { id: 'info', name: 'Personal Info', icon: User },
                            { id: 'summary', name: 'AI Summary', icon: Sparkles },
                            { id: 'experience', name: 'Experience', icon: Briefcase },
                            { id: 'skills', name: 'Skills & Badges', icon: Award },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                    ${activeTab === tab.id 
                                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20' 
                                        : 'text-[var(--color-muted)] hover:text-white hover:bg-white/5'}`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        ))}

                        <div className="mt-12 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 hidden lg:block">
                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Tip</span>
                            </div>
                            <p className="text-xs text-blue-400/70 leading-relaxed">
                                Use the "Magic Import" to auto-fill this form using the data from your latest resume scan.
                            </p>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="lg:col-span-3">
                        <div className="glass rounded-[2rem] p-8 md:p-10 border border-white/5 min-h-[500px] flex flex-col">
                            
                            <div className="flex-grow">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'info' && (
                                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Full Name</label>
                                                    <input 
                                                        value={data.personalInfo.name} 
                                                        onChange={(e) => setData({...data, personalInfo: {...data.personalInfo, name: e.target.value}})} 
                                                        placeholder="e.g., Arjun Kumar"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition"
                                                    />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Professional Role</label>
                                                    <input 
                                                        value={data.personalInfo.role} 
                                                        onChange={(e) => setData({...data, personalInfo: {...data.personalInfo, role: e.target.value}})} 
                                                        placeholder="e.g., Full Stack Developer"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Email Address</label>
                                                    <input 
                                                        value={data.personalInfo.email} 
                                                        onChange={(e) => setData({...data, personalInfo: {...data.personalInfo, email: e.target.value}})} 
                                                        placeholder="e.g., arjun@example.com"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition"
                                                    />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">GitHub Link (Optional)</label>
                                                    <input 
                                                        value={data.personalInfo.github} 
                                                        onChange={(e) => setData({...data, personalInfo: {...data.personalInfo, github: e.target.value}})} 
                                                        placeholder="https://github.com/yourusername"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition"
                                                    />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">LinkedIn Link (Optional)</label>
                                                    <input 
                                                        value={data.personalInfo.linkedin} 
                                                        onChange={(e) => setData({...data, personalInfo: {...data.personalInfo, linkedin: e.target.value}})} 
                                                        placeholder="https://linkedin.com/in/yourprofile"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--color-primary)] outline-none transition"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'summary' && (
                                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                            <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">AI-Optimized Summary</label>
                                            <textarea 
                                                value={data.summary} 
                                                onChange={(e) => setData({...data, summary: e.target.value})} 
                                                rows={8}
                                                placeholder="Describe your expertise, certifications, and career goals..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[var(--color-primary)] outline-none transition resize-none leading-relaxed"
                                            />
                                            <p className="mt-4 text-xs text-[var(--color-muted)] flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
                                                Professional summary helps AI find the best roadmaps for you.
                                            </p>
                                        </motion.div>
                                    )}

                                    {activeTab === 'experience' && (
                                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                                            {data.experience.map((exp, idx) => (
                                                <div key={idx} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 group">
                                                    <button 
                                                        onClick={() => removeExperience(idx)}
                                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="col-span-2 md:col-span-1">
                                                            <input 
                                                                value={exp.role} 
                                                                onChange={(e) => {
                                                                    const newExp = [...data.experience];
                                                                    newExp[idx].role = e.target.value;
                                                                    setData({...data, experience: newExp});
                                                                }}
                                                                placeholder="Role (e.g., Designer)"
                                                                className="w-full bg-transparent border-b border-white/10 pb-2 text-white focus:border-[var(--color-primary)] outline-none transition font-bold"
                                                            />
                                                        </div>
                                                        <div className="col-span-2 md:col-span-1">
                                                            <input 
                                                                value={exp.company} 
                                                                onChange={(e) => {
                                                                    const newExp = [...data.experience];
                                                                    newExp[idx].company = e.target.value;
                                                                    setData({...data, experience: newExp});
                                                                }}
                                                                placeholder="Company"
                                                                className="w-full bg-transparent border-b border-white/10 pb-2 text-[var(--color-primary)] outline-none transition"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <textarea 
                                                                value={exp.impact} 
                                                                onChange={(e) => {
                                                                    const newExp = [...data.experience];
                                                                    newExp[idx].impact = e.target.value;
                                                                    setData({...data, experience: newExp});
                                                                }}
                                                                placeholder="Impact summary..."
                                                                rows={2}
                                                                className="w-full bg-transparent text-sm text-gray-400 outline-none mt-2 placeholder:italic"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={addExperience}
                                                className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-[var(--color-muted)] hover:border-[var(--color-primary)]/50 hover:text-white transition flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" /> Add Experience
                                            </button>
                                        </motion.div>
                                    )}

                                    {activeTab === 'skills' && (
                                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wide">Technical Mastery</label>
                                                    <button onClick={() => addSkill('technical')} className="text-xs text-[var(--color-primary)] font-bold flex items-center gap-1 hover:underline">
                                                        <Plus className="w-3 h-3" /> Add Skill
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {data.skills.technical.map((skill, idx) => (
                                                        <input 
                                                            key={idx}
                                                            value={skill}
                                                            onChange={(e) => {
                                                                const newSkills = [...data.skills.technical];
                                                                newSkills[idx] = e.target.value;
                                                                setData({...data, skills: {...data.skills, technical: newSkills}});
                                                            }}
                                                            placeholder="React"
                                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-[var(--color-primary)] outline-none"
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wide">Soft Skills & Communication</label>
                                                    <button onClick={() => addSkill('soft')} className="text-xs text-[var(--color-accent)] font-bold flex items-center gap-1 hover:underline">
                                                        <Plus className="w-3 h-3" /> Add Skill
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {data.skills.soft.map((skill, idx) => (
                                                        <input 
                                                            key={idx}
                                                            value={skill}
                                                            onChange={(e) => {
                                                                const newSkills = [...data.skills.soft];
                                                                newSkills[idx] = e.target.value;
                                                                setData({...data, skills: {...data.skills, soft: newSkills}});
                                                            }}
                                                            placeholder="Teamwork"
                                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-[var(--color-accent)] outline-none"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
                                <div className="flex items-center gap-2">
                                    {savedSuccess && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-[var(--color-accent)] flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Changes Saved Auto-magically
                                        </motion.span>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleSave}
                                        className="px-8 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition border border-white/10 flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" /> Save Progress
                                    </button>
                                    <button 
                                        onClick={() => {
                                            handleSave();
                                            router.push('/portfolio');
                                        }}
                                        className="px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary)]/90 transition shadow-lg shadow-primary/20 flex items-center gap-2"
                                    >
                                        Launch Portfolio <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
