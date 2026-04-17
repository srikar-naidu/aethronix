"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    icon: any;
    href: string;
    color: string;
  };
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="h-full relative"
    >
      <Link href={feature.href} className="block h-full group focus:outline-none">
        <div
          ref={divRef}
          onMouseMove={handleMouseMove}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="h-full glass rounded-2xl p-8 border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-1 shadow-lg"
        >
          {/* Spotlight Effect */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 rounded-2xl"
            style={{
              opacity,
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(220, 20, 60, 0.1), transparent 40%)`,
            }}
          />

          {/* Top Right ambient glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[var(--color-primary)]/15 transition-colors duration-500" />

          {/* Icon floating animation on hover */}
          <motion.div
            whileHover={{ y: -5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <feature.icon className={`w-10 h-10 mb-6 ${feature.color} relative z-10 transition-transform duration-300`} />
          </motion.div>

          <h3 className="text-xl font-semibold text-white mb-3 relative z-10">{feature.title}</h3>
          <p className="text-[#888] leading-relaxed relative z-10">
            {feature.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}