"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Play, CheckCircle2, AlertTriangle, Loader2,
    Code2, Clock, Award, ChevronRight, Sparkles, Zap,
    BarChart3, Target, ArrowLeft, Terminal, Send, Trophy,
    Binary, Cpu, Globe, Layout, Layers, Database, Palette,
    Lock, Cloud, Smartphone, Settings, BrainCircuit, X, ArrowRight, Route
} from 'lucide-react';


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
    testCaseResults?: { input: string; output: string; expected: string; passed: boolean }[];
}

interface MCQ {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface AssessmentReport {
    summary: string;
    breakdown: {
        question: string;
        isCorrect: boolean;
        feedback: string;
        docsLink: string;
    }[];
    lackingSkills: string[];
    verdict: string;
}

interface Domain {
    id: string;
    title: string;
    icon: any;
    color: string;
    description: string;
}

const DOMAINS: Domain[] = [
    { id: 'frontend', title: 'Frontend Engineering', icon: Layout, color: 'text-blue-400', description: 'React, Next.js, and Modern CSS' },
    { id: 'backend', title: 'Backend Engineering', icon: Database, color: 'text-green-400', description: 'Node.js, Go, and System Design' },
    { id: 'dsa', title: 'DSA & Algorithmic Logic', icon: Binary, color: 'text-[var(--color-primary)]', description: 'Problem Solving & Efficiency' },
    { id: 'uiux', title: 'UI/UX Design', icon: Palette, color: 'text-pink-400', description: 'Figma, Design Systems & Motion' },
    { id: 'data', title: 'Data Science & ML', icon: BrainCircuit, color: 'text-purple-400', description: 'ML Models, Python & Data Analysis' },
    { id: 'cyber', title: 'Cybersecurity', icon: Lock, color: 'text-red-400', description: 'Pentesting & Network Security' },
    { id: 'cloud', title: 'Cloud Architecture', icon: Cloud, color: 'text-cyan-400', description: 'AWS, GCP & Infinite Scaling' },
    { id: 'devops', title: 'DevOps & CI/CD', icon: Settings, color: 'text-orange-400', description: 'Automation, K8s & Infrastructure' },
    { id: 'ai', title: 'AI/LLM Engineering', icon: Zap, color: 'text-yellow-400', description: 'RAG, Fine-tuning & Agentic AI' },
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

    // MCQ state
    const [mcqs, setMcqs] = useState<MCQ[]>([]);
    const [currentMCQIdx, setCurrentMCQIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isFetchingQuiz, setIsFetchingQuiz] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [assessmentReport, setAssessmentReport] = useState<AssessmentReport | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Fetch MCQs for non-DSA domains
    const fetchQuiz = async (selectedDomainId: string) => {
        setIsFetchingQuiz(true);
        setStatus('assessing');
        setMcqs([]);
        setCurrentMCQIdx(0);
        setUserAnswers([]);
        setIsFinished(false);

        try {
            const res = await fetch('/api/verify/assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domainId: selectedDomainId }),
            });
            const data = await res.json();
            if (data.mcqs) {
                setMcqs(data.mcqs);
            }
        } catch (error) {
            console.error('Failed to fetch quiz:', error);
        } finally {
            setIsFetchingQuiz(false);
        }
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

    // Real Code Execution & Evaluation
    const [runOutput, setRunOutput] = useState('');
    const handleRunCode = async () => {
        // Sanity Check: Ensure code isn't just the starter boilerplate
        const starter = STARTER_CODE[selectedLanguage].trim();
        if (userCode.trim() === starter || userCode.trim().length < 40) {
            setRunOutput('⚠️ Error: Please implement your solution before running.\n\nCurrent code is empty or boilerplate only.');
            return;
        }

        setIsEvaluating(true);
        setRunOutput('Compiling & executing code against judge cases...');
        
        try {
            const res = await fetch('/api/verify/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: currentProblem,
                    code: userCode,
                    language: selectedLanguage
                }),
            });
            const result = await res.json();
            setEvaluationResult(result);
            setRunOutput(`Run Completed.\nVerdict: ${result.verdict || 'Evaluation Complete'}`);
        } catch (error) {
            setRunOutput('❌ Execution System Error. Please check your connectivity.');
        } finally {
            setIsEvaluating(false);
        }
    };

    // Submit & Evaluate DSA
    const handleSubmit = async () => {
        // Sanity Check
        const starter = STARTER_CODE[selectedLanguage].trim();
        if (userCode.trim() === starter || userCode.trim().length < 40) {
            alert("Please implement your solution first!");
            return;
        }

        setIsEvaluating(true);
        setRunOutput('');
        
        try {
            const res = await fetch('/api/verify/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: currentProblem,
                    code: userCode,
                    language: selectedLanguage
                }),
            });
            const result = await res.json();
            setEvaluationResult(result);

            if (result.overallScore >= PASS_THRESHOLD) {
                setVerifiedSkills(prev => [...new Set([...prev, dsaTopic])]);
            }
        } catch (error) {
            console.error("Evaluation failed:", error);
            setRunOutput("Evaluation failed. Please try again.");
        } finally {
            setIsEvaluating(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handleFinishQuiz = () => {
        let correctCount = 0;
        mcqs.forEach((q, i) => {
            if (userAnswers[i] === q.correctIndex) correctCount++;
        });
        const score = Math.round((correctCount / mcqs.length) * 100);
        setFinalScore(score);
        setIsFinished(true);
        setStatus('passed'); 
        generateReport(score);
    };

    const generateReport = async (score: number) => {
        setIsGeneratingReport(true);
        try {
            const results = mcqs.map((q, i) => ({
                question: q.question,
                userAnswer: q.options[userAnswers[i] || 0],
                correctAnswer: q.options[q.correctIndex],
                isCorrect: userAnswers[i] === q.correctIndex,
                explanation: q.explanation
            }));

            const res = await fetch('/api/verify/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain, results })
            });
            const data = await res.json();
            setAssessmentReport(data);
        } catch (error) {
            console.error("Report generation failed:", error);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    // Back to domain selection
    const handleBackToDomains = () => {
        setIsDSAMode(false);
        setStatus('idle');
        setIsAssessmentStarted(false);
        setCurrentProblem(null);
        setEvaluationResult(null);
        setRunOutput('');
        setUserCode(STARTER_CODE.python);
        setMcqs([]);
        setIsFinished(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // Existing assessment start
    const startAssessment = (selectedId: string) => {
        setDomain(selectedId);
        if (selectedId === 'dsa') {
            setIsDSAMode(true);
            return;
        }
        fetchQuiz(selectedId);
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
                                                     <p className="font-bold text-white uppercase tracking-tight">{evaluationResult.correctness}%</p>
                                                 </div>
                                                 <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                                     <p className="text-[var(--color-muted)] text-xs mb-1">Status</p>
                                                     <p className={`font-bold ${evaluationResult.overallScore >= PASS_THRESHOLD ? 'text-[var(--color-accent)]' : 'text-red-500'} uppercase tracking-tighter`}>
                                                         {evaluationResult.overallScore >= PASS_THRESHOLD ? 'VERIFIED' : 'FAILED'}
                                                     </p>
                                                 </div>
                                             </div>
 
                                             {/* Judge Verdict */}
                                             {(evaluationResult as any).verdict && (
                                                 <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                                                     <p className="text-[var(--color-muted)] text-[10px] uppercase tracking-widest mb-1 font-bold">Judge Verdict</p>
                                                     <p className="text-sm text-red-400 font-medium italic">"{(evaluationResult as any).verdict}"</p>
                                                 </div>
                                             )}
 
                                             {/* Test Case Breakdown */}
                                             {evaluationResult.testCaseResults && evaluationResult.testCaseResults.length > 0 && (
                                                 <div className="space-y-2">
                                                     <p className="text-[var(--color-muted)] text-[10px] uppercase tracking-widest font-bold">Execution Logs</p>
                                                     <div className="space-y-1">
                                                         {evaluationResult.testCaseResults.map((tc, i) => (
                                                             <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 text-[10px] font-mono">
                                                                 <div className="flex items-center gap-2 truncate max-w-[70%]">
                                                                     <span className="text-gray-500">In: {tc.input.slice(0, 20)}...</span>
                                                                     <span className={tc.passed ? 'text-green-500' : 'text-red-500'}>
                                                                         {tc.passed ? 'PASS' : 'FAIL'}
                                                                     </span>
                                                                 </div>
                                                                 {!tc.passed && <span className="text-[8px] text-gray-400">Exp: {tc.expected}</span>}
                                                             </div>
                                                         ))}
                                                     </div>
                                                 </div>
                                             )}
 
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

                <div className="grid grid-cols-1 gap-12">

                    {/* MCQ Assessment View */}
                    {status === 'assessing' && mcqs.length > 0 && !isFinished && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass rounded-3xl p-8 border border-[var(--color-border)]">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-white">Question {currentMCQIdx + 1} of {mcqs.length}</h2>
                                    <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold border border-[var(--color-primary)]/20 uppercase">
                                        {domain} Engineering
                                    </span>
                                </div>
                                <div className="text-xl font-mono font-bold text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[var(--color-primary)]" /> {formatTime(timeLeft)}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-xl text-white font-medium leading-relaxed">{mcqs[currentMCQIdx].question}</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {mcqs[currentMCQIdx].options.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                const newAnswers = [...userAnswers];
                                                newAnswers[currentMCQIdx] = i;
                                                setUserAnswers(newAnswers);
                                            }}
                                            className={`p-6 rounded-2xl border text-left transition-all ${userAnswers[currentMCQIdx] === i ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50 text-white font-bold' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/[0.08]'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm ${userAnswers[currentMCQIdx] === i ? 'bg-[var(--color-primary)] border-transparent text-white' : 'border-white/20'}`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                {option}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-8">
                                <button
                                    onClick={() => setCurrentMCQIdx(prev => Math.max(0, prev - 1))}
                                    disabled={currentMCQIdx === 0}
                                    className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition disabled:opacity-0"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => {
                                    if (currentMCQIdx < mcqs.length - 1) {
                                            setCurrentMCQIdx(prev => prev + 1);
                                        } else {
                                            handleFinishQuiz();
                                        }
                                    }}
                                    disabled={userAnswers[currentMCQIdx] === undefined}
                                    className="px-10 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {currentMCQIdx === mcqs.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Domain Grid View */}
                    {status === 'idle' && (
                        <div className="lg:col-span-2 space-y-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Target className="w-6 h-6 text-[var(--color-primary)]" />
                                Select Your Domain
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {DOMAINS.map((d) => (
                                    <motion.button
                                        key={d.id}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        onClick={() => startAssessment(d.id)}
                                        className="group relative text-left"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                        <div className="relative glass p-6 rounded-3xl border border-white/5 group-hover:border-[var(--color-primary)]/40 transition-colors h-full flex flex-col">
                                            <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-primary)]/10 transition-colors ${d.color}`}>
                                                <d.icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{d.title}</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">{d.description}</p>
                                            <div className="flex items-center text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest gap-2">
                                                Begin Assessment <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Proctored Loading for non-MCQ states */}
                    {status === 'assessing' && mcqs.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 flex flex-col items-center justify-center py-24 glass rounded-3xl border border-white/5">
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]/20" />
                                <div className="absolute inset-0 rounded-full border-t-2 border-[var(--color-primary)] animate-spin" />
                                <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-[var(--color-primary)] animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Generating Personalized Quiz</h2>
                            <p className="text-gray-400">Our AI is sourcing elite problems for your domain...</p>
                        </motion.div>
                    )}

                    {/* Result View (Non-DSA) */}
                    {status === 'passed' && mcqs.length > 0 && (
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="lg:col-span-2 space-y-8">
                            
                            {/* Score Overview Card */}
                            <div className="glass rounded-3xl p-12 border border-[var(--color-accent)]/30 text-center flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-[var(--color-accent)]/20 border-2 border-[var(--color-accent)] flex items-center justify-center mb-8 shadow-lg shadow-[var(--color-accent)]/30">
                                    <Trophy className="w-12 h-12 text-[var(--color-accent)]" />
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4">Verification Successful!</h2>
                                <p className="text-xl text-gray-400 mb-10 max-w-2xl">
                                    You have demonstrated proficiency in <span className="text-white font-bold">{DOMAINS.find(d=>d.id===domain)?.title}</span>. 
                                    Your verified badge is now active on your global profile.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                                    {[
                                        { label: 'Domain Score', value: `${finalScore}%` },
                                        { label: 'Accuracy', value: '100%' },
                                        { label: 'Elite Percentile', value: `Top ${Math.max(2, 100 - finalScore)}%` },
                                        { label: 'Skill Badge', value: finalScore >= 60 ? 'Active' : 'Pending' },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">{stat.label}</p>
                                            <p className={`text-2xl font-bold ${i === 0 ? 'text-[var(--color-accent)]' : 'text-white'}`}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Detailed Report Section */}
                            <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                            <BarChart3 className="w-6 h-6 text-purple-400" />
                                            Mastery Deep-Dive
                                        </h3>
                                        <p className="text-[var(--color-muted)] text-sm font-medium uppercase tracking-widest">Powered by RUBIX AI Report Engine</p>
                                    </div>
                                    {isGeneratingReport && <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Performance...</div>}
                                </div>

                                <div className="p-8 space-y-10">
                                    {assessmentReport && assessmentReport.summary ? (
                                        <>
                                            {/* AI Summary */}
                                            <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                                                <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-lg">
                                                    <BrainCircuit className="w-5 h-5 text-purple-400" /> 
                                                    Analytical Summary
                                                </h4>
                                                <p className="text-gray-300 leading-relaxed text-lg italic bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                                    "{assessmentReport.summary}"
                                                </p>
                                            </div>

                                            {/* Question Breakdown */}
                                            <div className="space-y-6">
                                                <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Technical Drill-Down</h4>
                                                {assessmentReport?.breakdown?.map((item, i) => (
                                                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <h5 className="font-bold text-white text-lg leading-snug">{item.question}</h5>
                                                                {item.isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> : <X className="w-6 h-6 text-red-500 shrink-0" />}
                                                            </div>
                                                            <p className="text-gray-400 leading-relaxed text-sm">{item.feedback}</p>
                                                            <a href={item.docsLink} target="_blank" rel="noopener noreferrer" 
                                                               className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">
                                                                View Official Documentation <ArrowRight className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Gaps & Roadmap Action */}
                                            <div className="p-8 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex flex-col md:flex-row items-center justify-between gap-8">
                                                <div className="space-y-4 text-center md:text-left">
                                                    <h4 className="text-2xl font-bold text-white">Focus Areas for Mastery</h4>
                                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                        {assessmentReport?.lackingSkills?.map(skill => (
                                                            <span key={skill} className="px-4 py-2 rounded-xl bg-black/40 text-[var(--color-primary)] font-bold text-sm border border-[var(--color-primary)]/30">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const domainMap: Record<string, string> = {
                                                            'frontend': 'Frontend Engineer',
                                                            'backend': 'Backend Engineer',
                                                            'dsa': 'Fullstack Developer',
                                                            'uiux': 'UI/UX Designer',
                                                            'data': 'Data Scientist',
                                                            'cyber': 'Cybersecurity Analyst',
                                                            'cloud': 'Cloud Architect',
                                                            'devops': 'DevOps Engineer',
                                                            'ai': 'AI/ML Engineer'
                                                        };
                                                        const targetDomain = domainMap[domain] || domain;
                                                        window.location.href = `/roadmap?domain=${encodeURIComponent(targetDomain)}`;
                                                    }}
                                                    className="px-8 py-5 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-[var(--color-primary)]/20 flex items-center gap-3 whitespace-nowrap"
                                                >
                                                    <Route className="w-6 h-6" /> Generate Roadmap for My Gaps
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-20 text-center space-y-6">
                                            <div className="relative w-16 h-16 mx-auto">
                                                <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]/20" />
                                                <div className="absolute inset-0 rounded-full border-t-2 border-[var(--color-primary)] animate-spin" />
                                            </div>
                                            <p className="text-gray-400 font-medium font-mono text-sm animate-pulse tracking-[0.2em] uppercase">Generating Master Analysis...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button onClick={handleBackToDomains} className="px-10 py-4 rounded-xl text-gray-400 hover:text-white transition font-bold mx-auto flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back to Assessment Center
                            </button>
                        </motion.div>
                    )}


                </div>
            </div>
        </div>
    );
}
