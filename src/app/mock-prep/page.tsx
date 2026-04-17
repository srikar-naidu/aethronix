"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit, Mic, MicOff, Play, MessageSquare, Target,
    CheckCircle2, Clock, Calendar, ChevronRight, BarChart3,
    Users, Sparkles, FileText, Award, TrendingUp, Loader2
} from 'lucide-react';
import Flashcard from '@/components/Flashcard';

// ===== Mock Data =====
const domains = [
    { id: 'frontend', label: 'Frontend Development', icon: '⚛️' },
    { id: 'backend', label: 'Backend Engineering', icon: '⚙️' },
    { id: 'data', label: 'Data Science & ML', icon: '📊' },
    { id: 'devops', label: 'DevOps & Cloud', icon: '☁️' },
    { id: 'mobile', label: 'Mobile Development', icon: '📱' },
    { id: 'design', label: 'UI/UX Design', icon: '🎨' },
];

interface QuestionData {
    question: string;
    hint: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
}

const mockQuestions: Record<string, QuestionData[]> = {
    frontend: [
        {
            question: "Explain the difference between useMemo and useCallback in React.",
            hint: "useMemo memoizes values, useCallback memoizes functions. Both prevent unnecessary re-renders but serve different purposes in optimization.",
            difficulty: 'Medium',
            tags: ['React', 'Hooks', 'Performance']
        },
        {
            question: "How does the Virtual DOM work and why is it efficient?",
            hint: "Virtual DOM creates a lightweight copy of the real DOM. It compares changes and updates only what's necessary, batching operations for better performance.",
            difficulty: 'Easy',
            tags: ['React', 'DOM', 'Performance']
        },
        {
            question: "Describe the CSS Box Model and how box-sizing affects layout.",
            hint: "Box model includes content, padding, border, margin. box-sizing: border-box makes width/height include padding and border, preventing layout shifts.",
            difficulty: 'Easy',
            tags: ['CSS', 'Layout', 'Box Model']
        },
    ],
    backend: [
        {
            question: "What is the difference between SQL and NoSQL databases?",
            hint: "SQL is relational with fixed schemas, NoSQL is flexible and schema-less. Choose based on data structure needs and scalability requirements.",
            difficulty: 'Medium',
            tags: ['Databases', 'SQL', 'NoSQL']
        },
        {
            question: "Explain RESTful API design principles.",
            hint: "REST uses HTTP methods, stateless communication, and resource-based URLs. Focus on scalability, simplicity, and uniform interface.",
            difficulty: 'Medium',
            tags: ['APIs', 'REST', 'HTTP']
        },
        {
            question: "How would you handle authentication in a microservices architecture?",
            hint: "Use JWT tokens, API gateways for auth, and service-to-service authentication. Consider OAuth 2.0 and centralized auth services.",
            difficulty: 'Hard',
            tags: ['Microservices', 'Security', 'JWT']
        },
    ],
    data: [
        {
            question: "Explain the bias-variance tradeoff in machine learning.",
            hint: "Bias is error from wrong assumptions, variance from sensitivity to training data. Balance prevents overfitting and underfitting.",
            difficulty: 'Medium',
            tags: ['ML', 'Bias-Variance', 'Overfitting']
        },
        {
            question: "What is gradient descent and how does it optimize models?",
            hint: "Iterative optimization finding minimum loss by following negative gradient. Different variants (batch, stochastic, mini-batch) balance speed and accuracy.",
            difficulty: 'Hard',
            tags: ['ML', 'Optimization', 'Gradient Descent']
        },
        {
            question: "Describe the difference between supervised and unsupervised learning.",
            hint: "Supervised uses labeled data for prediction, unsupervised finds patterns in unlabeled data. Choose based on available data and problem type.",
            difficulty: 'Easy',
            tags: ['ML', 'Supervised', 'Unsupervised']
        },
    ],
    devops: [
        {
            question: "What is containerization and how does Docker work?",
            hint: "Containerization packages apps with dependencies. Docker creates isolated environments using Linux containers for consistent deployment.",
            difficulty: 'Medium',
            tags: ['Docker', 'Containers', 'DevOps']
        },
        {
            question: "Explain CI/CD pipelines and their benefits.",
            hint: "Continuous Integration/Deployment automates testing and deployment. Benefits include faster releases, fewer bugs, and better collaboration.",
            difficulty: 'Medium',
            tags: ['CI/CD', 'Automation', 'DevOps']
        },
        {
            question: "How would you set up monitoring for a production application?",
            hint: "Use metrics, logs, and alerts. Tools like Prometheus, Grafana, ELK stack. Monitor performance, errors, and business metrics.",
            difficulty: 'Hard',
            tags: ['Monitoring', 'Production', 'Observability']
        },
    ],
    mobile: [
        {
            question: "What is the difference between native and cross-platform development?",
            hint: "Native uses platform-specific languages, cross-platform uses one codebase. Trade-offs between performance, development speed, and maintenance.",
            difficulty: 'Easy',
            tags: ['Mobile', 'Native', 'Cross-platform']
        },
        {
            question: "Explain how React Native bridges JavaScript and native modules.",
            hint: "JavaScript runs in JS thread, communicates with native via bridge. Asynchronous communication enables native performance with JS flexibility.",
            difficulty: 'Hard',
            tags: ['React Native', 'Bridge', 'JavaScript']
        },
        {
            question: "How do you handle offline data synchronization in mobile apps?",
            hint: "Use local storage, sync queues, conflict resolution. Consider optimistic updates and background sync for better UX.",
            difficulty: 'Medium',
            tags: ['Mobile', 'Offline', 'Sync']
        },
    ],
    design: [
        {
            question: "Explain the principles of visual hierarchy in UI design.",
            hint: "Use size, color, contrast, spacing to guide attention. Most important elements should be most prominent through visual weight.",
            difficulty: 'Easy',
            tags: ['UI Design', 'Hierarchy', 'Visual Design']
        },
        {
            question: "How do you conduct effective user research?",
            hint: "Use interviews, surveys, usability testing. Define goals, recruit participants, analyze data to inform design decisions.",
            difficulty: 'Medium',
            tags: ['UX Research', 'Users', 'Methodology']
        },
        {
            question: "What is the difference between wireframes, mockups, and prototypes?",
            hint: "Wireframes show structure, mockups show visual design, prototypes show interaction. Each serves different purposes in the design process.",
            difficulty: 'Easy',
            tags: ['Design Process', 'Wireframes', 'Prototypes']
        },
    ],
};

