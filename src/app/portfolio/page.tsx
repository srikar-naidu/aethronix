"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Briefcase, Wand2, Download, ExternalLink, Github, 
    Linkedin, Award, CheckCircle 
} from 'lucide-react';
import Link from 'next/link';

interface PortfolioData {
    personalInfo: {
        name: string;
        role: string;
        email: string;
        github?: string;
        linkedin?: string;
    };
    summary: string;
    experience: Array<{
        role: string;
        company: string;
        duration: string;
        impact: string;
    }>;
    skills: {
        technical: string[];
        soft: string[];
    };
}

const DEFAULT_PORTFOLIO: PortfolioData = {
    personalInfo: {
        name: "Arjun Kumar",
        role: "Full Stack Developer Intern",
        email: "arjun@example.com",
    },
    summary: "Highly capable React developer with verified expertise in state management and performance optimization. Demonstrated strong system design intuition during MockPrep assessments. Proficient in building responsive, accessible interfaces with Tailwind CSS and Framer Motion.",
    experience: [
        {
            role: "E-Commerce Dashboard Built in 24 Hours",
            company: "Hackathon Entry",
            duration: "24 Hours",
            impact: "Designed and implemented complete dashboard UI with Recharts visualizations. Achieved 100/100 Lighthouse performance score."
        }
    ],
    skills: {
        technical: ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
        soft: ["Teamwork", "Problem Solving", "Rapid Prototyping"]
    }
};

export default function PortfolioPage() {
    const [exportSuccess, setExportSuccess] = useState(false);
    const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO);
    const [isCustom, setIsCustom] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('skillbridge_portfolio');
        if (saved) {
            setData(JSON.parse(saved));
            setIsCustom(true);
        }
    }, []);

    const handleExportPDF = () => {
        window.print();
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
    };

    const handleExportTXT = () => {
        const title = `SkillBridge AI - Professional Portfolio\n${"=".repeat(36)}\n\n`;
        const name = `Name: ${data.personalInfo.name}\nRole: ${data.personalInfo.role}\n\n`;
        const summary = `AI Summary:\n${data.summary}\n\n`;
        
        let expText = "Verified Experience:\n";
        data.experience.forEach(exp => {
            expText += `- ${exp.role} at ${exp.company} (${exp.duration})\n  * ${exp.impact}\n\n`;
        });

        const skills = `Top Skills:\n- ${data.skills.technical.join('\n- ')}\n`;
        
        const content = title + name + summary + expText + skills;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.personalInfo.name.replace(/\s+/g, '_')}_Portfolio.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[var(--color-background)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 no-print">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-white">
                            <Briefcase className="w-10 h-10 text-[var(--color-primary)]" />
                            {isCustom ? "Your Digital Portfolio" : "AI Built Portfolio"}
                        </h1>
                        <p className="text-[var(--color-muted)]">
                            {isCustom ? "Your verified identity on SkillBridge AI." : "Reviewing a sample AI-optimized profile."}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <Link 
                            href="/create-portfolio"
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center gap-2 font-medium shadow-lg hover:bg-[var(--color-primary)]/90 transition"
                        >
                            <Wand2 className="w-4 h-4" /> {isCustom ? "Edit Portfolio" : "Create Your Own"}
                        </Link>
                        <button 
                            onClick={handleExportTXT}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl glass glass-hover text-white flex items-center justify-center gap-2 font-medium transition-all
                                ${exportSuccess ? 'border-green-500/50 text-green-400' : ''}`}
                        >
                            <Download className="w-4 h-4" />
                            {exportSuccess ? 'Saved!' : 'Export .txt'}
                        </button>
                        <button 
                            onClick={handleExportPDF}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl glass glass-hover text-white flex items-center justify-center gap-2 font-medium transition-all`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Print/PDF
                        </button>
                    </div>
                </div>

                {/* Portfolio Preview Panel */}
                <div 
                    id="portfolio-container"
                    className="bg-white text-black rounded-[2rem] p-8 md:p-12 shadow-2xl mx-auto border border-white/20 relative overflow-hidden"
                >

                    {/* Header */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-8 mb-8 gap-6">
                        <div>
                            <h2 className="text-4xl font-extrabold mb-2">{data.personalInfo.name}</h2>
                            <p className="text-xl text-gray-600 font-medium">{data.personalInfo.role}</p>
                        </div>
                        <div className="flex gap-4 no-print">
                            {data.personalInfo.github && <a href={data.personalInfo.github} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"><Github className="w-5 h-5 " /></a>}
                            {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-blue-600 transition"><Linkedin className="w-5 h-5" /></a>}
                            <a href={`mailto:${data.personalInfo.email}`} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"><ExternalLink className="w-5 h-5" /></a>
                        </div>
                    </header>

                    <div className="grid md:grid-cols-3 gap-12">

                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-10">

                            <section>
                                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">Summary</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {data.summary}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">Experience</h3>

                                <div className="space-y-6">
                                    {data.experience.map((exp, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xl font-bold text-gray-900">{exp.role}</h4>
                                                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.duration}</span>
                                            </div>
                                            <p className="text-[var(--color-primary)] mb-2 font-medium">{exp.company}</p>
                                            <p className="text-gray-700 leading-relaxed">{exp.impact}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>

                        {/* Right Column */}
                        <div className="space-y-10">

                            <section>
                                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">Technical Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.technical.map(skill => (
                                        <span key={skill} className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium">{skill}</span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">Soft Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.soft.map(skill => (
                                        <span key={skill} className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200">{skill}</span>
                                    ))}
                                </div>
                            </section>

                            <section className="page-break-avoid">
                                <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">SkillBridge Badges</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                            <Award className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Verified Profile</p>
                                            <p className="text-xs text-gray-500">Issued by SkillBridge AI</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                                            <Award className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Skill-First Certification</p>
                                            <p className="text-xs text-gray-500">Ready for Internships</p>
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
