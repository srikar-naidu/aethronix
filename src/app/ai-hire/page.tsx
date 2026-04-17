"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Mic, MicOff, BrainCircuit, Play, Square, Loader2, Activity,
    FileText, CheckCircle, AlertTriangle, Target, TrendingUp, BookOpen,
    ChevronDown, ChevronUp, Download, RefreshCw, Award, XCircle, Lightbulb, X
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import jsPDF from 'jspdf';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface QuestionAnalysis {
    question_number: number;
    question: string;
    candidate_answer: string;
    score: number;
    feedback: string;
    ideal_answer: string;
}

interface InterviewReport {
    overall_score: number;
    grade: string;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    question_analysis: QuestionAnalysis[];
    communication_score: number;
    technical_score: number;
    confidence_score: number;
    improvement_areas: Array<{ area: string; suggestion: string }>;
    recommended_resources: Array<{ topic: string; resource: string }>;
    interview_tips: string[];
    hiring_recommendation: string;
}

function getScoreColor(score: number) {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
}

function getGradeBg(grade: string) {
    if (['A+', 'A'].includes(grade)) return 'from-emerald-500 to-emerald-600';
    if (['B+', 'B'].includes(grade)) return 'from-blue-500 to-blue-600';
    if (['C+', 'C'].includes(grade)) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
}

