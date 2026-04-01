"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Building, GraduationCap, Github, CheckCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState<'student' | 'recruiter'>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!password.trim()) {
            setError('Please enter your password.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);

        // Simulate authentication
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 1500);
        }, 1200);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[var(--color-background)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--color-primary)]/10 via-[var(--color-background)] to-[var(--color-background)]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass rounded-[2rem] p-8 sm:p-10 border border-[var(--color-border)] shadow-2xl relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] mb-2">
                            SkillBridge AI
                        </h1>
                        <p className="text-[var(--color-muted)]">Welcome back. Enter your details to proceed.</p>
                    </div>

                    {/* Success State */}
                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--color-background)]/95 rounded-[2rem]"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', duration: 0.5 }}
                                >
                                    <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                                </motion.div>
                                <p className="text-xl font-bold text-white">Welcome back!</p>
                                <p className="text-[var(--color-muted)] text-sm mt-1">Redirecting to dashboard...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Role Toggle */}
                    <div className="flex p-1 bg-black/40 rounded-xl border border-[var(--color-border)] mb-8">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'student'
                                ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                                : 'text-[var(--color-muted)] hover:text-white'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" /> Talent
                        </button>
                        <button
                            onClick={() => setRole('recruiter')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'recruiter'
                                ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20'
                                : 'text-[var(--color-muted)] hover:text-white'
                                }`}
                        >
                            <Building className="w-4 h-4" /> Startup
                        </button>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    className={`w-full bg-black/20 border rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none transition-colors placeholder:text-gray-600 ${error && !email.trim()
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'
                                        }`}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    className={`w-full bg-black/20 border rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none transition-colors placeholder:text-gray-600 ${error && !password.trim()
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm mt-2">
                            <label className="flex items-center gap-2 text-[var(--color-muted)] cursor-pointer">
                                <input type="checkbox" className="rounded accent-[var(--color-primary)] bg-black/50 border-[var(--color-border)]" /> Remember me
                            </label>
                            <a href="#" className="text-[var(--color-primary)] hover:underline">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg mt-4 ${isLoading || success
                                    ? 'opacity-70 cursor-not-allowed'
                                    : 'hover:scale-[1.02]'
                                } ${role === 'student' ? 'bg-[var(--color-primary)] shadow-[var(--color-primary)]/20' : 'bg-[var(--color-accent)] shadow-[var(--color-accent)]/20'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Social Auth */}
                    <div className="mt-8">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute w-full border-t border-[var(--color-border)]"></div>
                            <span className="relative bg-[var(--color-background)] px-4 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Or continue with</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 glass rounded-xl hover:bg-white/10 transition text-sm font-medium">
                                <Github className="w-5 h-5" /> GitHub
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 glass rounded-xl hover:bg-white/10 transition text-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}

