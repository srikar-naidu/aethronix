"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle, AlertCircle, 
  ArrowRight, Brain, Zap, Target, Loader2, Sparkles, Wand2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    contact: string;
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    impact: string;
  }>;
  readinessScore: number;
  analysisSummary: string;
  missingSkills: string[];
}

export default function ResumeParserPage() {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [result, setResult] = useState<ParsedResume | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.toLowerCase().endsWith('.txt') || droppedFile?.type === 'text/plain') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a text file (.txt).');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const parseResume = async () => {
    if (!file) return;

    setIsParsing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      setResult(data);
      // Save for the portfolio builder
      localStorage.setItem('RUBIX_last_parsed', JSON.stringify(data));
    } catch (err: any) {
      setError(err?.message || 'An error occurred while parsing the resume.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            {t('resumeparser.title')}
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('resumeparser.subtitle')}
          </h1>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
            Upload your resume and let our AI optimize your profile, identify gaps, and align you with the best-fit roadmaps in your native language.
          </p>
        </div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer overflow-hidden group
                ${isDragging ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 glass'}
                ${isParsing ? 'pointer-events-none' : ''}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt"
                className="hidden"
              />
              
              <AnimatePresence mode="wait">
                {isParsing ? (
                  <motion.div
                    key="parsing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative w-24 h-24 mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      />
                      <Brain className="absolute inset-0 m-auto w-10 h-10 text-[var(--color-primary)] animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{t('resumeparser.parsing')}</h3>
                    <p className="text-[var(--color-muted)]">Identifying skills, experience, and career readiness...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      {file ? <FileText className="w-10 h-10 text-[var(--color-primary)]" /> : <Upload className="w-10 h-10 text-[var(--color-primary)]" />}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {file ? file.name : t('resumeparser.uploadZone')}
                    </h3>
                    <p className="text-[var(--color-muted)] mb-6">
                      {t('resumeparser.supportText')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {file && !isParsing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    parseResume();
                  }}
                  className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary)]/90 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Analyze Profiles
                </button>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 flex items-center gap-3 text-red-500"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Analysis Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Readiness Card */}
              <div className="glass rounded-3xl p-8 border border-[var(--color-border)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{t('resumeparser.analysis')}</h2>
                    <p className="text-[var(--color-muted)]">{result.personalInfo.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
                      {result.readinessScore}%
                    </div>
                    <div className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">{t('resumeparser.readiness')}</div>
                  </div>
                </div>

                <p className="text-lg text-white leading-relaxed mb-8 italic">
                  "{result.analysisSummary}"
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                       <CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />
                       {t('resumeparser.extractedSkills')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.technical.map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-accent)] border border-[var(--color-primary)]/20 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                       <Target className="w-4 h-4 text-orange-400" />
                       {t('resumeparser.missingSkills')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-orange-400/10 text-orange-400 border border-orange-400/20 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Highlights */}
              <div className="glass rounded-3xl p-8 border border-[var(--color-border)]">
                <h3 className="text-xl font-bold text-white mb-6">Experience Analysis</h3>
                <div className="space-y-6">
                  {result.experience.map((exp, i) => (
                    <div key={i} className="relative pl-8 pb-6 border-l border-[var(--color-border)] last:pb-0 last:border-0">
                      <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h4 className="font-bold text-white">{exp.role}</h4>
                        <span className="text-xs text-[var(--color-muted)]">{exp.duration}</span>
                      </div>
                      <p className="text-sm text-[var(--color-accent)] mb-2">{exp.company}</p>
                      <p className="text-[var(--color-muted)] text-sm">{exp.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations Column */}
            <div className="space-y-6">
              <div className="glass rounded-3xl p-6 border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[var(--color-primary)]" />
                  AI Recommendations
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-sm text-gray-300 mb-3">Based on your skills, you have a <strong>{t('resumeparser.highMatch')}</strong> with these domains:</p>
                    <div className="space-y-2">
                      <Link href="/roadmap" className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                        <span className="text-sm text-white">Fullstack Engineering</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link href="/roadmap" className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                        <span className="text-sm text-white">AI/ML Development</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => router.push('/create-portfolio?import=true')}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    Build Portfolio with this Data
                  </button>

                  <button 
                    onClick={() => setResult(null)}
                    className="w-full py-3 rounded-xl border border-white/10 text-[var(--color-muted)] text-sm font-bold hover:bg-white/5 transition-all text-center"
                  >
                    Analyze New Resume
                  </button>
                </div>
              </div>

              <div className="glass rounded-3xl p-6 border border-[var(--color-border)]">
                 <h3 className="text-sm font-bold text-white mb-4">Contact Info</h3>
                 <div className="space-y-3">
                   <p className="text-xs text-[var(--color-muted)]">Email: <span className="text-white">{result.personalInfo.email}</span></p>
                   {result.personalInfo.contact && <p className="text-xs text-[var(--color-muted)]">Phone: <span className="text-white">{result.personalInfo.contact}</span></p>}
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
