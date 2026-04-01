"use client";

import { motion } from 'framer-motion';
import {
  CheckCircle, Zap, Target, Video, Briefcase,
  FileText, TrendingUp, Search, Award
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--color-primary)]/20 via-[var(--color-background)] to-[var(--color-background)]" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
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
              <p className="text-xl text-[var(--color-muted)] mb-8 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary)]/90 transition-all hover:scale-105"
                >
                  {t('home.hero.getStarted')}
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl glass glass-hover text-white font-semibold transition-all hover:scale-105"
                >
                  {t('home.hero.explore')}
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Floating Cards */}
            <div className="relative h-[400px] lg:h-[500px] hidden md:block">
              {/* Card 1 */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-64 glass p-6 rounded-2xl border border-[var(--color-primary)]/30 shadow-2xl shadow-[var(--color-primary)]/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xl">
                    98
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Skill Score</h3>
                    <p className="text-sm text-[var(--color-accent)]">Top 2% Globally</p>
                  </div>
                </div>
                <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                  <div className="bg-[var(--color-accent)] h-2 rounded-full w-[98%]"></div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-10 w-72 glass p-5 rounded-2xl shadow-xl shadow-black/50 z-10"
              >
                <div className="flex items-start gap-4">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Student" className="w-10 h-10 rounded-full border-2 border-[var(--color-accent)]" />
                  <div>
                    <h3 className="font-medium text-white">Interview Analysis</h3>
                    <p className="text-xs text-[var(--color-muted)] mt-1">"Excellent problem breakdown and communication. Code was optimal."</p>
                    <div className="mt-3 flex gap-2">
                      <span className="px-2 py-1 rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                      <span className="px-2 py-1 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-medium">React</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

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
