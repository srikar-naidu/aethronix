"use client";

import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '@/data/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLangName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--color-primary)]/50 transition-all group"
            >
                <Languages className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                <span className="text-xs font-bold text-gray-300 hidden md:block">{currentLangName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full z-[100] mt-2 w-56 glass rounded-xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl bg-black/90 p-1"
                    >
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as Language);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-white/5 ${language === lang.code ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-bold' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <span>{lang.name}</span>
                                    {language === lang.code && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
