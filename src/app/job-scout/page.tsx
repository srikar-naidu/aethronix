"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  Radar, Brain, Target, AlertTriangle, CheckCircle, FileText,
  TrendingUp, Sparkles, Loader2, Copy, Download, ArrowRight,
  ChevronDown, ChevronUp, Zap, BookOpen, Code,
  BarChart3, Shield, Lightbulb, Rocket, RefreshCw, X,
  Briefcase, GraduationCap, Star, MapPin, IndianRupee,
  Building2, Clock, Users, ChevronRight, ExternalLink, Filter
} from 'lucide-react';
import jsPDF from 'jspdf';

/* ───────── Types ───────── */
interface Job {
  id: number;
  title: string;
  company: string;
  company_type: string;
  location: string;
  work_mode: string;
  salary_range: string;
  experience_required: string;
  posted_ago: string;
  applicants: number;
  tech_stack: string[];
  key_requirements: string[];
  match_score: number;
  match_reasoning: string;
  skill_overlap: string[];
  skill_gaps: string[];
  experience_compensated: boolean;
  compensation_note: string;
  worth_applying: boolean;
  worth_reasoning: string;
  priority: string;
}

interface CandidateSummary {
  detected_role: string;
  experience_level: string;
  primary_skills: string[];
  secondary_skills: string[];
  estimated_market_value: string;
}

interface DeepAnalysis {
  match_score: number;
  top_strengths: string[];
  critical_gaps: string[];
  experience_compensation: { applies: boolean; explanation: string };
  hidden_advantages: string[];
  interview_topics_to_prepare: string[];
  estimated_success_rate: string;
}

interface JobAnalysisResult {
  deep_analysis: DeepAnalysis;
  tailored_resume: { content: string };
  skill_gap_plan: {
    critical_gaps: Array<{ skill: string; action: string; time_estimate: string }>;
    recommended_project: { title: string; description: string; skills_covered: string[] };
  };
  application_tips: string[];
}

