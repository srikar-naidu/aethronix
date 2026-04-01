"use client";

import { motion } from 'framer-motion';
import { Briefcase, Wand2, Download, ExternalLink, Github, Linkedin, Award } from 'lucide-react';

export default function PortfolioPage() {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <Briefcase className="w-10 h-10 text-[var(--color-primary)]" />
                            AI Built Portfolio
                        </h1>
                        <p className="text-[var(--color-muted)]">Auto-generated from your verified skills, mock interviews, and projects.</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-6 py-3 rounded-xl glass glass-hover text-white flex items-center justify-center gap-2 font-medium">
                            <Download className="w-4 h-4" /> Export PDF
                        </button>
                        <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center gap-2 font-medium shadow-lg hover:bg-[var(--color-primary)]/90 transition">
                            <Wand2 className="w-4 h-4" /> Auto-Update
                        </button>
                    </div>
                </div>

                {/* Portfolio Preview Panel */}
                <div className="bg-white text-black rounded-[2rem] p-8 md:p-12 shadow-2xl mx-auto border border-white/20 relative overflow-hidden">

                    {/* Header */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-8 mb-8 gap-6">
                        <div>
                            <h2 className="text-4xl font-extrabold mb-2">Arjun Kumar</h2>
                            <p className="text-xl text-gray-600 font-medium">Full Stack Developer Intern</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"><Github className="w-5 h-5 " /></a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-blue-600 transition"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"><ExternalLink className="w-5 h-5" /></a>
                        </div>
                    </header>

                    <div className="grid md:grid-cols-3 gap-12">

                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-10">

                            <section>
                                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">AI Summary</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Highly capable React developer with verified expertise in state management and performance optimization. Demonstrated strong system design intuition during MockPrep assessments. Proficient in building responsive, accessible interfaces with Tailwind CSS and Framer Motion.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">Verified Experience</h3>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-xl font-bold text-gray-900">E-Commerce Dashboard Built in 24 Hours</h4>
                                            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Hackathon Winner</span>
                                        </div>
                                        <p className="text-gray-500 mb-2 font-medium">Next.js • Tailwind CSS • Supabase</p>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                            <li>Designed and implemented complete dashboard UI with Recharts visualizations.</li>
                                            <li>Achieved 100/100 Lighthouse performance score.</li>
                                            <li>Integrated Supabase auth and real-time database subscriptions.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                        </div>

                        {/* Right Column */}
                        <div className="space-y-10">

                            <section>
                                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">Top Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium">React (92%)</span>
                                    <span className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Next.js (88%)</span>
                                    <span className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium">TypeScript (85%)</span>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border">Tailwind CSS</span>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border">PostgreSQL</span>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">Verified Badges</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                            <Award className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Advanced React</p>
                                            <p className="text-xs text-gray-500">Issued by SkillBridge AI</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Award className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">System Design Basic</p>
                                            <p className="text-xs text-gray-500">Issued by SkillBridge AI</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
