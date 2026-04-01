"use client";

import { motion } from 'framer-motion';
import { LayoutDashboard, Award, Target, Video, Briefcase, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

const SKILL_DATA = [
    { name: 'React', score: 92 },
    { name: 'Next.js', score: 88 },
    { name: 'TypeScript', score: 85 },
    { name: 'Tailwind', score: 90 },
    { name: 'Node.js', score: 75 },
];

const ACTIVITY_DATA = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 4 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 6 },
    { day: 'Fri', hours: 5 },
    { day: 'Sat', hours: 8 },
    { day: 'Sun', hours: 2 },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <LayoutDashboard className="w-10 h-10 text-[var(--color-primary)]" />
                            Talent Dashboard
                        </h1>
                        <p className="text-[var(--color-muted)]">Welcome back, Arjun. Here is your weekly progress overview.</p>
                    </div>

                    <button className="px-6 py-2 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary)]/90 transition shadow-lg flex items-center gap-2">
                        <Target className="w-4 h-4" /> Go to Next Module
                    </button>
                </div>

                {/* Top Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Stat 1 */}
                    <div className="glass p-6 rounded-2xl border border-[var(--color-border)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Award className="w-16 h-16 text-[var(--color-accent)]" />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Global Rank</p>
                        <div className="text-3xl font-bold text-white mb-2">Top 5%</div>
                        <div className="flex items-center gap-1 text-xs text-green-400 font-medium">
                            <TrendingUp className="w-3 h-3" /> Up 2% this week
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="glass p-6 rounded-2xl border border-[var(--color-border)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Briefcase className="w-16 h-16 text-[var(--color-primary)]" />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Active Matches</p>
                        <div className="text-3xl font-bold text-white mb-2">12</div>
                        <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)]">3 Approvals</span>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="glass p-6 rounded-2xl border border-[var(--color-border)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Video className="w-16 h-16 text-purple-400" />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Interviews Prep</p>
                        <div className="text-3xl font-bold text-white mb-2">8 hrs</div>
                        <p className="text-xs text-[var(--color-muted)] mt-2">Completed this month</p>
                    </div>

                    {/* Overall Score */}
                    <div className="glass p-6 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-accent)] uppercase tracking-wider mb-1">AI Hire Score</p>
                            <div className="text-4xl font-extrabold text-white">94<span className="text-lg text-[var(--color-muted)] font-normal">/100</span></div>
                        </div>
                        <Target className="w-12 h-12 text-[var(--color-accent)] opacity-80" />
                    </div>

                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">

                    {/* Bar Chart */}
                    <div className="glass p-6 rounded-3xl border border-[var(--color-border)] flex flex-col">
                        <h3 className="text-lg font-bold mb-6">Verified Skills Breakdown</h3>
                        <div className="flex-1 min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SKILL_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <RechartsTooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#E5E7EB' }}
                                    />
                                    <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="glass p-6 rounded-3xl border border-[var(--color-border)] flex flex-col">
                        <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                            Learning Activity
                            <span className="text-xs font-normal px-2 py-1 rounded bg-white/5 text-[var(--color-muted)]">This Week</span>
                        </h3>
                        <div className="flex-1 min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ACTIVITY_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#E5E7EB' }}
                                    />
                                    <Line type="monotone" dataKey="hours" stroke="var(--color-accent)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-accent)" }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 glass rounded-3xl p-6 border border-[var(--color-border)]">
                        <h3 className="text-lg font-bold mb-6">Recent Interviews (AI Feedback)</h3>
                        <div className="space-y-4">
                            {/* Item 1 */}
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-[var(--color-primary)]/30 transition">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <Video className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-white">Frontend Architecture Mock</h4>
                                        <span className="text-xs text-[var(--color-muted)]">2 days ago</span>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2">"Great handling of React performance questions. Suggest reviewing Server Components lifecycle for next time."</p>
                                </div>
                            </div>
                            {/* Item 2 */}
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-[var(--color-primary)]/30 transition">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                    <Video className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-white">Vercel Interview (Round 1)</h4>
                                        <span className="text-xs text-[var(--color-muted)]">5 days ago</span>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2">"Strong communication. Passed Technical Screen automatically using Verified Badge."</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-6 border border-[var(--color-border)] bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                        <h3 className="text-lg font-bold mb-6">Skill Gap Priorities</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-white flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> GraphQL</span>
                                <span className="text-[var(--color-muted)]">High Impact</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-white flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /> WebSockets</span>
                                <span className="text-[var(--color-muted)]">Medium</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-white flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> PostgreSQL Basics</span>
                                <span className="text-[var(--color-muted)]">Low Priority</span>
                            </li>
                        </ul>

                        <button className="w-full mt-6 py-3 rounded-xl glass text-sm font-bold hover:bg-white/10 transition">
                            Update Roadmap
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