/* ───────── Helpers ───────── */
function getScoreColor(score: number) {
  if (score >= 70) return { text: 'text-emerald-400', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/20' };
  if (score >= 40) return { text: 'text-yellow-400', bg: 'bg-yellow-500', glow: 'shadow-yellow-500/20' };
  return { text: 'text-red-400', bg: 'bg-red-500', glow: 'shadow-red-500/20' };
}

function getPriorityStyles(priority: string) {
  if (priority === 'high') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (priority === 'medium') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
  return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
}

const LOADING_STEPS = [
  { icon: FileText, label: 'Reading your profile...' },
  { icon: Radar, label: 'Scanning job portals...' },
  { icon: BarChart3, label: 'Scoring by salary & tech stack...' },
  { icon: Target, label: 'Evaluating experience fit...' },
  { icon: Brain, label: 'Checking project-based compensation...' },
  { icon: Sparkles, label: 'Ranking best opportunities...' },
];

/* ═══════════════════════ COMPONENT ═══════════════════════ */
export default function JobScoutPage() {
  const { t } = useLanguage();
  // ── State ──
  const [candidateProfile, setCandidateProfile] = useState('');
  const [hasImported, setHasImported] = useState(false);
  const [preferences, setPreferences] = useState({
    salaryRange: '',
    location: '',
    workMode: '',
    experienceLevel: '',
  });
  const [showPrefs, setShowPrefs] = useState(false);

  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [candidateSummary, setCandidateSummary] = useState<CandidateSummary | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<'all' | 'worth'>('all');

  // Job analysis state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ── Import from Portfolio (manual) ──
  const importFromPortfolio = () => {
    try {
      const saved = localStorage.getItem('RUBIX_portfolio');
      if (saved) {
        const portfolio = JSON.parse(saved);
        const profile = [
          portfolio.personalInfo?.name ? `Name: ${portfolio.personalInfo.name}` : '',
          portfolio.personalInfo?.role ? `Role: ${portfolio.personalInfo.role}` : '',
          portfolio.personalInfo?.email ? `Email: ${portfolio.personalInfo.email}` : '',
          portfolio.personalInfo?.github ? `GitHub: ${portfolio.personalInfo.github}` : '',
          portfolio.personalInfo?.linkedin ? `LinkedIn: ${portfolio.personalInfo.linkedin}` : '',
          portfolio.summary ? `\nProfessional Summary:\n${portfolio.summary}` : '',
          portfolio.skills?.technical?.filter(Boolean).length ? `\nTechnical Skills: ${portfolio.skills.technical.filter(Boolean).join(', ')}` : '',
          portfolio.skills?.soft?.filter(Boolean).length ? `Soft Skills: ${portfolio.skills.soft.filter(Boolean).join(', ')}` : '',
          ...(portfolio.experience || []).filter((exp: any) => exp.role || exp.company).map((exp: any) =>
            `\n${exp.role} at ${exp.company} (${exp.duration})\n  → ${exp.impact}`
          ),
        ].filter(Boolean).join('\n');
        if (profile.length > 20) {
          setCandidateProfile(profile);
          setHasImported(true);
        } else {
          setError('Portfolio is empty. Go to Portfolio Builder to add your details first.');
        }
      } else {
        setError('No portfolio found. Go to Portfolio Builder to create your profile first.');
      }
    } catch {
      setError('Failed to import portfolio data.');
    }
  };

  // ── Search Jobs ──
  const searchJobs = async () => {
    if (!candidateProfile.trim()) {
      setError('Please provide your profile first. Go to Resume Parser to import your data.');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchStep(0);
    setJobs([]);
    setCandidateSummary(null);
    setSelectedJob(null);
    setJobAnalysis(null);

    const stepInterval = setInterval(() => {
      setSearchStep(prev => prev < LOADING_STEPS.length - 1 ? prev + 1 : prev);
    }, 2500);

    try {
      const res = await fetch('/api/job-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'search', candidateProfile, preferences }),
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setCandidateSummary(data.candidate_summary);
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to search jobs.');
    } finally {
      clearInterval(stepInterval);
      setIsSearching(false);
    }
  };

  // ── Analyze Specific Job ──
  const analyzeJob = async (job: Job) => {
    setSelectedJob(job);
    setIsAnalyzing(true);
    setJobAnalysis(null);

    try {
      const res = await fetch('/api/job-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', candidateProfile, job }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data: JobAnalysisResult = await res.json();
      setJobAnalysis(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze job.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyResume = () => {
    if (jobAnalysis?.tailored_resume?.content) {
      navigator.clipboard.writeText(jobAnalysis.tailored_resume.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadPDF = () => {
    if (!jobAnalysis?.tailored_resume?.content || !selectedJob) return;
    const doc = new jsPDF();
    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const lines = doc.splitTextToSize(jobAnalysis.tailored_resume.content, maxWidth);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let y = margin;
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    }
    doc.save(`resume-${selectedJob.company.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const filteredJobs = filter === 'worth' ? jobs.filter(j => j.worth_applying) : jobs;

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-4"
          >
            <Radar className="w-4 h-4" />
            Job Scout AI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-3"
          >
            {t('jobscout.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--color-muted)] max-w-2xl mx-auto"
          >
            {t('jobscout.subtitle')}
          </motion.p>
        </div>

        {/* ══════ PHASE 1: PROFILE + PREFERENCES ══════ */}
        {jobs.length === 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Profile Card */}
            <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t('jobscout.yourProfile')}</h3>
                    <p className="text-xs text-[var(--color-muted)]">
                      {hasImported ? '✅ Imported from Portfolio' : t('jobscout.yourProfileDesc')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={importFromPortfolio}
                  className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-medium hover:bg-[var(--color-primary)]/20 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  {t('jobscout.importFromPortfolio')}
                </button>
              </div>
              <textarea
                value={candidateProfile}
                onChange={e => { setCandidateProfile(e.target.value); setHasImported(false); }}
                placeholder="Click 'Import from Portfolio' to load your profile...&#10;&#10;Or paste your resume text here: skills, experience, projects, education, etc."
                className="w-full h-48 bg-black/30 rounded-2xl p-4 text-sm text-gray-200 placeholder:text-gray-600 border border-white/5 focus:border-[var(--color-primary)]/30 focus:outline-none resize-none transition-colors"
              />
            </div>

            {/* Preferences Toggle */}
            <button
              onClick={() => setShowPrefs(!showPrefs)}
              className="w-full flex items-center justify-between px-5 py-3 rounded-2xl glass border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-[var(--color-muted)]" />
                <span className="text-sm font-medium text-white">{t('jobscout.searchPrefs')}</span>
                <span className="text-xs text-[var(--color-muted)]">(optional)</span>
              </div>
              {showPrefs ? <ChevronUp className="w-4 h-4 text-[var(--color-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-muted)]" />}
            </button>

            <AnimatePresence>
              {showPrefs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4 p-5 glass rounded-2xl border border-[var(--color-border)]">
                    <div>
                      <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">{t('jobscout.salaryRange')}</label>
                      <input
                        value={preferences.salaryRange}
                        onChange={e => setPreferences(p => ({ ...p, salaryRange: e.target.value }))}
                        placeholder="e.g., ₹6-12 LPA"
                        className="w-full px-3 py-2 bg-black/30 rounded-xl text-sm text-white border border-white/5 focus:border-[var(--color-primary)]/30 focus:outline-none placeholder:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">{t('jobscout.location')}</label>
                      <input
                        value={preferences.location}
                        onChange={e => setPreferences(p => ({ ...p, location: e.target.value }))}
                        placeholder="e.g., Bangalore, Remote"
                        className="w-full px-3 py-2 bg-black/30 rounded-xl text-sm text-white border border-white/5 focus:border-[var(--color-primary)]/30 focus:outline-none placeholder:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">{t('jobscout.workMode')}</label>
                      <select
                        value={preferences.workMode}
                        onChange={e => setPreferences(p => ({ ...p, workMode: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/30 rounded-xl text-sm text-white border border-white/5 focus:border-[var(--color-primary)]/30 focus:outline-none"
                      >
                        <option value="">Any</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-site</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">{t('jobscout.experienceLevel')}</label>
                      <select
                        value={preferences.experienceLevel}
                        onChange={e => setPreferences(p => ({ ...p, experienceLevel: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/30 rounded-xl text-sm text-white border border-white/5 focus:border-[var(--color-primary)]/30 focus:outline-none"
                      >
                        <option value="">Auto-detect</option>
                        <option value="intern">Intern</option>
                        <option value="junior">Junior (0-2 years)</option>
                        <option value="mid">Mid (2-5 years)</option>
                        <option value="senior">Senior (5+ years)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scout Button */}
            <button
              onClick={searchJobs}
              disabled={!candidateProfile.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-bold text-lg shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <Radar className="w-5 h-5" />
              {t('jobscout.scoutJobs')}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 flex items-center gap-3 text-red-400"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ══════ LOADING STATE ══════ */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto glass rounded-3xl p-10 border border-[var(--color-border)] text-center"
            >
              <div className="relative w-28 h-28 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-t-[var(--color-primary)] border-r-transparent border-b-[var(--color-accent)]/30 border-l-transparent rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 border-2 border-t-transparent border-r-[var(--color-accent)] border-b-transparent border-l-[var(--color-primary)]/30 rounded-full"
                />
                <Radar className="absolute inset-0 m-auto w-10 h-10 text-[var(--color-primary)] animate-pulse" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{t('jobscout.scanning')}</h3>
              <p className="text-[var(--color-muted)] mb-8 text-sm">{t('jobscout.scanningDesc')}</p>

              <div className="space-y-3 text-left">
                {LOADING_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i === searchStep;
                  const isDone = i < searchStep;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: isDone || isActive ? 1 : 0.3, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20' : ''}`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin flex-shrink-0" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${isActive ? 'text-white font-medium' : isDone ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════ PHASE 2: JOB LISTINGS ══════ */}
        {jobs.length > 0 && !selectedJob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Candidate Summary */}
            {candidateSummary && (
              <div className="glass rounded-3xl p-6 border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-5 h-5 text-[var(--color-primary)]" />
                      <span className="text-xs text-[var(--color-primary)] font-medium uppercase tracking-wider">AI Profile Analysis</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{candidateSummary.detected_role}</h2>
                    <p className="text-[var(--color-muted)] text-sm mt-1">
                      {candidateSummary.experience_level} • Market Value: <span className="text-[var(--color-accent)] font-semibold">{candidateSummary.estimated_market_value}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidateSummary.primary_skills.slice(0, 6).map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-accent)] text-xs font-medium border border-[var(--color-primary)]/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
                {filteredJobs.length} {t('jobscout.jobsFound')}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-[var(--color-muted)] hover:text-white'}`}
                >
                  {t('jobscout.all')}
                </button>
                <button
                  onClick={() => setFilter('worth')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'worth' ? 'bg-emerald-500/20 text-emerald-400' : 'text-[var(--color-muted)] hover:text-white'}`}
                >
                  ✓ {t('jobscout.worthApplying')}
                </button>
                <button
                  onClick={() => { setJobs([]); setCandidateSummary(null); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-muted)] hover:text-white transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> {t('jobscout.rescan')}
                </button>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={`glass rounded-2xl border transition-all hover:border-[var(--color-primary)]/40 ${job.worth_applying ? 'border-[var(--color-border)]' : 'border-[var(--color-border)] opacity-75'}`}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-white">{job.title}</h4>
                              {job.experience_compensated && (
                                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1">
                                  <Zap className="w-3 h-3" /> EXP COMPENSATED
                                </span>
                              )}
                            </div>
                            <p className="text-[var(--color-muted)] flex items-center gap-1.5 text-sm">
                              <Building2 className="w-3.5 h-3.5" />
                              {job.company}
                              <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 ml-1">{job.company_type}</span>
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getPriorityStyles(job.priority)}`}>
                            {job.priority} priority
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <IndianRupee className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                            <span className="font-semibold text-[var(--color-accent)]">{job.salary_range}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {job.experience_required}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {job.applicants} applicants
                          </span>
                          <span className="text-xs text-gray-500">{job.posted_ago}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {job.tech_stack.map(t => {
                            const isMatch = job.skill_overlap.some(s => s.toLowerCase() === t.toLowerCase());
                            return (
                              <span key={t} className={`px-2 py-0.5 rounded-lg text-xs font-medium border ${isMatch ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                                {isMatch && '✓ '}{t}
                              </span>
                            );
                          })}
                        </div>

                        <p className="text-xs text-[var(--color-muted)] leading-relaxed">{job.match_reasoning}</p>

                        {job.experience_compensated && job.compensation_note && (
                          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
                            <Lightbulb className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-purple-300">{job.compensation_note}</p>
                          </div>
                        )}
                      </div>

                      {/* Right — Score & Action */}
                      <div className="flex flex-col items-center gap-3 min-w-[120px]">
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                            <circle
                              cx="40" cy="40" r="34" fill="none"
                              stroke={job.match_score >= 70 ? '#34d399' : job.match_score >= 40 ? '#facc15' : '#f87171'}
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 34}`}
                              strokeDashoffset={2 * Math.PI * 34 * (1 - job.match_score / 100)}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-lg font-black ${getScoreColor(job.match_score).text}`}>{job.match_score}%</span>
                          </div>
                        </div>

                        {job.worth_applying ? (
                          <button
                            onClick={() => analyzeJob(job)}
                            className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary)]/80 hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {t('jobscout.generateResume')}
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--color-muted)] text-center">{job.worth_reasoning}</span>
                        )}
                      </div>
                    </div>

                    {/* Skill gaps preview */}
                    {job.skill_gaps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-medium">Gaps:</span>
                        {job.skill_gaps.map(g => (
                          <span key={g} className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] border border-red-500/20">{g}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════ PHASE 3: JOB DEEP ANALYSIS + RESUME ══════ */}
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Back button */}
            <button
              onClick={() => { setSelectedJob(null); setJobAnalysis(null); }}
              className="flex items-center gap-2 text-[var(--color-muted)] hover:text-white transition text-sm"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              {t('jobscout.backToJobs')}
            </button>

            {/* Job Header */}
            <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedJob.title}</h2>
                  <p className="text-[var(--color-muted)]">{selectedJob.company} • {selectedJob.location} • {selectedJob.salary_range}</p>
                </div>
                <div className={`text-3xl font-black ${getScoreColor(selectedJob.match_score).text}`}>
                  {selectedJob.match_score}%
                </div>
              </div>
            </div>

            {/* Loading / Results */}
            {isAnalyzing ? (
              <div className="glass rounded-3xl p-10 border border-[var(--color-border)] text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  />
                  <FileText className="absolute inset-0 m-auto w-8 h-8 text-[var(--color-primary)] animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Generating Tailored Resume</h3>
                <p className="text-[var(--color-muted)] text-sm">Crafting an ATS-optimized resume for {selectedJob.company}...</p>
              </div>
            ) : jobAnalysis ? (
              <div className="space-y-6">
                {/* Deep Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6 border border-emerald-500/20">
                    <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <CheckCircle className="w-4 h-4" /> {t('jobscout.topStrengths')}
                    </h3>
                    <div className="space-y-2">
                      {jobAnalysis.deep_analysis.top_strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-500/5">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 border border-red-500/20">
                    <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" /> {t('jobscout.criticalGaps')}
                    </h3>
                    <div className="space-y-2">
                      {jobAnalysis.deep_analysis.critical_gaps.map((g, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-red-500/5">
                          <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experience Compensation */}
                {jobAnalysis.deep_analysis.experience_compensation.applies && (
                  <div className="glass rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-400 text-sm mb-1">Experience Compensation Active</h4>
                        <p className="text-sm text-gray-300">{jobAnalysis.deep_analysis.experience_compensation.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Rate */}
                <div className="glass rounded-2xl p-5 border border-[var(--color-border)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-sm font-bold text-white">{t('jobscout.successRate')}</p>
                      <p className="text-xs text-[var(--color-muted)]">Based on profile-to-job alignment</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[var(--color-accent)]">{jobAnalysis.deep_analysis.estimated_success_rate}</span>
                </div>

                {/* Tailored Resume */}
                <div className="glass rounded-3xl border border-[var(--color-primary)]/30 overflow-hidden">
                  <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                      <div>
                        <h3 className="font-bold text-white">Tailored Resume for {selectedJob.company}</h3>
                        <p className="text-xs text-[var(--color-muted)]">ATS-optimized • Truthful • Job-specific</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyResume}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition flex items-center gap-1.5 border border-white/10"
                      >
                        {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={downloadPDF}
                        className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium hover:bg-[var(--color-primary)]/90 transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                  <pre className="p-5 text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-[500px] bg-black/30">
                    {jobAnalysis.tailored_resume.content}
                  </pre>
                </div>

                {/* Skill Gap Plan */}
                {jobAnalysis.skill_gap_plan.critical_gaps.length > 0 && (
                  <div className="glass rounded-2xl p-6 border border-[var(--color-border)]">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-blue-400" /> Skill Gap Recovery Plan
                    </h3>
                    <div className="space-y-3 mb-5">
                      {jobAnalysis.skill_gap_plan.critical_gaps.map((gap, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <Code className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-white">{gap.skill}</p>
                              <span className="text-[10px] text-[var(--color-muted)]">{gap.time_estimate}</span>
                            </div>
                            <p className="text-xs text-[var(--color-muted)]">{gap.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {jobAnalysis.skill_gap_plan.recommended_project && (
                      <div className="p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                        <h4 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Rocket className="w-3.5 h-3.5" /> Recommended Project
                        </h4>
                        <p className="font-bold text-white text-sm mb-1">{jobAnalysis.skill_gap_plan.recommended_project.title}</p>
                        <p className="text-xs text-[var(--color-muted)] mb-2">{jobAnalysis.skill_gap_plan.recommended_project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {jobAnalysis.skill_gap_plan.recommended_project.skills_covered.map(s => (
                            <span key={s} className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-accent)] rounded text-[10px] font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Application Tips */}
                {jobAnalysis.application_tips && jobAnalysis.application_tips.length > 0 && (
                  <div className="glass rounded-2xl p-6 border border-[var(--color-border)]">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-yellow-400" /> Application Tips
                    </h3>
                    <div className="space-y-2">
                      {jobAnalysis.application_tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-yellow-500/5">
                          <span className="text-yellow-400 text-sm">💡</span>
                          <span className="text-sm text-gray-300">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        )}

      </div>
    </main>
  );
}
