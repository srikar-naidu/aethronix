"use client";

import { motion } from 'framer-motion';
import {
  CheckCircle, Zap, Target, Video, Briefcase,
  FileText, TrendingUp, Search, Award
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';

const SplineScene = dynamic(() => import('@/components/SplineScene'), { ssr: false });

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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
                <span className="text-white">{t('home.hero.title')} </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
                  {t('home.hero.titleBold')}
                </span>
              </h1>
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
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
              </div>
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
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={feature.href} className="block h-full group">
                  <div className="h-full glass rounded-2xl p-8 border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-[var(--color-primary)]/10 transition-colors" />

                    <feature.icon className={`w-10 h-10 mb-6 ${feature.color}`} />
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
