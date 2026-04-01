"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TRANSLATIONS, Language } from '@/data/translations';

type TranslationKeys = typeof TRANSLATIONS.en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('skillbridge-lang') as Language;
        if (savedLang && TRANSLATIONS[savedLang]) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('skillbridge-lang', lang);
        // Force update for technical SEO/Accessibility if needed
        document.documentElement.lang = lang;
    };

    // Simple helper to get nested keys like 'navbar.login'
    const t = (path: string) => {
        const keys = path.split('.');
        let current: any = TRANSLATIONS[language];
        
        for (const key of keys) {
            if (current[key] === undefined) {
                // Fallback to English if key missing in translation
                let fallback = TRANSLATIONS.en;
                for (const fallbackKey of keys) {
                    fallback = (fallback as any)[fallbackKey];
                    if (fallback === undefined) return path;
                }
                return fallback;
            }
            current = current[key];
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
