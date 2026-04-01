"use client";

import { motion } from 'framer-motion';
import { Route, Zap, Clock, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RoadmapPage() {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Route className="w-10 h-10 text-[var(--color-primary)]" />
                        AI Skill Roadmap
                    </h1>
                    <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
                        Groq analyzed your recent MockPrep interviews and verified skills to generate this personalized learning path for the <strong>Frontend Engineer</strong> role.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Missing Skills */}
                    <div className="glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
                        <h3 className="font-bold text-lg mb-4 text-red-400">Identified Gaps</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5">
                                <span className="text-gray-300">GraphQL</span>
                                <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">High Priority</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5">
                                <span className="text-gray-300">WebSockets</span>
                                <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">Medium</span>
                            </div>
                        </div>
                    </div>

                    {/* Time Estimate */}
                    <div className="glass p-6 rounded-2xl border border-[var(--color-primary)]/30">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--color-primary)]" /> Est. Timeline
                        </h3>
                        <div className="text-4xl font-extrabold text-white mb-2">3 Weeks</div>
                        <p className="text-sm text-[var(--color-muted)]">Based on your learning velocity of 12 hrs/week</p>
                    </div>

                    {/* Impact */}
                    <div className="glass p-6 rounded-2xl border border-[var(--color-accent)]/30">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[var(--color-accent)]" /> ROI Forecast
                        </h3>
                        <div className="text-2xl font-bold text-white mb-2">+45% Job Matches</div>
                        <p className="text-sm text-[var(--color-muted)]">Unlocks 120+ new startup internship opportunities</p>
                    </div>
                </div>

                {/* Timeline Visualization */}
                <div className="glass rounded-3xl p-8 md:p-12 border border-[var(--color-border)]">
                    <h2 className="text-2xl font-bold mb-8">Your Action Plan</h2>

                    <div className="relative border-l-2 border-[var(--color-border)] ml-4 md:ml-6 space-y-12">

                        {/* Week 1 */}
                        <div className="relative pl-8 md:pl-12">
                            <div className="absolute top-0 -left-[11px] w-5 h-5 rounded-full bg-[var(--color-accent)] border-4 border-[var(--color-background)]" />
                            <div className="glass p-6 rounded-2xl border border-[var(--color-accent)]/30 relative group">
                                <div className="absolute top-4 right-6 text-sm font-bold text-[var(--color-accent)]">Week 1</div>
                                <h3 className="text-xl font-bold text-white mb-2">GraphQL Fundamentals</h3>
                                <p className="text-[var(--color-muted)] mb-4">Learn Queries, Mutations, and Apollo Client integration in Next.js.</p>
                                <div className="flex gap-3">
                                    <button className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-white flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> View Resources
                                    </button>
                                    <button className="text-sm px-4 py-2 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition rounded-lg flex items-center gap-2 font-medium">
                                        Start Module <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Week 2 */}
                        <div className="relative pl-8 md:pl-12">
                            <div className="absolute top-0 -left-[11px] w-5 h-5 rounded-full bg-[var(--color-border)] border-4 border-[var(--color-background)]" />
                            <div className="glass p-6 rounded-2xl border border-[var(--color-border)] opacity-70">
                                <div className="absolute top-4 right-6 text-sm font-bold text-[var(--color-muted)]">Week 2</div>
                                <h3 className="text-xl font-bold text-white mb-2">Real-time with WebSockets</h3>
                                <p className="text-[var(--color-muted)] mb-4">Socket.io setup and building a live chat widget component.</p>
                                <button className="text-sm px-4 py-2 bg-white/5 cursor-not-allowed rounded-lg text-[var(--color-muted)]">
                                    Locked
                                </button>
                            </div>
                        </div>

                        {/* Capstone */}
                        <div className="relative pl-8 md:pl-12">
                            <div className="absolute top-0 -left-[11px] w-5 h-5 rounded-full bg-[var(--color-border)] border-4 border-[var(--color-background)]" />
                            <div className="glass p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
                                <div className="absolute top-4 right-6 text-sm font-bold text-purple-400">Week 3</div>
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-purple-400" /> Capstone Project
                                </h3>
                                <p className="text-[var(--color-muted)] mb-4">Build a real-time GraphQL dashboard and pass the final AI Verification.</p>
                                <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Reward: "Full Stack Ready" Badge</div>
                                        <div className="text-xs text-gray-400">Added to your verified portfolio immediately upon completion.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
