"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Area, AreaChart } from 'recharts';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Map, BarChart3, TrendingUp, Filter, Users, Building, Activity, LayoutGrid } from 'lucide-react';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Theme color scale for the heatmap (Dark blue -> Brand primary)
const colorScale = scaleLinear<string>()
    .domain([0, 100])
    .range(["#1a1b3a", "#4F46E5"]);

// Mock global opportunity data mapped to ISO country codes
const opportunityData: Record<string, number> = {
    USA: 95, IND: 85, GBR: 75, CAN: 65, AUS: 60,
    DEU: 70, FRA: 55, BRA: 45, JPN: 80, SGP: 90,
    NLD: 50, SWE: 60, ZAF: 40, NGA: 35, MEX: 55,
};

// Mock chart data
const defaultSkillData = [
    { name: 'React', count: 420 },
    { name: 'Node.js', count: 380 },
    { name: 'Python', count: 350 },
    { name: 'UI/UX', count: 290 },
    { name: 'DevOps', count: 210 },
    { name: 'Data Sci', count: 180 },
];

const defaultDemandData = [
    { month: 'Jan', demand: 120 },
    { month: 'Feb', demand: 135 },
    { month: 'Mar', demand: 160 },
    { month: 'Apr', demand: 140 },
    { month: 'May', demand: 190 },
    { month: 'Jun', demand: 230 },
];

export default function HeatmapPage() {
    const [region, setRegion] = useState('Global');
    const [skill, setSkill] = useState('All Skills');
    const [industry, setIndustry] = useState('All Industries');
    const [isUpdating, setIsUpdating] = useState(false);

    // Simulate data refreshing on filter change
    const handleFilterChange = (setter: any, value: string) => {
        setIsUpdating(true);
        setter(value);
        setTimeout(() => setIsUpdating(false), 500);
    };

    // Randomize chart data based on filters to make it feel alive
    const skillData = useMemo(() => {
        if (skill === 'All Skills') return defaultSkillData;
        return defaultSkillData.map(d => ({ ...d, count: d.name === skill ? d.count * 1.5 : d.count * 0.4 }));
    }, [skill, isUpdating]);

    const demandData = useMemo(() => {
        const volatility = industry === 'Tech' ? 1.5 : 0.8;
        return defaultDemandData.map(d => ({ ...d, demand: Math.floor(d.demand * volatility * (Math.random() * 0.4 + 0.8)) }));
    }, [industry, isUpdating]);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-black text-white">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <Map className="w-8 h-8 text-[var(--color-primary)]" />
                            Global Analytics Map
                        </h1>
                        <p className="text-[var(--color-muted)] text-lg">Opportunity density and hiring demand across regions.</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 glass p-2 rounded-2xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-2 px-3 py-1 border-r border-white/10">
                            <Filter className="w-4 h-4 text-[var(--color-muted)]" />
                            <span className="text-sm font-medium text-gray-300">Filters</span>
                        </div>

                        <select
                            className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition"
                            value={region}
                            onChange={(e) => handleFilterChange(setRegion, e.target.value)}
                        >
                            <option value="Global">Global Region</option>
                            <option value="North America">North America</option>
                            <option value="Europe">Europe</option>
                            <option value="Asia">Asia Pacific</option>
                        </select>

                        <select
                            className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition"
                            value={skill}
                            onChange={(e) => handleFilterChange(setSkill, e.target.value)}
                        >
                            <option value="All Skills">All Skills</option>
                            <option value="React">React</option>
                            <option value="Python">Python</option>
                            <option value="UI/UX">UI/UX Design</option>
                        </select>

                        <select
                            className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition"
                            value={industry}
                            onChange={(e) => handleFilterChange(setIndustry, e.target.value)}
                        >
                            <option value="All Industries">All Industries</option>
                            <option value="Tech">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Map Section (Spans 2 columns) */}
                    <div className="lg:col-span-2 glass rounded-3xl p-6 border border-[var(--color-border)] relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[var(--color-accent)]" />
                                Opportunity Density Heatmap
                            </h3>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[var(--color-muted)]">Low</span>
                                <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[#1a1b3a] to-[var(--color-primary)] border border-white/10" />
                                <span className="font-bold text-white">High</span>
                            </div>
                        </div>

                        <motion.div
                            animate={{ opacity: isUpdating ? 0.4 : 1 }}
                            className="w-full h-[400px] sm:h-[500px] bg-black/20 rounded-2xl border border-white/5 flex items-center justify-center relative"
                        >
                            {/* Gradient Background Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[var(--color-primary)]/10 blur-[100px] rounded-full pointer-events-none" />

                            <ComposableMap
                                projectionConfig={{ scale: 140 }}
                                className="w-full h-full"
                            >
                                <ZoomableGroup center={[0, 20]} minZoom={1} maxZoom={4}>
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => {
                                                const d = opportunityData[geo.id] || 0;
                                                return (
                                                    <Geography
                                                        key={geo.rsmKey}
                                                        geography={geo}
                                                        fill={d > 0 ? colorScale(d) : "#1E293B"}
                                                        stroke="#0B0F17"
                                                        strokeWidth={0.5}
                                                        style={{
                                                            default: { outline: "none" },
                                                            hover: { fill: "#22C55E", outline: "none", cursor: "pointer", transition: "all 0.2s" },
                                                            pressed: { fill: "#16a34a", outline: "none" },
                                                        }}
                                                    />
                                                );
                                            })
                                        }
                                    </Geographies>
                                </ZoomableGroup>
                            </ComposableMap>
                        </motion.div>
                    </div>

                    {/* Right Column Charts */}
                    <div className="flex flex-col gap-6">

                        {/* Skill Distribution */}
                        <div className="glass rounded-3xl p-6 border border-[var(--color-border)] flex-1">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                                Skill Distribution
                            </h3>
                            <motion.div
                                animate={{ opacity: isUpdating ? 0.4 : 1 }}
                                className="h-[200px] w-full"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={skillData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        />
                                        <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </div>

                        {/* Hiring Demand Trend */}
                        <div className="glass rounded-3xl p-6 border border-[var(--color-border)] flex-1">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />
                                Hiring Demand
                            </h3>
                            <motion.div
                                animate={{ opacity: isUpdating ? 0.4 : 1 }}
                                className="h-[200px] w-full"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={demandData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: 'var(--color-accent)' }}
                                        />
                                        <Area type="monotone" dataKey="demand" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