const mockFeedback = [
    { category: 'Technical Accuracy', score: 85, color: 'var(--color-primary)' },
    { category: 'Communication', score: 78, color: 'var(--color-accent)' },
    { category: 'Problem Solving', score: 92, color: '#F59E0B' },
    { category: 'Depth of Knowledge', score: 70, color: '#EC4899' },
];

const milestones = [
    { title: 'Complete Profile Setup', done: true, date: 'Feb 15' },
    { title: 'First Mock Interview', done: true, date: 'Feb 18' },
    { title: 'Submit Portfolio Project', done: false, date: 'Mar 1' },
    { title: 'Peer Review Session', done: false, date: 'Mar 5' },
    { title: 'Final Assessment', done: false, date: 'Mar 10' },
];

const weeklySubmissions = [
    { title: 'React Todo App', status: 'Reviewed', date: 'Feb 20', feedback: 'Great component structure!' },
    { title: 'REST API Design Doc', status: 'Pending', date: 'Feb 24', feedback: '' },
    { title: 'System Design Writeup', status: 'In Review', date: 'Feb 27', feedback: '' },
];

const mentorComments = [
    { mentor: 'Dr. Priya S.', comment: 'Strong understanding of fundamentals. Work on system design patterns.', date: 'Feb 22' },
    { mentor: 'Arjun K.', comment: 'Good communication skills. Practice explaining complex topics simply.', date: 'Feb 19' },
];

