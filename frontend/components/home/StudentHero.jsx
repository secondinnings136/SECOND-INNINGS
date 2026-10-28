'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function StudentHero() {
  const scrollToNext = (e) => {
    e?.preventDefault();
    const target = document.getElementById('crossroads') || document.getElementById('how-it-works');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[100dvh] lg:h-[100dvh] lg:max-h-[1080px] bg-[#F5F1E8] flex flex-col justify-between pt-20 sm:pt-24 lg:pt-24 pb-6 px-5 sm:px-8 lg:px-14 overflow-hidden">
      {/* Main 2-Column Hero Grid: Left Typography + Right Artistic Collage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center flex-1 my-auto max-w-7xl mx-auto w-full z-10">
        {/* Left Column: Eyebrow, Monumental Serif Headline, Lede & Actions */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left pt-4 lg:pt-0">
          {/* Eyebrow Meta Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-[0.16em] text-[#786653] leading-relaxed mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3">
              <span>Young minds. New perspectives. Wider possibilities.</span>
              <span className="hidden sm:inline-block w-12 md:w-16 h-px bg-[#5B4632]/25" />
            </div>
            <div className="mt-1">
              <span>Jaipur, India &nbsp;—&nbsp; Ages 16 to 25</span>
            </div>
          </motion.div>

          {/* Monumental Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(2.5rem,4.5vw,4.85rem)] xl:text-[5.25rem] font-normal leading-[1.04] tracking-[-0.025em] text-[#23180F] mb-6 sm:mb-7"
          >
            Somewhere between<br />
            ‘I don’t know’<br />
            and <span className="italic font-normal text-[#C8792C]">‘What comes next?’</span><br />
            there is <span className="italic font-normal text-[#C8792C]">a conversation.</span>
          </motion.h1>

          {/* Sub-Lede Body Copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[1.0625rem] sm:text-[1.125rem] text-[#443324] leading-[1.65] max-w-[43ch] mb-8 sm:mb-10 font-sans"
          >
            Second Innings is a space for young people to talk openly, understand themselves better, explore possibilities and find their own way forward.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-6 sm:gap-8"
          >
            <Link
              href="/book"
              className="group inline-flex items-center gap-3 rounded-full bg-[#23180F] px-6 sm:px-7 py-3 sm:py-3.5 text-[0.9375rem] font-medium text-[#FAF6EE] shadow-sm hover:bg-[#3D2C1E] active:scale-[0.98] transition-all duration-300"
            >
              <span>Start a Conversation</span>
              <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="#crossroads"
              onClick={scrollToNext}
              className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-[#23180F] hover:text-[#C8792C] transition-colors duration-200 group cursor-pointer"
            >
              <span>Explore How It Works</span>
              <span className="transition-transform duration-300 ease-editorial group-hover:translate-y-0.5">↓</span>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Visual World Artistic Collage */}
        <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center lg:justify-end z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[570px] xl:max-w-[620px] aspect-[559/517] select-none"
          >
            <motion.div
              animate={{ y: [-2, 3, -2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full relative"
            >
              <Image
                src="/assets/hero-composition-transparent@2x.png"
                alt="Second Innings — Somewhere between 'I don't know' and 'What comes next?' there is a conversation."
                width={1118}
                height={1034}
                priority
                className="w-full h-full object-contain filter drop-shadow-[0_4px_24px_rgba(91,70,50,0.07)] pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Docked Viewport Bottom Bar: Proof Badges (Left) & Scroll Indicator (Right) */}
      <div className="w-full max-w-7xl mx-auto pt-4 sm:pt-6 border-t border-[#5B4632]/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto z-10">
        {/* Left Side: Three Credibility Badges with Hairline Dividers */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-[0.8125rem] sm:text-[0.875rem] text-[#443324]">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#5B4632] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Human-led mentoring</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-[#5B4632]/25" />

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#5B4632] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Jaipur, India</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-[#5B4632]/25" />

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#5B4632] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Ages 16 – 25</span>
          </div>
        </div>

        {/* Right Side: Scroll to Explore Pill Indicator */}
        <button
          type="button"
          onClick={scrollToNext}
          className="hidden sm:inline-flex items-center gap-2.5 text-[#786653] hover:text-[#23180F] transition-colors group cursor-pointer"
          aria-label="Scroll to explore"
        >
          <div className="w-4 h-7 rounded-full border border-[#23180F]/45 flex justify-center pt-1 group-hover:border-[#23180F] transition-colors">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-[#23180F]/70"
            />
          </div>
          <span className="font-mono text-[0.625rem] tracking-[0.22em] uppercase font-medium">
            Scroll to explore
          </span>
        </button>
      </div>
    </section>
  );
}
