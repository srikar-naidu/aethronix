"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, MicOff, BrainCircuit, Play, Square, Loader2, Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
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

    const recorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const messagesRef = useRef<ChatMessage[]>([]);

    // Keep messagesRef in sync
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    // Initialize TTS
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
            // Pre-load voices
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
            
            // Try to find a voice that matches the selected language
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

    // Transcribe audio using Groq Whisper
    const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('language', language); // Dynamic language hint

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('[Transcribe] Failed:', response.status, data.error, data.details);
                return `ERROR: ${data.details || data.error || 'Unknown error'}`;
            }

            return data.text || '';
        } catch (err: any) {
            console.error('[Transcribe] Request Exception:', err);
            return `ERROR: ${err.message || 'Connection failed'}`;
        }
    };

    // Send transcribed text to Groq Chat
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
                body: JSON.stringify({ 
                    messages: newMessages,
                    language: language // Handle language in chat if needed
                }),
            });

            if (!response.ok) {
                console.warn('[Chat API]', response.status);
                throw new Error('API error');
            }

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

    // Start recording audio via MediaRecorder
    const startRecording = async () => {
        try {
            // Cancel AI speech if speaking
            synthRef.current?.cancel();
            setIsSpeaking(false);

            // Get mic access with better constraints
            const micStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                } 
            });
            
            // Log track info for debugging
            const audioTrack = micStream.getAudioTracks()[0];
            console.log(`[Mic] Using track: ${audioTrack.label}, Enabled: ${audioTrack.enabled}, ReadyState: ${audioTrack.readyState}`);
            
            audioStreamRef.current = micStream;
            audioChunksRef.current = [];

            const options = { mimeType: 'audio/webm;codecs=opus' };
            const recorder = MediaRecorder.isTypeSupported(options.mimeType) 
                ? new MediaRecorder(micStream, options) 
                : new MediaRecorder(micStream);
                
            recorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                    console.log(`[Recorder] Chunk received: ${event.data.size} bytes`);
                }
            };

            recorder.onstop = async () => {
                // Release mic
                micStream.getTracks().forEach(t => t.stop());
                audioStreamRef.current = null;

                const audioBlob = new Blob(audioChunksRef.current, { type: recorderRef.current?.mimeType || 'audio/webm' });
                console.log(`[Recorder] Recording stopped. Total chunks: ${audioChunksRef.current.length}, Total size: ${audioBlob.size} bytes`);
                audioChunksRef.current = [];

                if (audioBlob.size < 2000) {
                    setStatusText('Recording was too short or silent. Please speak clearly for a few seconds.');
                    setIsThinking(false);
                    return;
                }

                setStatusText(t('aihire.transcribing'));
                setIsThinking(true);

                const text = await transcribeAudio(audioBlob);

                if (text && !text.startsWith('ERROR:')) {
                    setStatusText('');
                    await sendToAI(text);
                } else {
                    const errorMsg = text.startsWith('ERROR:') ? text.replace('ERROR: ', '') : 'Could not understand. Please try again.';
                    setStatusText(`Error: ${errorMsg}`);
                    setIsThinking(false);
                }
            };

            recorder.start(1000); // Capture chunks every second
            setIsRecording(true);
            setStatusText(t('aihire.startRecording'));
        } catch {
            setStatusText('Microphone access denied. Please allow mic permissions.');
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (recorderRef.current && recorderRef.current.state === 'recording') {
            recorderRef.current.stop();
        }
        setIsRecording(false);
    };

    // Toggle recording
    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Start Interview
    const startInterview = async () => {
        try {
            const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(camStream);
            setIsInterviewing(true);

            // Basic localization for the greeting
            const greetings: Record<string, string> = {
                en: "Hello! I am Nexus. Let's start the interview. Please briefly introduce yourself and tell me what role or field you are interested in.",
                hi: "नमस्ते! मैं नेक्सस हूँ। चलिए इंटरव्यू शुरू करते हैं। कृपया संक्षेप में अपना परिचय दें और मुझे बताएं कि आप किस भूमिका या क्षेत्र में रुचि रखते हैं।",
                te: "నమస్కారం! నేను నెక్సస్. ఇంటర్వ్యూ ప్రారంభిద్దాం. దయచేసి సంక్షిప్తంగా మీ పరిచయం చెప్పండి మరియు మీరు ఏ పాత్ర లేదా రంగంపై ఆసక్తి కలిగి ఉన్నారో నాకు తెలియజేయండి.",
                ta: "வணக்கம்! நான் நெக்ஸஸ். இன்டர்வியூவைத் துவங்குவோம். தயவுசெய்து சுருக்கமாக உங்களை அறிமுகப்படுத்திக் கொள்ளுங்கள், எந்தத் துறையில் உங்களுக்கு விருப்பம் என்று சொல்லுங்கள்.",
                kn: "ನಮಸ್ಕಾರ! ನಾನು ನೆಕ್ಸಸ್. ಇಂಟರ್ವ್ಯೂ ಪ್ರಾರಂಭಿಸೋಣ. ದಯವಿಟ್ಟು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ನಿಮ್ಮ ಪರಿಚಯ ಹೇಳಿ ಮತ್ತು ನೀವು ಯಾವ ಕ್ಷೇತ್ರದಲ್ಲಿ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಿ ಎಂದು ನನಗೆ ತಿಳಿಸಿ.",
                bn: "নমস্কার! আমি নেক্সাস। চলুন ইন্টারভিউ শুরু করি। অনুগ্রহ করে সংক্ষেপে আপনার পরিচয় দিন এবং আমাকে বলুন আপনি কোন ভূমিকা বা ক্ষেত্রে আগ্রহী।",
                gu: "નમસ્તે! હું નેક્સસ છું. ચાલો ઇન્ટરવ્યુ શરૂ કરીએ. કૃપા કરીને ટૂંકમાં તમારો પરિચય આપો અને મને જણાવો કે તમને કઈ ભૂમિકા અથવા ક્ષેત્રમાં રસ છે.",
                mr: "नमस्ते! मी नेक्सस आहे. चला इंटरव्यू सुरू करूया. कृपया थोडक्यात तुमची ओळख करून द्या आणि मला सांगा की तुम्हाला कोणत्या भूमिकेत किंवा क्षेत्रात रस आहे."
            };

            const greeting = greetings[language] || greetings.en;
            setMessages([{ role: 'assistant', content: greeting }]);
            speakText(greeting);
        } catch {
            alert("Please allow camera access to start the interview.");
        }
    };

    // End Interview
    const endInterview = () => {
        videoStream?.getTracks().forEach(t => t.stop());
        audioStreamRef.current?.getTracks().forEach(t => t.stop());
        synthRef.current?.cancel();
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        setVideoStream(null);
        setIsInterviewing(false);
        setIsRecording(false);
        setIsSpeaking(false);
        setIsThinking(false);
        setMessages([]);
        setStatusText('');
    };

    // Attach video stream
    useEffect(() => {
        if (videoRef.current && videoStream) {
            videoRef.current.srcObject = videoStream;
        }
    }, [videoStream]);

    const currentAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content || "Ready to begin your technical interview?";

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 lg:px-8 h-[calc(100vh-8rem)]">
                <div className="grid lg:grid-cols-4 gap-6 h-full">

                    {/* Main Interview Area */}
                    <div className="lg:col-span-3 flex flex-col gap-6 h-full">

                        {/* AI Interviewer Top Bar */}
                        <div className={`glass p-6 rounded-3xl flex items-center gap-6 border transition-colors ${isSpeaking ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50 shadow-[0_0_30px_rgba(79,70,229,0.15)]' : 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5'}`}>
                            <div className="relative">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${isSpeaking ? 'bg-gradient-to-br from-[var(--color-primary)] to-indigo-400 border-white scale-110 shadow-lg shadow-[var(--color-primary)]/50' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-[var(--color-primary)]'}`}>
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

                                    {/* Status Message */}
                                    {statusText && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10 max-w-2xl w-[90%] text-center"
                                        >
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
                                        <button onClick={endInterview} className="px-6 py-3 rounded-full hover:bg-red-500/20 text-red-400 font-bold flex items-center gap-2 transition ml-2 uppercase tracking-tighter text-xs">
                                            <Square className="w-4 h-4 fill-current" /> {t('common.close')}
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
                                                    {Math.min(messages.filter(m => m.role === 'user').length, 10)} / 10
                                                </span>
                                            </div>
                                            <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-[var(--color-accent)] h-full rounded-full transition-all"
                                                    style={{ width: `${Math.min(messages.filter(m => m.role === 'user').length * 10, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
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
