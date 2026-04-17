"use client";

import { motion } from 'framer-motion';
import {
  CheckCircle, Zap, Target, Video, Briefcase,
  FileText, TrendingUp, Search, Award, Radar
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';

const SplineScene = dynamic(() => import('@/components/SplineScene'), { ssr: false });
import FeatureCard from '@/components/FeatureCard';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      title: t('navbar.verify'),
      description: 'AI-driven skill assessments to prove your capabilities',
      icon: CheckCircle,
      href: '/verify',
      color: 'text-blue-400'
    },
    {
      title: t('navbar.matchai'),
      description: 'Get matched with internships based on verified skills',
      icon: Zap,
      href: '/match-ai',
      color: 'text-yellow-400'
    },
    {
      title: t('navbar.mockprep'),
      description: 'Practice with AI and track your milestones',
      icon: Target,
      href: '/mock-prep',
      color: 'text-green-400'
    },
    {
      title: t('navbar.aihire'),
      description: 'Experience full AI-led interview simulations',
      icon: Video,
      href: '/ai-hire',
      color: 'text-purple-400'
    },
    {
      title: t('navbar.portfolio'),
      description: 'Generate stunning portfolios automatically',
      icon: Briefcase,
      href: '/portfolio',
      color: 'text-pink-400'
    },
    {
      title: t('navbar.roadmap'),
      description: 'AI-generated paths to cover your skill gaps',
      icon: TrendingUp,
      href: '/roadmap',
      color: 'text-orange-400'
    },
    {
      title: t('navbar.resumeparser'),
      description: 'Optimize your resume and align skills with top opportunities',
      icon: FileText,
      href: '/resume-parser',
      color: 'text-teal-400'
    },
    {
      title: t('navbar.quickhire'),
      description: 'Fast-track hiring for startups and recruiters',
      icon: Search,
      href: '/quick-hire',
      color: 'text-indigo-400'
    },
    {
      title: 'Milestone Tracker',
      description: 'Stay on top of deliverables and project goals',
      icon: Award,
      href: '/dashboard',
      color: 'text-red-400'
    },
    {
      title: t('navbar.jobscout'),
      description: 'AI agent that finds, scores, and prepares you for the best-fit jobs',
      icon: Radar,
      href: '/job-scout',
      color: 'text-cyan-400'
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section - Full Screen with Spline Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Full-Screen Spline 3D Background - Zoomed In */}
        <div className="absolute inset-[-25%] z-0">
          <SplineScene />
        </div>

        {/* Gradient Overlay for Text Readability - pointer-events-none so Spline stays interactive */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent pointer-events-none" />

        {/* Floating Text Content - pointer-events-none on wrapper, enabled on interactive elements */}
        <div className="relative z-[2] h-full flex items-center pointer-events-none">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
                <span className="text-white drop-shadow-md">{t('home.hero.title')} </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] drop-shadow-[0_0_15px_rgba(220,20,60,0.4)]">
                  {t('home.hero.titleBold')}
                </span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-xl text-white/80 mb-8 leading-relaxed tracking-wide font-light"
              >
                {t('home.hero.subtitle')}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pointer-events-auto"
              >
                <Link
                  href="/login"
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-all hover:scale-105 shadow-lg shadow-[var(--color-primary)]/25"
                >
                  {t('home.hero.getStarted')}
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl glass text-white font-semibold transition-all hover:scale-105 backdrop-blur-md"
                >
                  {t('home.hero.explore')}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t('home.features.title')}</h2>
            <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-lg">
              {t('home.features.subtitle')}
            </p>
          </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {features.map((feature, index) => (
               <FeatureCard key={feature.title} feature={feature} index={index} />
             ))}
           </div>
        </div>
      </section>
    </main>
  );
}