const deadlines = [
    { task: 'Portfolio Submission', date: 'Mar 1, 2026', urgent: true },
    { task: 'Mock Interview #3', date: 'Mar 3, 2026', urgent: false },
    { task: 'Peer Code Review', date: 'Mar 5, 2026', urgent: false },
    { task: 'Final Presentation', date: 'Mar 10, 2026', urgent: true },
];

// ===== Component =====
export default function MockPrepPage() {
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [activeTab, setActiveTab] = useState<'interview' | 'milestones'>('interview');
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());

    const questions = selectedDomain ? mockQuestions[selectedDomain] || [] : [];
    const currentQuestionData = questions[currentQuestion] || { question: '', hint: '', difficulty: 'Medium' as const, tags: [] };
    const completedMilestones = milestones.filter(m => m.done).length;
    const progressPercent = Math.round((completedMilestones / milestones.length) * 100);

    const handleRecordToggle = () => {
        if (isRecording) {
            setIsRecording(false);
            // Simulate AI feedback after "recording"
            setTimeout(() => setShowFeedback(true), 800);
        } else {
            setIsRecording(true);
            setShowFeedback(false);
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestion(prev => (prev + 1) % questions.length);
        setShowFeedback(false);
        setIsRecording(false);
    };

    const handleBookmarkToggle = (questionKey: string) => {
        setBookmarkedQuestions(prev => {
            const newBookmarks = new Set(prev);
            if (newBookmarks.has(questionKey)) {
                newBookmarks.delete(questionKey);
            } else {
                newBookmarks.add(questionKey);
            }
            return newBookmarks;
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <Target className="w-8 h-8 text-[var(--color-primary)]" />
                        MockPrep Studio
                    </h1>
                    <p className="text-[var(--color-muted)] text-lg">AI-powered mock interviews and milestone tracking to get you interview-ready.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 mb-8 glass rounded-2xl p-1.5 w-fit border border-[var(--color-border)]">
                    <button
                        onClick={() => setActiveTab('interview')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'interview' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-muted)] hover:text-white'}`}
                    >
                        <BrainCircuit className="w-4 h-4" /> Mock Interview
                    </button>
                    <button
                        onClick={() => setActiveTab('milestones')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'milestones' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-muted)] hover:text-white'}`}
                    >
                        <Award className="w-4 h-4" /> Milestone Tracker
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {/* ===== MOCK INTERVIEW TAB ===== */}
                    {activeTab === 'interview' && (
                        <motion.div key="interview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="grid lg:grid-cols-3 gap-6">

                                {/* Left: Domain Selector + Question */}
                                <div className="lg:col-span-2 space-y-6">

                                    {/* Domain Selector */}
                                    <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-yellow-400" />
                                            Select Interview Domain
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {domains.map(domain => (
                                                <button
                                                    key={domain.id}
                                                    onClick={() => { setSelectedDomain(domain.id); setCurrentQuestion(0); setShowFeedback(false); setIsRecording(false); }}
                                                    className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] ${selectedDomain === domain.id
                                                        ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50 shadow-lg shadow-[var(--color-primary)]/10'
                                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <span className="text-2xl mb-2 block">{domain.icon}</span>
                                                    <span className="font-bold text-sm text-white">{domain.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                     {/* AI Question Generator */}
                                     {selectedDomain && (
                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                             <div className="flex justify-between items-center">
                                                 <h3 className="font-bold text-lg flex items-center gap-2">
                                                     <MessageSquare className="w-5 h-5 text-[var(--color-accent)]" />
                                                     AI Question Generator
                                                     <span className="text-xs bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-2 py-0.5 rounded-full font-bold">Groq-Ready</span>
                                                 </h3>
                                             </div>

                                             {/* Flashcard Component */}
                                             <Flashcard
                                                 question={currentQuestionData.question}
                                                 hint={currentQuestionData.hint}
                                                 difficulty={currentQuestionData.difficulty}
                                                 category={domains.find(d => d.id === selectedDomain)?.label}
                                                 tags={currentQuestionData.tags}
                                                 isBookmarked={bookmarkedQuestions.has(`${selectedDomain}-${currentQuestion}`)}
                                                 onBookmark={() => handleBookmarkToggle(`${selectedDomain}-${currentQuestion}`)}
                                                 currentIndex={currentQuestion}
                                                 total={questions.length}
                                                 onNext={handleNextQuestion}
                                                 onPrev={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                             />

                                             {/* Record Answer Section */}
                                             <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                                 <div className="flex items-center justify-between">
                                                     <div>
                                                         <h4 className="font-bold text-white mb-1">Ready to Record Your Answer?</h4>
                                                          <p className="text-sm text-[var(--color-muted)]">Click record when you&apos;re prepared to answer this question</p>
                                                     </div>
                                                     <button
                                                         onClick={handleRecordToggle}
                                                         className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${isRecording
                                                             ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                                                             : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 shadow-lg shadow-[var(--color-primary)]/20'
                                                             }`}
                                                     >
                                                         {isRecording ? (
                                                             <><Mic className="w-5 h-5" /> Stop Recording</>
                                                         ) : (
                                                             <><MicOff className="w-5 h-5" /> Record Answer</>
                                                         )}
                                                     </button>
                                                 </div>

                                                 {isRecording && (
                                                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-red-400 text-sm">
                                                         <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                                         Recording in progress... Speak your answer clearly. The AI will analyze your response for feedback.
                                                     </motion.div>
                                                 )}
                                             </div>
                                         </motion.div>
                                     )}
                                </div>

                                {/* Right: AI Feedback Panel */}
                                <div className="space-y-6">
                                    <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-purple-400" />
                                            AI Feedback Panel
                                        </h3>

                                        {showFeedback ? (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                                {mockFeedback.map((item, idx) => (
                                                    <div key={idx}>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-300">{item.category}</span>
                                                            <span className="font-bold" style={{ color: item.color }}>{item.score}%</span>
                                                        </div>
                                                        <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${item.score}%` }}
                                                                transition={{ duration: 0.8, delay: idx * 0.15 }}
                                                                className="h-full rounded-full"
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="mt-6 p-4 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
                                                    <p className="text-sm text-[var(--color-accent)] font-bold mb-1">💡 AI Tip</p>
                                                    <p className="text-sm text-gray-300">Try to include specific examples and metrics when answering technical questions. This demonstrates practical experience.</p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--color-muted)] py-12 opacity-60">
                                                <BrainCircuit className="w-12 h-12 mb-4" />
                                                <p className="text-sm">Record an answer to get AI-powered feedback on your performance.</p>
                                            </div>
                                        )}
                                    </div>

                                     {/* Quick Stats */}
                                     <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                         <h3 className="font-bold text-sm mb-4 text-[var(--color-muted)] uppercase tracking-wider">Session Stats</h3>
                                         <div className="grid grid-cols-2 gap-3 mb-4">
                                             {[
                                                 { label: 'Interviews', value: '12', icon: Users },
                                                 { label: 'Avg Score', value: '81%', icon: TrendingUp },
                                                 { label: 'Questions', value: '48', icon: MessageSquare },
                                                 { label: 'Hours', value: '6.5', icon: Clock },
                                             ].map((stat, idx) => (
                                                 <div key={idx} className="bg-black/30 rounded-xl p-3 border border-white/5 text-center">
                                                     <stat.icon className="w-4 h-4 text-[var(--color-primary)] mx-auto mb-1" />
                                                     <p className="text-lg font-bold text-white">{stat.value}</p>
                                                     <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
                                                 </div>
                                             ))}
                                         </div>

                                         {/* Streak & Performance */}
                                         <div className="space-y-3">
                                             <div className="flex items-center justify-between">
                                                 <span className="text-sm font-medium text-[var(--color-muted)]">Current Streak</span>
                                                 <div className="flex items-center gap-1">
                                                     <span className="text-lg font-bold text-orange-400">🔥 7</span>
                                                     <span className="text-xs text-[var(--color-muted)]">days</span>
                                                 </div>
                                             </div>
                                             <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                                                 <motion.div
                                                     initial={{ width: 0 }}
                                                     animate={{ width: '70%' }}
                                                     transition={{ duration: 1, delay: 0.5 }}
                                                     className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full"
                                                 />
                                             </div>
                                             <p className="text-xs text-[var(--color-muted)] text-center">7/10 days to maintain streak</p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ===== MILESTONE TRACKER TAB ===== */}
                    {activeTab === 'milestones' && (
                        <motion.div key="milestones" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="grid lg:grid-cols-3 gap-6">

                                {/* Left: Progress + Milestones */}
                                <div className="lg:col-span-2 space-y-6">

                                    {/* Project Progress Bar */}
                                    <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />
                                                Project Progress
                                            </h3>
                                            <span className="text-2xl font-bold text-[var(--color-accent)]">{progressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden mb-6">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercent}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] h-full rounded-full"
                                            />
                                        </div>

                                        {/* Milestone List */}
                                        <div className="space-y-3">
                                            {milestones.map((m, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${m.done
                                                        ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20'
                                                        : 'bg-white/5 border-white/10'
                                                        }`}
                                                >
                                                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${m.done ? 'text-[var(--color-accent)]' : 'text-gray-600'}`} />
                                                    <span className={`flex-1 font-medium ${m.done ? 'text-gray-300 line-through' : 'text-white'}`}>{m.title}</span>
                                                    <span className="text-xs text-[var(--color-muted)]">{m.date}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Weekly Submissions */}
                                    <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-400" />
                                            Weekly Submissions
                                        </h3>
                                        <div className="space-y-3">
                                            {weeklySubmissions.map((sub, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-white text-sm">{sub.title}</p>
                                                        <p className="text-xs text-[var(--color-muted)]">{sub.date}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${sub.status === 'Reviewed' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : sub.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                        {sub.status}
                                                    </span>
                                                    {sub.feedback && (
                                                        <p className="text-xs text-gray-400 italic hidden md:block max-w-[150px] truncate">&ldquo;{sub.feedback}&rdquo;</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Mentor Comments + Deadlines */}
                                <div className="space-y-6">

                                    {/* Mentor Comments */}
                                    <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-pink-400" />
                                            Mentor Comments
                                        </h3>
                                        <div className="space-y-4">
                                            {mentorComments.map((mc, idx) => (
                                                <div key={idx} className="p-4 rounded-2xl bg-black/30 border border-white/5">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-bold text-sm text-white">{mc.mentor}</span>
                                                        <span className="text-xs text-[var(--color-muted)]">{mc.date}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-400">&ldquo;{mc.comment}&rdquo;</p>
                                                </div>
                                            ))}
                                            <div className="text-center py-4 border-2 border-dashed border-white/10 rounded-2xl">
                                                <p className="text-sm text-[var(--color-muted)]">More mentor feedback coming soon...</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Deadline Tracker */}
                                    <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-orange-400" />
                                            Deadline Tracker
                                        </h3>
                                        <div className="space-y-3">
                                            {deadlines.map((dl, idx) => (
                                                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${dl.urgent ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                                                    <Clock className={`w-4 h-4 shrink-0 ${dl.urgent ? 'text-red-400' : 'text-[var(--color-muted)]'}`} />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm text-white">{dl.task}</p>
                                                        <p className="text-xs text-[var(--color-muted)]">{dl.date}</p>
                                                    </div>
                                                    {dl.urgent && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 uppercase">Urgent</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
