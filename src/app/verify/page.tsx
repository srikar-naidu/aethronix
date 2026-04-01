"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Play, CheckCircle2, AlertTriangle, Loader2,
    Code2, Clock, Award, ChevronRight, Sparkles, Zap,
    BarChart3, Target, ArrowLeft, Terminal, Send, Trophy
} from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip
} from 'recharts';

// ===== Types =====
interface DSAProblem {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    description: string;
    constraints: string[];
    examples: string[];
}

interface EvalResult {
    correctness: number;
    timeComplexity: string;
    spaceComplexity: string;
    edgeCases: number;
    optimizations: string[];
    overallScore: number;
    percentile: number;
}

// ===== Constants =====
const INITIAL_SKILLS_DATA = [
    { subject: 'React', A: 40, fullMark: 100 },
    { subject: 'TypeScript', A: 55, fullMark: 100 },
    { subject: 'Node.js', A: 30, fullMark: 100 },
    { subject: 'CSS/UI', A: 65, fullMark: 100 },
    { subject: 'System Design', A: 20, fullMark: 100 },
];

const DSA_TOPICS = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs', 'Sorting', 'Binary Search'];
const DSA_DIFFICULTIES: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
const LANGUAGES = [
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
];

const STARTER_CODE: Record<string, string> = {
    python: `class Solution:\n    def solve(self, nums, target):\n        # Write your solution here\n        pass\n`,
    javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction solve(nums, target) {\n    // Write your solution here\n}\n`,
    cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};\n`,
    java: `import java.util.*;\n\nclass Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n    }\n}\n`,
};

const DIFFICULTY_COLORS: Record<string, string> = {
    Easy: 'text-green-400 bg-green-500/20 border-green-500/30',
    Medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    Hard: 'text-red-400 bg-red-500/20 border-red-500/30',
};

const PASS_THRESHOLD = 70;

// ===== Component =====
export default function VerifyPage() {
    // Existing state
    const [domain, setDomain] = useState('frontend');
    const [status, setStatus] = useState<'idle' | 'assessing' | 'passed'>('idle');

    // DSA state
    const [isDSAMode, setIsDSAMode] = useState(false);
    const [dsaTopic, setDsaTopic] = useState('Arrays');
    const [dsaDifficulty, setDsaDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
    const [currentProblem, setCurrentProblem] = useState<DSAProblem | null>(null);
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
    const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [userCode, setUserCode] = useState(STARTER_CODE.python);
    const [evaluationResult, setEvaluationResult] = useState<EvalResult | null>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);

    // Timer
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 min
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Timer logic
    useEffect(() => {
        if (isAssessmentStarted && timeLeft > 0 && !evaluationResult) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isAssessmentStarted, evaluationResult]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Fetch DSA problem from API
    const fetchProblem = async () => {
        setIsLoadingQuestion(true);
        setCurrentProblem(null);
        setEvaluationResult(null);

        try {
            const res = await fetch('/api/verify/dsa-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: dsaTopic, difficulty: dsaDifficulty }),
            });
            const data = await res.json();
            setCurrentProblem(data);
        } catch {
            setCurrentProblem({
                title: "Two Sum",
                difficulty: dsaDifficulty,
                topic: dsaTopic,
                description: "Given an array of integers and a target, return indices of two numbers that add up to the target.",
                constraints: ["2 <= nums.length <= 10^4", "Only one valid answer exists."],
                examples: ["Input: [2,7,11,15], target=9\nOutput: [0,1]"],
            });
        } finally {
            setIsLoadingQuestion(false);
        }
    };

    // Start DSA assessment
    const startDSAAssessment = async () => {
        setIsAssessmentStarted(true);
        setTimeLeft(45 * 60);
        setUserCode(STARTER_CODE[selectedLanguage]);
        await fetchProblem();
    };

    // Language change
    const handleLanguageChange = (lang: string) => {
        setSelectedLanguage(lang);
        if (!evaluationResult) {
            setUserCode(STARTER_CODE[lang]);
        }
    };

    // Mock Run Code
    const [runOutput, setRunOutput] = useState('');
    const handleRunCode = () => {
        setRunOutput('Running test cases...\n\nTest Case 1: ✅ Passed\nTest Case 2: ✅ Passed\nTest Case 3: ⏳ Running...');
        setTimeout(() => {
            setRunOutput('Test Case 1: ✅ Passed\nTest Case 2: ✅ Passed\nTest Case 3: ✅ Passed\n\n3/3 test cases passed.');
        }, 1500);
    };

    // Submit & Evaluate
    const handleSubmit = () => {
        setIsEvaluating(true);
        setRunOutput('');
        setTimeout(() => {
            const score = Math.floor(Math.random() * 30) + 70; // 70-100
            const result: EvalResult = {
                correctness: Math.min(score + 5, 100),
                timeComplexity: score > 85 ? 'O(n) — Optimal' : 'O(n²) — Can be improved',
                spaceComplexity: score > 80 ? 'O(1) — Excellent' : 'O(n) — Acceptable',
                edgeCases: Math.floor(Math.random() * 20) + 80,
                optimizations: score > 85
                    ? ['Great use of hash maps for O(1) lookups', 'Clean edge case handling']
                    : ['Consider using a hash map for O(n) solution', 'Add null/empty input checks', 'Handle duplicate values'],
                overallScore: score,
                percentile: Math.floor(Math.random() * 15) + 80,
            };
            setEvaluationResult(result);
            setIsEvaluating(false);
            if (timerRef.current) clearInterval(timerRef.current);

            if (score >= PASS_THRESHOLD) {
                setVerifiedSkills(prev => [...new Set([...prev, dsaTopic])]);
            }
        }, 2500);
    };

    // Back to domain selection
    const handleBackToDomains = () => {
        setIsDSAMode(false);
        setIsAssessmentStarted(false);
        setCurrentProblem(null);
        setEvaluationResult(null);
        setRunOutput('');
        setUserCode(STARTER_CODE.python);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // Existing assessment start
    const startAssessment = () => {
        if (domain === 'dsa') {
            setIsDSAMode(true);
            return;
        }
        setStatus('assessing');
        setTimeout(() => setStatus('passed'), 3000);
    };

    // ===== DSA WORKSPACE RENDER =====
    if (isDSAMode) {
        // Pre-assessment: topic + difficulty selection
        if (!isAssessmentStarted) {
            return (
                <div className="min-h-screen pt-24 pb-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                        <button onClick={handleBackToDomains} className="flex items-center gap-2 text-[var(--color-muted)] hover:text-white mb-6 transition">
                            <ArrowLeft className="w-4 h-4" /> Back to Domains
                        </button>

                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                                <Code2 className="w-10 h-10 text-[var(--color-primary)]" />
                                DSA Coding Assessment
                            </h1>
                            <p className="text-[var(--color-muted)] text-lg">Choose your topic and difficulty to generate an AI-powered coding challenge.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {/* Topic */}
                            <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-purple-400" /> Select Topic
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {DSA_TOPICS.map(t => (
                                        <button key={t} onClick={() => setDsaTopic(t)}
                                            className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${dsaTopic === t ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                                        >{t}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" /> Select Difficulty
                                </h3>
                                <div className="space-y-3">
                                    {DSA_DIFFICULTIES.map(d => (
                                        <button key={d} onClick={() => setDsaDifficulty(d)}
                                            className={`w-full p-4 rounded-xl border text-left transition-all ${dsaDifficulty === d ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                        >
                                            <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[d]}`}>{d}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
                                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                                    45 min time limit · Pass threshold: {PASS_THRESHOLD}%
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <button onClick={startDSAAssessment}
                                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-purple-500 text-white font-bold text-lg shadow-lg shadow-[var(--color-primary)]/30 hover:scale-105 transition-all flex items-center gap-3 mx-auto">
                                <Sparkles className="w-5 h-5" /> Generate Problem & Start
                            </button>
                        </div>

                        {/* Verified Skills */}
                        {verifiedSkills.length > 0 && (
                            <div className="mt-10 glass rounded-3xl p-6 border border-[var(--color-border)] max-w-3xl mx-auto">
                                <h3 className="font-bold text-sm mb-3 text-[var(--color-accent)] uppercase tracking-wider flex items-center gap-2"><Award className="w-4 h-4" /> Verified DSA Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {verifiedSkills.map(s => (
                                        <span key={s} className="px-3 py-1.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-sm font-bold border border-[var(--color-accent)]/30 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Active DSA workspace
        return (
            <div className="min-h-screen pt-20 pb-6">
                <div className="container mx-auto px-4 lg:px-6">

                    {/* Top Bar: Problem Title + Timer */}
                    <div className="glass rounded-2xl p-4 border border-[var(--color-border)] mb-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button onClick={handleBackToDomains} className="p-2 rounded-xl hover:bg-white/10 text-[var(--color-muted)] hover:text-white transition">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            {isLoadingQuestion ? (
                                <div className="flex items-center gap-2 text-[var(--color-muted)]"><Loader2 className="w-4 h-4 animate-spin" /> Generating problem...</div>
                            ) : currentProblem ? (
                                <>
                                    <h2 className="font-bold text-lg text-white">{currentProblem.title}</h2>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${DIFFICULTY_COLORS[currentProblem.difficulty]}`}>
                                        {currentProblem.difficulty}
                                    </span>
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">
                                        {currentProblem.topic}
                                    </span>
                                </>
                            ) : null}
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold ${timeLeft < 300 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-black/30 text-white'}`}>
                            <Clock className="w-4 h-4" />
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4" style={{ height: 'calc(100vh - 10rem)' }}>

                        {/* LEFT: Problem Description */}
                        <div className="glass rounded-2xl border border-[var(--color-border)] p-6 overflow-y-auto">
                            {isLoadingQuestion ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-6 bg-white/10 rounded w-3/4" />
                                    <div className="h-4 bg-white/5 rounded w-full" />
                                    <div className="h-4 bg-white/5 rounded w-5/6" />
                                    <div className="h-4 bg-white/5 rounded w-full" />
                                    <div className="h-32 bg-white/5 rounded mt-6" />
                                </div>
                            ) : currentProblem ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-xl text-white mb-3">Problem Description</h3>
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{currentProblem.description}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-sm text-[var(--color-muted)] uppercase tracking-wider mb-2">Constraints</h4>
                                        <ul className="space-y-1">
                                            {currentProblem.constraints.map((c, i) => (
                                                <li key={i} className="text-sm text-gray-400 font-mono bg-black/30 px-3 py-1.5 rounded-lg">• {c}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-sm text-[var(--color-muted)] uppercase tracking-wider mb-2">Examples</h4>
                                        {currentProblem.examples.map((ex, i) => (
                                            <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/5 mb-3 font-mono text-sm text-gray-300 whitespace-pre-wrap">
                                                {ex}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* RIGHT: Code Editor + Output */}
                        <div className="flex flex-col gap-4" style={{ height: '100%' }}>

                            {/* Language Selector */}
                            <div className="glass rounded-2xl border border-[var(--color-border)] p-3 flex items-center gap-2">
                                {LANGUAGES.map(lang => (
                                    <button key={lang.id} onClick={() => handleLanguageChange(lang.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedLanguage === lang.id ? 'bg-[var(--color-primary)] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                                    >{lang.label}</button>
                                ))}
                            </div>

                            {/* Code Editor (textarea fallback) */}
                            <div className="flex-1 glass rounded-2xl border border-[var(--color-border)] overflow-hidden flex flex-col min-h-0">
                                <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 bg-black/30 shrink-0">
                                    <Code2 className="w-4 h-4 text-[var(--color-primary)]" />
                                    <span className="text-xs font-bold text-[var(--color-muted)]">solution.{selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'java' ? 'java' : selectedLanguage === 'python' ? 'py' : 'js'}</span>
                                </div>
                                <textarea
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    disabled={!!evaluationResult}
                                    className="flex-1 w-full bg-[#0d1117] text-green-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
                                    spellCheck={false}
                                    placeholder="Write your solution here..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 shrink-0">
                                <button onClick={handleRunCode} disabled={!!evaluationResult || isEvaluating}
                                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold flex items-center justify-center gap-2 transition disabled:opacity-50">
                                    <Terminal className="w-4 h-4" /> Run Code
                                </button>
                                <button onClick={handleSubmit} disabled={!!evaluationResult || isEvaluating}
                                    className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-black font-bold flex items-center justify-center gap-2 transition disabled:opacity-50">
                                    {isEvaluating ? <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating...</> : <><Send className="w-4 h-4" /> Submit Code</>}
                                </button>
                            </div>

                            {/* Output / Evaluation */}
                            <div className="glass rounded-2xl border border-[var(--color-border)] p-4 shrink-0 max-h-[250px] overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {evaluationResult ? (
                                        <motion.div key="eval" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-400" /> AI Evaluation</h4>
                                                <span className={`text-2xl font-bold ${evaluationResult.overallScore >= PASS_THRESHOLD ? 'text-[var(--color-accent)]' : 'text-red-400'}`}>
                                                    {evaluationResult.overallScore}%
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                                    <p className="text-[var(--color-muted)] text-xs mb-1">Correctness</p>
                                                    <p className="font-bold text-white">{evaluationResult.correctness}%</p>
                                                </div>
                                                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                                    <p className="text-[var(--color-muted)] text-xs mb-1">Edge Cases</p>
                                                    <p className="font-bold text-white">{evaluationResult.edgeCases}%</p>
                                                </div>
                                                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                                    <p className="text-[var(--color-muted)] text-xs mb-1">Time Complexity</p>
                                                    <p className="font-bold text-[var(--color-accent)] text-xs">{evaluationResult.timeComplexity}</p>
                                                </div>
                                                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                                    <p className="text-[var(--color-muted)] text-xs mb-1">Space Complexity</p>
                                                    <p className="font-bold text-blue-400 text-xs">{evaluationResult.spaceComplexity}</p>
                                                </div>
                                            </div>

                                            <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                                <p className="text-[var(--color-muted)] text-xs mb-2">Optimization Suggestions</p>
                                                <ul className="space-y-1">
                                                    {evaluationResult.optimizations.map((o, i) => (
                                                        <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                                                            <ChevronRight className="w-3 h-3 text-[var(--color-primary)] shrink-0 mt-0.5" /> {o}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Badge Unlock */}
                                            {evaluationResult.overallScore >= PASS_THRESHOLD && (
                                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                                                    className="p-4 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 text-center">
                                                    <Trophy className="w-8 h-8 text-[var(--color-accent)] mx-auto mb-2" />
                                                    <p className="font-bold text-[var(--color-accent)]">🎉 Verified Badge Unlocked!</p>
                                                    <p className="text-xs text-gray-400 mt-1">Top {100 - evaluationResult.percentile}% in {currentProblem?.topic}</p>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ) : runOutput ? (
                                        <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <h4 className="font-bold text-sm text-[var(--color-muted)] mb-2 flex items-center gap-2"><Terminal className="w-4 h-4" /> Output</h4>
                                            <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">{runOutput}</pre>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[var(--color-muted)] py-4 opacity-60">
                                            <Terminal className="w-6 h-6 mx-auto mb-2" />
                                            <p className="text-sm">Run or submit your code to see output</p>
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

    // ===== ORIGINAL VERIFY PAGE (extended with DSA option) =====
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                        <ShieldCheck className="w-12 h-12 text-[var(--color-primary)]" />
                        AI Skill Verification
                    </h1>
                    <p className="text-xl text-[var(--color-muted)]">
                        Prove your capabilities in real-time. Earn verified badges to skip technical rounds at top startups.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Assessment Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass rounded-3xl p-8 border border-[var(--color-border)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl -mr-32 -mt-32" />

                        <h2 className="text-2xl font-bold mb-6 relative z-10">Start Assessment</h2>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-muted)]">Select Domain</label>
                                <select
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    disabled={status !== 'idle'}
                                    className="w-full bg-black/30 border border-[var(--color-border)] rounded-xl p-4 text-white focus:outline-none focus:border-[var(--color-primary)] appearance-none cursor-pointer"
                                >
                                    <option value="frontend">Frontend Engineering (React/Next.js)</option>
                                    <option value="backend">Backend Engineering (Node/Python)</option>
                                    <option value="data">Data Science &amp; ML</option>
                                    <option value="design">UI/UX Design</option>
                                    <option value="dsa">⚡ DSA / Coding Assessment</option>
                                </select>
                            </div>

                            {domain === 'dsa' && status === 'idle' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-sm text-gray-300">
                                    <Code2 className="w-5 h-5 text-[var(--color-primary)] inline mr-2" />
                                    This will open a <strong className="text-white">full coding workspace</strong> with AI-generated problems, a code editor, and real-time evaluation.
                                </motion.div>
                            )}

                            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-4 items-start">
                                <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                <div className="text-sm text-orange-200/80">
                                    <p className="font-medium text-orange-400 mb-1">Assessment Rules:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>45 minutes time limit</li>
                                        <li>Proctored via AI (Camera/Mic required)</li>
                                        <li>No tab switching allowed</li>
                                    </ul>
                                </div>
                            </div>

                            {status === 'idle' && (
                                <button
                                    onClick={startAssessment}
                                    className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-lg hover:bg-[var(--color-primary)]/90 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {domain === 'dsa' ? 'Open DSA Workspace' : 'Begin Test'}
                                </button>
                            )}

                            {status === 'assessing' && (
                                <div className="w-full py-4 rounded-xl bg-[var(--color-border)] text-white font-bold text-lg flex items-center justify-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
                                    Evaluating Skills with Groq AI...
                                </div>
                            )}

                            {status === 'passed' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full py-4 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)] text-[var(--color-accent)] font-bold text-lg flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                    Assessment Passed — Badge Awarded!
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Radar Chart Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass rounded-3xl p-8 border border-[var(--color-border)] flex flex-col"
                    >
                        <h2 className="text-2xl font-bold mb-2">Skill Profile</h2>
                        <p className="text-[var(--color-muted)] mb-8">Verified competency across domains</p>

                        <div className="flex-1 min-h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={status === 'passed' ? [
                                    { subject: 'React', A: 92, fullMark: 100 },
                                    { subject: 'TypeScript', A: 88, fullMark: 100 },
                                    { subject: 'Node.js', A: 75, fullMark: 100 },
                                    { subject: 'CSS/UI', A: 95, fullMark: 100 },
                                    { subject: 'System Design', A: 60, fullMark: 100 },
                                ] : INITIAL_SKILLS_DATA}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Skill Level"
                                        dataKey="A"
                                        stroke={status === 'passed' ? "#22C55E" : "#4F46E5"}
                                        fill={status === 'passed' ? "#22C55E" : "#4F46E5"}
                                        fillOpacity={0.3}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#E5E7EB' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>

                            {status === 'passed' && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', bounce: 0.5 }}
                                        className="w-24 h-24 rounded-full bg-[var(--color-accent)]/20 border-2 border-[var(--color-accent)] flex items-center justify-center backdrop-blur-sm"
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">Top 5%</div>
                                            <div className="text-[10px] text-[var(--color-accent)] font-bold uppercase tracking-wider">Frontend</div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