function getRecommendationColor(rec: string) {
    if (rec.includes('Strong Hire')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (rec.includes('Hire')) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (rec.includes('Maybe')) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
}

export default function AIHirePage() {
    const { t, language } = useLanguage();
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [statusText, setStatusText] = useState('');

    // Report state
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [report, setReport] = useState<InterviewReport | null>(null);
    const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

    const recorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const messagesRef = useRef<ChatMessage[]>([]);

    useEffect(() => { messagesRef.current = messages; }, [messages]);

    // Initialize TTS
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
            synthRef.current?.getVoices();
            if (typeof speechSynthesis !== 'undefined') {
                speechSynthesis.onvoiceschanged = () => synthRef.current?.getVoices();
            }
        }
        return () => { synthRef.current?.cancel(); };
    }, []);

    // Speak text
    const speakText = useCallback((text: string) => {
        const synth = synthRef.current;
        if (!synth) return;
        synth.cancel();
        setIsSpeaking(false);

        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            utteranceRef.current = utterance;

            const voices = synth.getVoices();
            const langCode = language === 'en' ? 'en' :
                            language === 'hi' ? 'hi' :
                            language === 'te' ? 'te' :
                            language === 'ta' ? 'ta' :
                            language === 'kn' ? 'kn' :
                            language === 'bn' ? 'bn' :
                            language === 'gu' ? 'gu' :
                            language === 'mr' ? 'mr' : 'en';

            const voice = voices.find(v => v.lang.startsWith(langCode) && v.name.includes('Google'))
                || voices.find(v => v.lang.startsWith(langCode))
                || voices.find(v => v.lang.startsWith('en'))
                || voices[0];

            if (voice) utterance.voice = voice;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            const safetyMs = Math.max(text.length * 80, 3000);
            const safetyTimer = setTimeout(() => setIsSpeaking(false), safetyMs);

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => { clearTimeout(safetyTimer); setIsSpeaking(false); };
            utterance.onerror = () => { clearTimeout(safetyTimer); setIsSpeaking(false); };

            synth.speak(utterance);
        }, 100);
    }, [language]);

    // Transcribe audio
    const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('language', language);
            const response = await fetch('/api/transcribe', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) return `ERROR: ${data.details || data.error || 'Transcription failed'}`;
            return data.text || '';
        } catch (err: any) {
            return `ERROR: ${err.message || 'Connection failed'}`;
        }
    };

    // Send to AI
    const sendToAI = useCallback(async (userText: string) => {
        if (!userText.trim()) {
            setStatusText('Could not hear you. Try speaking louder or closer to the mic.');
            return;
        }
        setStatusText('');
        const currentMessages = messagesRef.current;
        const newMessages: ChatMessage[] = [...currentMessages, { role: 'user', content: userText }];
        setMessages(newMessages);
        setIsThinking(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, language }),
            });
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            const aiReply = data.message || "Could you say that again?";
            setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
            speakText(aiReply);
        } catch {
            const fallback = "I had a brief connection issue. Could you repeat your answer?";
            setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
            speakText(fallback);
        } finally {
            setIsThinking(false);
        }
    }, [speakText, language]);

    // Recording
    const startRecording = async () => {
        try {
            synthRef.current?.cancel();
            setIsSpeaking(false);
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 44100 }
            });
            audioStreamRef.current = micStream;
            audioChunksRef.current = [];
            const options = { mimeType: 'audio/webm;codecs=opus' };
            const recorder = MediaRecorder.isTypeSupported(options.mimeType)
                ? new MediaRecorder(micStream, options)
                : new MediaRecorder(micStream);
            recorderRef.current = recorder;
            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) audioChunksRef.current.push(event.data);
            };
            recorder.onstop = async () => {
                micStream.getTracks().forEach(t => t.stop());
                audioStreamRef.current = null;
                const audioBlob = new Blob(audioChunksRef.current, { type: recorderRef.current?.mimeType || 'audio/webm' });
                audioChunksRef.current = [];
                if (audioBlob.size < 500) {
                    setStatusText('Could not hear you. Please speak louder.');
                    setIsThinking(false);
                    return;
                }
                setStatusText(t('aihire.transcribing') + '...');
                setIsThinking(true);
                const text = await transcribeAudio(audioBlob);
                const cleanText = (text || '').replace(/[.\s]+/g, '').trim();
                if (text && !text.startsWith('ERROR:') && cleanText.length > 1) {
                    setStatusText('');
                    await sendToAI(text);
                } else {
                    setStatusText(text?.startsWith('ERROR:') ? `Error: ${text.replace('ERROR: ', '')}` : 'Could not hear you clearly. Please try again.');
                    setIsThinking(false);
                }
            };
            recorder.start(2000);
            setIsRecording(true);
            setStatusText(t('aihire.startRecording'));
        } catch {
            setStatusText('Microphone access denied. Please allow mic permissions.');
        }
    };

    const stopRecording = () => {
        if (recorderRef.current && recorderRef.current.state === 'recording') recorderRef.current.stop();
        setIsRecording(false);
    };

    const toggleRecording = () => {
        if (isRecording) stopRecording();
        else startRecording();
    };

    // Start Interview
    const startInterview = async () => {
        try {
            const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(camStream);
            setIsInterviewing(true);
            setReport(null);

            const greetings: Record<string, string> = {
                en: "Hello! I am Nexus. Let's start the interview. Please briefly introduce yourself and tell me what role or field you are interested in.",
                hi: "नमस्ते! मैं नेक्सस हूँ। चलिए इंटरव्यू शुरू करते हैं। कृपया संक्षेप में अपना परिचय दें और मुझे बताएं कि आप किस भूमिका या क्षेत्र में रुचि रखते हैं।",
                te: "నమస్కారం! నేను నెక్సస్. ఇంటర్వ్యూ ప్రారంభిద్దాం. దయచేసి సంక్షిప్తంగా మీ పరిచయం చెప్పండి.",
                ta: "வணக்கம்! நான் நெக்ஸஸ். இன்டர்வியூவைத் துவங்குவோம். தயவுசெய்து சுருக்கமாக உங்களை அறிமுகப்படுத்திக் கொள்ளுங்கள்.",
                kn: "ನಮಸ್ಕಾರ! ನಾನು ನೆಕ್ಸಸ್. ಇಂಟರ್ವ್ಯೂ ಪ್ರಾರಂಭಿಸೋಣ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪರಿಚಯ ಹೇಳಿ.",
                bn: "নমস্কার! আমি নেক্সাস। চলুন ইন্টারভিউ শুরু করি। অনুগ্রহ করে আপনার পরিচয় দিন।",
                gu: "નમસ્તે! હું નેક્સસ છું. ચાલો ઇન્ટરવ્યુ શરૂ કરીએ. કૃપા કરીને તમારો પરિચય આપો.",
                mr: "नमस्ते! मी नेक्सस आहे. चला इंटरव्यू सुरू करूया. कृपया तुमची ओळख करून द्या."
            };

            const greeting = greetings[language] || greetings.en;
            setMessages([{ role: 'assistant', content: greeting }]);
            speakText(greeting);
        } catch {
            alert("Please allow camera access to start the interview.");
        }
    };

    // End Interview & Generate Report
    const endInterview = async (generateReport = true) => {
        // Stop all media
        videoStream?.getTracks().forEach(t => t.stop());
        audioStreamRef.current?.getTracks().forEach(t => t.stop());
        synthRef.current?.cancel();
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        setVideoStream(null);
        setIsInterviewing(false);
        setIsRecording(false);
        setIsSpeaking(false);
        setIsThinking(false);
        setStatusText('');

        // Generate report if there were at least 1 user response
        const savedMessages = messagesRef.current;
        if (generateReport && savedMessages.filter(m => m.role === 'user').length > 0) {
            setIsGeneratingReport(true);
            try {
                const res = await fetch('/api/interview-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: savedMessages, language }),
                });
                if (!res.ok) throw new Error('Report generation failed');
                const data: InterviewReport = await res.json();
                setReport(data);
            } catch (err) {
                console.error('Report generation error:', err);
            } finally {
                setIsGeneratingReport(false);
            }
        } else {
            setMessages([]);
        }
    };

    // PDF Download
    const downloadReportPDF = () => {
        if (!report) return;
        const doc = new jsPDF();
        const margin = 20;
        const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
        let y = margin;

        const addText = (text: string, size: number, bold = false) => {
            doc.setFontSize(size);
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            const lines = doc.splitTextToSize(text, maxWidth);
            for (const line of lines) {
                if (y > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin; }
                doc.text(line, margin, y);
                y += size * 0.5;
            }
            y += 4;
        };

        addText('INTERVIEW PERFORMANCE REPORT', 18, true);
        addText(`Grade: ${report.grade} | Score: ${report.overall_score}/100`, 14, true);
        addText(`Recommendation: ${report.hiring_recommendation}`, 12, true);
        y += 4;
        addText(report.summary, 11);
        y += 6;

        addText('SCORE BREAKDOWN', 14, true);
        addText(`Technical: ${report.technical_score}/100 | Communication: ${report.communication_score}/100 | Confidence: ${report.confidence_score}/100`, 11);
        y += 6;

        addText('QUESTION-BY-QUESTION ANALYSIS', 14, true);
        report.question_analysis.forEach(q => {
            y += 2;
            addText(`Q${q.question_number}: ${q.question}`, 11, true);
            addText(`Your Answer: ${q.candidate_answer}`, 10);
            addText(`Score: ${q.score}/100 — ${q.feedback}`, 10);
            addText(`Ideal Answer: ${q.ideal_answer}`, 10);
            y += 4;
        });

        addText('IMPROVEMENT TIPS', 14, true);
        report.interview_tips.forEach(tip => addText(`• ${tip}`, 10));

        doc.save('interview-report.pdf');
    };

    // Reset
    const resetAll = () => {
        setReport(null);
        setMessages([]);
        setIsGeneratingReport(false);
    };

    // Attach video stream
    useEffect(() => {
        if (videoRef.current && videoStream) videoRef.current.srcObject = videoStream;
    }, [videoStream]);

    const currentAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content || "Ready to begin your technical interview?";
    const userResponseCount = messages.filter(m => m.role === 'user').length;

    /* ═════════════════ REPORT VIEW ═════════════════ */
    if (report) {
        return (
            <div className="min-h-screen pt-24 pb-16 bg-[var(--color-background)]">
                <div className="container mx-auto px-4 max-w-4xl">

                    {/* Report Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-4">
                            <FileText className="w-4 h-4" />
                            Interview Report
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{t('aihire.reportTitle')}</h1>
                        <p className="text-[var(--color-muted)]">{report.summary}</p>
                    </motion.div>

                    {/* Score Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass rounded-3xl p-8 border border-[var(--color-border)] mb-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-3xl -mr-30 -mt-30 opacity-20" style={{ background: report.overall_score >= 70 ? '#34d399' : report.overall_score >= 40 ? '#facc15' : '#f87171' }} />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-6">
                                {/* Grade Circle */}
                                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getGradeBg(report.grade)} flex items-center justify-center shadow-lg`}>
                                    <span className="text-4xl font-black text-white">{report.grade}</span>
                                </div>
                                <div>
                                    <div className={`text-5xl font-black ${getScoreColor(report.overall_score)}`}>
                                        {report.overall_score}<span className="text-2xl text-[var(--color-muted)]">/100</span>
                                    </div>
                                    <div className={`mt-2 px-3 py-1 rounded-lg text-sm font-bold border inline-block ${getRecommendationColor(report.hiring_recommendation)}`}>
                                        {report.hiring_recommendation}
                                    </div>
                                </div>
                            </div>

                            {/* Sub-scores */}
                            <div className="flex gap-6">
                                {[
                                    { label: 'Technical', score: report.technical_score, icon: Target },
                                    { label: 'Communication', score: report.communication_score, icon: Activity },
                                    { label: 'Confidence', score: report.confidence_score, icon: Award },
                                ].map(item => (
                                    <div key={item.label} className="text-center">
                                        <div className="relative w-16 h-16 mx-auto mb-2">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                                                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                                <circle cx="30" cy="30" r="25" fill="none"
                                                    stroke={item.score >= 70 ? '#34d399' : item.score >= 40 ? '#facc15' : '#f87171'}
                                                    strokeWidth="4" strokeLinecap="round"
                                                    strokeDasharray={`${2 * Math.PI * 25}`}
                                                    strokeDashoffset={2 * Math.PI * 25 * (1 - item.score / 100)}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>{item.score}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[var(--color-muted)]">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="glass rounded-2xl p-6 border border-emerald-500/20">
                            <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <CheckCircle className="w-4 h-4" /> {t('aihire.whatYouDidWell')}
                            </h3>
                            <div className="space-y-2">
                                {report.strengths.map((s, i) => (
                                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-500/5">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-300">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="glass rounded-2xl p-6 border border-red-500/20">
                            <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <AlertTriangle className="w-4 h-4" /> {t('aihire.whereYouStruggled')}
                            </h3>
                            <div className="space-y-2">
                                {report.weaknesses.map((w, i) => (
                                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-red-500/5">
                                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-300">{w}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Question-by-Question Analysis */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass rounded-3xl border border-[var(--color-border)] mb-6 overflow-hidden">
                        <div className="p-6 border-b border-[var(--color-border)]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Target className="w-5 h-5 text-[var(--color-primary)]" />
                                {t('aihire.breakdown')}
                            </h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {report.question_analysis.map((q) => (
                                <div key={q.question_number}>
                                    <button
                                        onClick={() => setExpandedQuestions(prev => ({ ...prev, [q.question_number]: !prev[q.question_number] }))}
                                        className="w-full p-5 flex items-center justify-between hover:bg-white/[0.02] transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${q.score >= 70 ? 'bg-emerald-500/10 text-emerald-400' : q.score >= 40 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {q.score}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-white">Q{q.question_number}: {q.question.slice(0, 80)}{q.question.length > 80 ? '...' : ''}</p>
                                                <p className="text-xs text-[var(--color-muted)] mt-0.5">{q.feedback.slice(0, 60)}...</p>
                                            </div>
                                        </div>
                                        {expandedQuestions[q.question_number] ? <ChevronUp className="w-4 h-4 text-[var(--color-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-muted)]" />}
                                    </button>

                                    <AnimatePresence>
                                        {expandedQuestions[q.question_number] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 space-y-3">
                                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-bold mb-1">{t('aihire.yourAnswer')}</p>
                                                        <p className="text-sm text-gray-300">{q.candidate_answer}</p>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                                                        <p className="text-[10px] text-[var(--color-primary)] uppercase tracking-wider font-bold mb-1">{t('aihire.feedback')}</p>
                                                        <p className="text-sm text-gray-300">{q.feedback}</p>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                                        <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                                                            <Lightbulb className="w-3 h-3" /> {t('aihire.shouldHaveSaid')}
                                                        </p>
                                                        <p className="text-sm text-gray-300">{q.ideal_answer}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Improvement Areas */}
                    {report.improvement_areas.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="glass rounded-2xl p-6 border border-[var(--color-border)] mb-6">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <TrendingUp className="w-4 h-4 text-blue-400" /> {t('aihire.howToImprove')}
                            </h3>
                            <div className="space-y-3">
                                {report.improvement_areas.map((imp, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{imp.area}</p>
                                            <p className="text-xs text-[var(--color-muted)]">{imp.suggestion}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Interview Tips */}
                    {report.interview_tips.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className="glass rounded-2xl p-6 border border-yellow-500/20 mb-6">
                            <h3 className="text-sm font-bold text-yellow-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Lightbulb className="w-4 h-4" /> {t('aihire.tipsNextTime')}
                            </h3>
                            <div className="space-y-2">
                                {report.interview_tips.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-yellow-500/5">
                                        <span className="text-yellow-400 text-sm">💡</span>
                                        <span className="text-sm text-gray-300">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button onClick={resetAll}
                            className="px-6 py-3 rounded-xl border border-white/10 text-[var(--color-muted)] font-medium hover:bg-white/5 transition flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4" /> {t('aihire.tryAnother')}
                        </button>
                        <button onClick={downloadReportPDF}
                            className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary)]/90 transition flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> {t('aihire.downloadPdf')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ═════════════════ GENERATING REPORT VIEW ═════════════════ */
    if (isGeneratingReport) {
        return (
            <div className="min-h-screen pt-24 pb-16 bg-[var(--color-background)] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md glass rounded-3xl p-10 border border-[var(--color-border)] text-center"
                >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-t-[var(--color-primary)] border-r-transparent border-b-[var(--color-accent)]/30 border-l-transparent rounded-full"
                        />
                        <FileText className="absolute inset-0 m-auto w-10 h-10 text-[var(--color-primary)] animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Generating Your Report</h3>
                    <p className="text-[var(--color-muted)] text-sm mb-4">
                        Analyzing {userResponseCount} response{userResponseCount !== 1 ? 's' : ''} and preparing detailed feedback...
                    </p>
                    <div className="space-y-2 text-left">
                        {['Analyzing your answers...', 'Scoring each response...', 'Generating ideal answers...', 'Preparing recommendations...'].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.5 }}
                                className="flex items-center gap-2 p-2 rounded-lg"
                            >
                                <Loader2 className="w-4 h-4 text-[var(--color-primary)] animate-spin flex-shrink-0" />
                                <span className="text-sm text-gray-400">{step}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    /* ═════════════════ INTERVIEW VIEW ═════════════════ */
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 lg:px-8 h-[calc(100vh-8rem)]">
                <div className="grid lg:grid-cols-4 gap-6 h-full">

                    {/* Main Interview Area */}
                    <div className="lg:col-span-3 flex flex-col gap-6 h-full">

                        {/* AI Interviewer Top Bar */}
                        <div className={`glass p-6 rounded-3xl flex items-center gap-6 border transition-colors ${isSpeaking ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50 shadow-[0_0_30px_rgba(220,20,60,0.15)]' : 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5'}`}>
                            <div className="relative">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${isSpeaking ? 'bg-gradient-to-br from-[var(--color-primary)] to-red-400 border-white scale-110 shadow-lg shadow-[var(--color-primary)]/50' : 'bg-gradient-to-br from-red-700 to-red-900 border-[var(--color-primary)]'}`}>
                                    <BrainCircuit className={`w-8 h-8 text-white ${isThinking ? 'animate-pulse' : ''}`} />
                                </div>
                                {isSpeaking && <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black animate-ping" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-xl font-bold text-white">Nexus — AI Lead Engineer</h2>
                                    {isThinking && <Loader2 className="w-4 h-4 text-[var(--color-accent)] animate-spin" />}
                                    {isSpeaking && <Activity className="w-4 h-4 text-green-400 animate-pulse" />}
                                </div>
                                {isInterviewing ? (
                                    <motion.p key={currentAssistantMessage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-lg text-[var(--color-accent)] font-medium">
                                        &ldquo;{currentAssistantMessage}&rdquo;
                                    </motion.p>
                                ) : (
                                    <p className="text-[var(--color-muted)]">Awaiting interview start...</p>
                                )}
                            </div>
                        </div>

                        {/* Camera View */}
                        <div className={`flex-1 glass rounded-3xl border transition-all relative overflow-hidden flex items-center justify-center bg-zinc-900/50 ${isRecording ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-[var(--color-border)]'}`}>
                            {isInterviewing ? (
                                <>
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-3xl" />
                                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-xs font-bold text-white tracking-wider">REC</span>
                                    </div>

                                    {statusText && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10 max-w-2xl w-[90%] text-center">
                                            <p className="text-yellow-300 font-medium">{statusText}</p>
                                        </motion.div>
                                    )}

                                    {/* Controls */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-lg p-2 rounded-full border border-white/10">
                                        <button
                                            onClick={toggleRecording}
                                            title={isRecording ? t('aihire.stopRecording') : t('aihire.startRecording')}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                                            disabled={isThinking}
                                        >
                                            {isRecording ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                                        </button>
                                        <button
                                            onClick={() => endInterview(true)}
                                            className="px-5 py-3 rounded-full bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/40 text-white font-bold flex items-center gap-2 transition text-xs uppercase tracking-wider border border-[var(--color-primary)]/30"
                                        >
                                            <FileText className="w-4 h-4" /> End & Get Report
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <Video className="w-16 h-16 text-[var(--color-muted)] mx-auto mb-4 opacity-50" />
                                    <p className="text-[var(--color-muted)] mb-6">{t('aihire.subtitle')}</p>
                                    <button onClick={startInterview} className="px-8 py-4 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold text-lg flex items-center gap-2 transition shadow-lg shadow-[var(--color-primary)]/20 hover:scale-105 mx-auto">
                                        <Play className="w-5 h-5 fill-current" /> Start Interview
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="hidden lg:flex flex-col gap-6 h-full">
                        <div className="glass flex-1 rounded-3xl p-6 border border-[var(--color-border)] flex flex-col">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 shrink-0">
                                <BrainCircuit className="w-5 h-5 text-[var(--color-primary)]" />
                                {t('navbar.aihire')}
                            </h3>
                            {!isInterviewing ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center text-[var(--color-muted)] opacity-50">
                                    <Loader2 className="w-8 h-8 mb-4" />
                                    <p>Awaiting interview start...</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300">Interview Progress</span>
                                                <span className="text-[var(--color-accent)] font-bold">
                                                    {Math.min(userResponseCount, 10)} / 10
                                                </span>
                                            </div>
                                            <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] h-full rounded-full transition-all"
                                                    style={{ width: `${Math.min(userResponseCount * 10, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        {userResponseCount > 0 && (
                                            <p className="text-xs text-[var(--color-muted)] text-center">
                                                You can end anytime to get your report
                                            </p>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-3">{t('aihire.transcript')}</p>
                                        <div className="space-y-4">
                                            {messages.map((msg, idx) => (
                                                <div key={idx} className={`p-3 rounded-xl text-sm ${msg.role === 'assistant' ? 'bg-[var(--color-primary)]/10 text-gray-200 border border-[var(--color-primary)]/20' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                                                    <span className="font-bold block mb-1 text-xs">{msg.role === 'assistant' ? 'Nexus (AI)' : 'You'}</span>
                                                    {msg.content}
                                                </div>
                                            ))}
                                            <div ref={(el) => { el?.scrollIntoView({ behavior: 'smooth' }); }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
