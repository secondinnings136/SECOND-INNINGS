'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_PHRASES = [
  {
    title: 'Clarity.',
    subtitle: 'When information is everywhere, perspective is rare.',
    highlight: 'tea',
  },
  {
    title: 'Perspective.',
    subtitle: 'Preparing young minds for life beyond the classroom.',
    highlight: 'golden',
  },
  {
    title: 'SECOND INNINGS',
    subtitle: 'Mentoring Young Minds.',
    highlight: 'brand',
  },
];

export default function FluidBlurIntro({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check if user already saw the intro during this session
    const hasSeen = typeof window !== 'undefined' ? sessionStorage.getItem('si_intro_seen') : null;
    if (hasSeen === 'true') {
      setIsFinished(true);
      if (onComplete) onComplete();
      return;
    }

    // Step through the 3 phrases smoothly
    const t1 = setTimeout(() => setCurrentIndex(1), 1100);
    const t2 = setTimeout(() => setCurrentIndex(2), 2200);
    const t3 = setTimeout(() => {
      handleFinish();
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('si_intro_seen', 'true');
    }
    setIsFinished(true);
    if (onComplete) onComplete();
  };

  if (isFinished) return null;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="fluid-blur-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: '-100%',
            filter: 'blur(20px)',
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#2E4052] via-[#243342] to-[#412234] text-white overflow-hidden select-none cursor-pointer"
          onClick={handleFinish}
        >
          {/* Ambient fluid blur background orbs */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.15, 0.3, 0.15],
              x: [-20, 20, -20],
              y: [-10, 15, -10],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#BDD9BF] filter blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.35, 0.2],
              x: [20, -20, 20],
              y: [15, -15, 15],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-[#FFC857] filter blur-[130px] pointer-events-none"
          />

          {/* Center Typographic Experience with Fluid Blur */}
          <div className="relative z-10 max-w-2xl px-6 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{
                  opacity: 0,
                  filter: 'blur(24px)',
                  y: 18,
                  scale: 0.94,
                }}
                animate={{
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  filter: 'blur(20px)',
                  y: -18,
                  scale: 1.04,
                  transition: {
                    duration: 0.45,
                    ease: [0.7, 0, 0.84, 0],
                  },
                }}
                className="flex flex-col items-center justify-center space-y-4"
              >
                {/* Fluid Pill Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs uppercase tracking-[0.2em] text-[#BDD9BF] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC857] animate-pulse"></span>
                  Human-Led Mentoring
                </div>

                {/* Main Heading with Fluid Blur Text */}
                <h1
                  className={`text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight ${
                    INTRO_PHRASES[currentIndex].highlight === 'golden'
                      ? 'text-[#FFC857]'
                      : INTRO_PHRASES[currentIndex].highlight === 'tea'
                      ? 'text-[#BDD9BF]'
                      : 'text-white'
                  }`}
                >
                  {INTRO_PHRASES[currentIndex].title}
                </h1>

                {/* Subtitle / Philosophy statement */}
                <p className="text-base sm:text-xl text-white/80 font-light max-w-lg mx-auto tracking-wide">
                  {INTRO_PHRASES[currentIndex].subtitle}
                </p>

                {/* Decorative golden rule line for the final reveal */}
                {currentIndex === 2 && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 96, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="h-1 bg-[#FFC857] rounded-full mt-2"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Progress & Skip button */}
          <div className="absolute bottom-8 w-full max-w-md px-6 flex items-center justify-between z-20 text-xs text-white/60">
            {/* Step Indicators */}
            <div className="flex gap-2 items-center">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentIndex
                      ? 'w-8 bg-[#FFC857]'
                      : idx < currentIndex
                      ? 'w-3 bg-[#BDD9BF]'
                      : 'w-3 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Skip Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFinish();
              }}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs tracking-wider uppercase backdrop-blur-sm border border-white/10"
            >
              Skip Intro →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
