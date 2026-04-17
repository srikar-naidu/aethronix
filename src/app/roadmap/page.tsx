"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, Zap, Clock, BookOpen, ArrowRight, CheckCircle2, ChevronDown, X, RefreshCw, Loader2 } from 'lucide-react';
import { ROADMAP_DATA } from '@/data/roadmaps';
import { useLanguage } from '@/context/LanguageContext';

export default function RoadmapPage() {
    const { t, language } = useLanguage();
    const [selectedDomain, setSelectedDomain] = useState<string>("Frontend Engineer");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expandedDocIdx, setExpandedDocIdx] = useState<number | null>(null);
    
    // Session cache for AI-generated documentation
    const [sessionDocs, setSessionDocs] = useState<Record<string, string>>({});
    const [generatingIdx, setGeneratingIdx] = useState<number | null>(null);

    const activeData = ROADMAP_DATA[selectedDomain];

    const handleFetchDocumentation = async (idx: number) => {
        const module = activeData.plan[idx];
        const cacheKey = `${selectedDomain}-${idx}-${language}`; // Keyed by language too

        // If we already have it in session for this language, just expand
        if (sessionDocs[cacheKey]) {
            setExpandedDocIdx(expandedDocIdx === idx ? null : idx);
            return;
        }

        // Start generation
        setGeneratingIdx(idx);
        setExpandedDocIdx(idx); // Open the slot immediately

        try {
            const response = await fetch('/api/roadmap-docs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domain: selectedDomain,
                    phaseTitle: module.title,
                    phaseDescription: module.description,
                    language: language // Pass the current language
                })
            });

            const data = await response.json();
            if (data.content) {
                setSessionDocs(prev => ({ ...prev, [cacheKey]: data.content }));
            }
        } catch (error) {
            console.error('Failed to generate docs:', error);
        } finally {
            setGeneratingIdx(null);
        }
    };

    const handleRegenerate = async (idx: number) => {
        const cacheKey = `${selectedDomain}-${idx}-${language}`;
        const newDocs = { ...sessionDocs };
        delete newDocs[cacheKey];
        setSessionDocs(newDocs);
        await handleFetchDocumentation(idx);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-zinc-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-bold mb-6"
                    >
                        {t('roadmap.subtitle')}
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-4 text-white">
                        <Route className="w-12 h-12 text-[var(--color-primary)]" />
                        {t('roadmap.title')}
                    </h1>

                    {/* Domain Selector Dropdown */}
                    <div className="relative max-w-md mx-auto mb-8">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full glass p-4 rounded-2xl border border-white/10 flex items-center justify-between hover:border-[var(--color-primary)]/50 transition-all text-left group"
                        >
                            <div>
                                <p className="text-[var(--color-muted)] text-xs uppercase tracking-widest font-bold mb-1 group-hover:text-[var(--color-primary)] transition-colors">{t('roadmap.targetRole')}</p>
                                <span className="text-xl font-bold text-white">{selectedDomain}</span>
                            </div>
                            <ChevronDown className={`w-6 h-6 text-[var(--color-muted)] transition-transform ${isDropdownOpen ? 'rotate-180 text-[var(--color-primary)]' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 5, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-0 right-0 z-50 mt-2 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl bg-black/80 max-h-[400px] overflow-y-auto custom-scrollbar"
                                >
                                    {(Object.keys(ROADMAP_DATA)).map((domain) => (
                                        <button
                                            key={domain}
                                            onClick={() => {
                                                setSelectedDomain(domain);
                                                setIsDropdownOpen(false);
                                                setExpandedDocIdx(null);
                                            }}
                                            className={`w-full p-4 text-left hover:bg-white/5 transition flex items-center justify-between border-b border-white/5 last:border-0 ${selectedDomain === domain ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-gray-400'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold">{domain}</span>
                                                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{ROADMAP_DATA[domain].timeline}</span>
                                            </div>
                                            {selectedDomain === domain && <CheckCircle2 className="w-4 h-4 shadow-[0_0_10px_var(--color-primary)]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed italic">
                        &quot;{activeData.description}&quot;
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Identified Gaps */}
                    <motion.div 
                        key={`${selectedDomain}-gaps`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-6 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                    >
                        <h3 className="font-bold text-lg mb-4 text-red-100 flex items-center gap-2">
                             {t('roadmap.focusGaps')}
                        </h3>
                        <div className="space-y-3">
                            {activeData.gaps.map((gap, i) => (
                                <div key={i} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 hover:border-red-500/30 transition-all">
                                    <span className="text-gray-300 font-medium">{gap.name}</span>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${gap.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {gap.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Time Estimate */}
                    <motion.div 
                        key={`${selectedDomain}-time`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass p-6 rounded-2xl border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50 transition-all"
                    >
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                            <Clock className="w-5 h-5 text-[var(--color-primary)]" /> {t('roadmap.masteryPath')}
                        </h3>
                        <div className="text-4xl font-extrabold text-white mb-2">{activeData.timeline}</div>
                        <p className="text-sm text-[var(--color-muted)]">AI-estimated timeline for core proficiency</p>
                    </motion.div>

                    {/* Impact */}
                    <motion.div 
                        key={`${selectedDomain}-roi`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-6 rounded-2xl border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/50 transition-all"
                    >
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                            <Zap className="w-5 h-5 text-[var(--color-accent)]" /> {t('roadmap.roiForecast')}
                        </h3>
                        <div className="text-3xl font-extrabold text-white mb-2">{activeData.roi}</div>
                        <p className="text-sm text-[var(--color-muted)]">{activeData.roiSub}</p>
                    </motion.div>
                </div>

                {/* Action Plan */}
                <div className="glass rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                            <ArrowRight className="w-6 h-6 text-[var(--color-primary)]" />
                            {t('roadmap.integrationStrategy')}
                        </h2>
                        <div className="text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 flex items-center gap-2 self-start uppercase tracking-widest">
                            <Zap className="w-3 h-3" /> {t('roadmap.aiActive')}
                        </div>
                    </div>

                    <div className="relative border-l-2 border-white/5 ml-4 md:ml-6 space-y-10">
                        {activeData.plan.map((module, idx) => {
                            const cacheKey = `${selectedDomain}-${idx}-${language}`;
                            const isGenerating = generatingIdx === idx;
                            const hasDocs = sessionDocs[cacheKey];

                            return (
                                <motion.div 
                                    key={`${selectedDomain}-${idx}`} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-8 md:pl-12"
                                >
                                    <div className={`absolute top-0 -left-[11px] w-5 h-5 rounded-full border-4 border-zinc-950 shadow-lg ${module.type === 'current' ? 'bg-[var(--color-accent)] animate-pulse' : module.type === 'reward' ? 'bg-purple-500' : 'bg-white/5'}`} />
                                    
                                    {module.type === 'reward' ? (
                                        <div className="glass p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent hover:border-purple-500/40 transition-all group">
                                            <div className="absolute top-4 right-6 text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded-full">{t('roadmap.rewardUnlocked')}</div>
                                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                                                <Zap className="w-5 h-5" /> {module.title}
                                            </h3>
                                            <p className="text-sm text-[var(--color-muted)] mb-4">{module.description}</p>
                                            <div className="bg-black/50 p-4 rounded-xl border border-purple-500/10 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{t('roadmap.earned')}: {module.reward}</div>
                                                    <div className="text-xs text-gray-500">Automatically added to your verified RUBIX profile.</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`glass p-6 rounded-2xl border transition-all hover:bg-white/5 ${module.type === 'current' ? 'border-[var(--color-border)] opacity-100' : 'border-white/5 opacity-40'}`}>
                                            <div className={`absolute top-4 right-6 text-[10px] font-bold uppercase tracking-widest ${module.type === 'current' ? 'text-[var(--color-accent)]' : 'text-gray-600'}`}>
                                                {t('common.ph')} {idx + 1}
                                            </div>
                                            <h3 className={`text-xl font-bold mb-2 ${module.type === 'current' ? 'text-white' : 'text-gray-500'}`}>{module.title}</h3>
                                            <p className="text-sm text-[var(--color-muted)] mb-4">{module.description}</p>
                                            
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button 
                                                        onClick={() => handleFetchDocumentation(idx)}
                                                        disabled={isGenerating}
                                                        className={`text-xs px-4 py-2 border transition rounded-lg flex items-center gap-2 font-bold uppercase tracking-tighter ${expandedDocIdx === idx ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white/5 text-white border-white/5 hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30'} ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isGenerating ? (
                                                            <>
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                {t('roadmap.generating')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Zap className="w-3.5 h-3.5" /> 
                                                                {hasDocs ? t('roadmap.viewDeepDive') : t('roadmap.generateDeepDive')}
                                                            </>
                                                        )}
                                                    </button>
                                                    
                                                    {module.type === 'current' && (
                                                        <button className="text-xs px-4 py-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 hover:bg-[var(--color-accent)] transition rounded-lg hover:text-black flex items-center gap-2 font-bold uppercase tracking-tighter">
                                                            {t('roadmap.beginMastery')} <ArrowRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {expandedDocIdx === idx && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mt-4 p-5 rounded-xl bg-black/40 border border-white/10 text-sm text-gray-300 leading-relaxed relative">
                                                                {isGenerating ? (
                                                                    <div className="space-y-4 py-4">
                                                                        <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded" />
                                                                        <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded" />
                                                                        <div className="h-4 w-5/6 bg-white/5 animate-pulse rounded" />
                                                                        <div className="h-4 w-2/3 bg-white/5 animate-pulse rounded" />
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                                                            <span className="font-bold text-[var(--color-primary)] flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                                                                <Zap className="w-3 h-3 shadow-[0_0_8px_var(--color-primary)]" /> {t('roadmap.personalizedDeepDive')}
                                                                            </span>
                                                                            <div className="flex items-center gap-2">
                                                                                <button 
                                                                                    onClick={() => handleRegenerate(idx)}
                                                                                    className="p-1.5 hover:bg-white/10 rounded-lg transition text-gray-500 hover:text-[var(--color-primary)]"
                                                                                    title={t('roadmap.regenerate')}
                                                                                >
                                                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                                                </button>
                                                                                <button onClick={() => setExpandedDocIdx(null)} className="p-1.5 hover:bg-white/10 rounded-lg transition text-gray-500 hover:text-white">
                                                                                    <X className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                                                                            {sessionDocs[cacheKey] || (
                                                                                <div className="text-orange-400/80 italic font-medium flex items-center gap-2">
                                                                                    <Zap className="w-4 h-4" /> AI is formulating your specialized curriculum...
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* AI Insight Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.05)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2">{t('roadmap.marketIntelligence')}</h4>
                            <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-3xl">
                                RUBIX roadmaps are dynamically enhanced by our specialized LLM fine-tuned on real-world engineering documentation. Every Deep-Dive is uniquely generated to match industry trends for {selectedDomain} in 2026.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
