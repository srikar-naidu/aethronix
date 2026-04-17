"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Star, Volume2, Lightbulb, TrendingUp } from 'lucide-react';

interface FlashcardProps {
    question: string;
    hint?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    category?: string;
    tags?: string[];
    isBookmarked?: boolean;
    onBookmark?: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    currentIndex?: number;
    total?: number;
}

export default function Flashcard({
    question,
    hint = "Think about the core concepts and provide a structured answer with examples.",
    difficulty = 'Medium',
    category,
    tags = [],
    isBookmarked = false,
    onBookmark,
    onNext,
    onPrev,
    currentIndex = 0,
    total = 1
}: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleFlip = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setIsFlipped(!isFlipped);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handlePlayAudio = () => {
        // Simulate text-to-speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(question);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    };

    const getDifficultyColor = (level: string) => {
        switch (level) {
            case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'Hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--color-muted)]">
                        Question {currentIndex + 1} of {total}
                    </span>
                    {category && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                            {category}
                        </span>
                    )}
                </div>
                <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] h-full rounded-full"
                    />
                </div>
            </div>

            {/* Main Flashcard */}
            <div className="relative h-96 cursor-pointer" onClick={handleFlip}>
                <AnimatePresence mode="wait">
                    {!isFlipped ? (
                        <motion.div
                            key="front"
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: 0 }}
                            exit={{ rotateY: -90 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 backface-hidden"
                        >
                            <div className="h-full bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-card)] to-[var(--color-accent)]/5 rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="p-6 border-b border-[var(--color-border)]/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(difficulty)}`}>
                                                {difficulty}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onBookmark?.(); }}
                                                className={`p-1.5 rounded-full transition-colors ${isBookmarked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-gray-400 hover:text-yellow-400'}`}
                                            >
                                                <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePlayAudio(); }}
                                                className="p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                                            >
                                                <Volume2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                                                className="p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                                            {question}
                                        </h3>
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                                {tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/20">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-[var(--color-border)]/50">
                                    <p className="text-center text-sm text-[var(--color-muted)]">
                                        Click to reveal hint • Tap & hold to record answer
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="back"
                            initial={{ rotateY: 90 }}
                            animate={{ rotateY: 0 }}
                            exit={{ rotateY: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 backface-hidden"
                        >
                            <div className="h-full bg-gradient-to-br from-[var(--color-accent)]/10 via-[var(--color-card)] to-[var(--color-primary)]/5 rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="p-6 border-b border-[var(--color-border)]/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5 text-[var(--color-accent)]" />
                                            <span className="font-bold text-white">Hint & Tips</span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                                            className="p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <div className="text-center">
                                        <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                            {hint}
                                        </p>

                                        {/* Sample Structure */}
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                                            <h4 className="font-bold text-white mb-2 flex items-center justify-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
                                                Answer Structure
                                            </h4>
                                            <div className="text-sm text-gray-400 space-y-1">
                                                <p>1. Define the concept briefly</p>
                                                <p>2. Explain with examples</p>
                                                <p>3. Mention use cases or benefits</p>
                                                <p>4. Address potential drawbacks</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-[var(--color-border)]/50">
                                    <p className="text-center text-sm text-[var(--color-muted)]">
                                        Click to go back to question
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleFlip}
                        className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold transition-colors"
                    >
                        {isFlipped ? 'Show Question' : 'Show Hint'}
                    </button>
                </div>

                <button
                    onClick={onNext}
                    disabled={currentIndex === total - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}