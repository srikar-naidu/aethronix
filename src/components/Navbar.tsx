"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { t } = useLanguage();

    const navLinks = [
        { name: t('navbar.portfolio'), href: '/portfolio' },
        { name: t('navbar.jobscout'), href: '/job-scout' },
        { name: t('navbar.aihire'), href: '/ai-hire' },
        { name: t('navbar.verify'), href: '/verify' },
        { name: t('navbar.roadmap'), href: '/roadmap' },
    ];

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-[var(--color-background)]/95 rounded-full border border-[var(--color-border)] shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
                                RUBIX
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-white text-gray-300"
                                    >
                                        {link.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSelector />

                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 font-bold"
                        >
                            {t('navbar.login')}
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 text-gray-300 hover:text-white"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-background)]"
                    >
                        <div className="flex flex-col space-y-1 px-4 py-4">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "rounded-md px-3 py-2 text-base font-medium",
                                            isActive
                                                ? "bg-[var(--color-background)]/50 text-white"
                                                : "text-gray-300 hover:bg-[var(--color-background)] hover:text-white"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="mt-4 inline-flex items-center justify-center rounded-lg px-4 py-2 text-base font-medium bg-[var(--color-primary)] text-white font-bold"
                            >
                                {t('navbar.login')}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
