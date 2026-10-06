'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Arrow from '../ui/Arrow';

const DILEMMAS = [
  {
    id: 'career',
    label: '“I don’t know what career to choose”',
    pillColor: 'bg-sun-soft border-sun-border text-sun',
    activePill: 'bg-sun text-paper border-sun shadow-md',
    bg: 'bg-sun-soft/60',
    border: 'border-sun-border',
    text: 'text-sun',
    question: '“Everyone else seems to have a clear roadmap. Where do I even begin?”',
    insight: 'Career confusion can come from different places—too many choices, limited exposure, expectations from others, or simply not knowing yourself well enough yet. Understanding where your confusion is coming from can be a useful first step. Perhaps this is where a conversation can begin.',
    invitation: 'Perhaps this is where a conversation can begin.'
  },
  {
    id: 'confidence',
    label: '“Good at studies, but low on confidence”',
    pillColor: 'bg-coral-soft border-coral-border text-coral',
    activePill: 'bg-coral text-paper border-coral shadow-md',
    bg: 'bg-coral-soft/60',
    border: 'border-coral-border',
    text: 'text-coral',
    question: '“I get good marks, but in interviews or group settings, I freeze.”',
    insight: 'Academic performance and personal confidence often develop differently. Scoring well is one skill; trusting your voice in unfamiliar rooms is another. Recognizing where the hesitation comes from is often where real self-belief begins to take shape.',
    invitation: 'A safe, non-judgmental space to understand and build confidence.'
  },
  {
    id: 'parents',
    label: '“Parents want one thing, I want another”',
    pillColor: 'bg-sky-soft border-sky-border text-sky',
    activePill: 'bg-sky text-paper border-sky shadow-md',
    bg: 'bg-sky-soft/60',
    border: 'border-sky-border',
    text: 'text-sky',
    question: '“How do I pursue my interests without causing conflict at home?”',
    insight: 'Differences with family often stem from care and concern rather than a desire to control. Finding ways to understand their perspective while clarifying your own can help transform tension into constructive dialogue.',
    invitation: 'Explore how to bridge expectations with personal clarity.'
  },
  {
    id: 'exposure',
    label: '“I have no exposure beyond my classroom”',
    pillColor: 'bg-sprout-soft border-sprout-border text-sprout',
    activePill: 'bg-sprout text-paper border-sprout shadow-md',
    bg: 'bg-sprout-soft/60',
    border: 'border-sprout-border',
    text: 'text-sprout',
    question: '“How do I discover fellowships, startups, and unconventional opportunities?”',
    insight: 'Most meaningful opportunities and career pathways are rarely discussed inside a standard syllabus. Discovering what exists begins with curiosity, asking better questions, and connecting with people beyond familiar circles.',
    invitation: 'Open your perspective to opportunities you haven’t yet encountered.'
  },
  {
    id: 'transition',
    label: '“About to graduate, don’t know what comes next”',
    pillColor: 'bg-coral-soft border-coral-border text-signal-deep',
    activePill: 'bg-signal-deep text-paper border-signal-deep shadow-md',
    bg: 'bg-coral-soft/60',
    border: 'border-coral-border',
    text: 'text-signal-deep',
    question: '“College is ending, and the real world feels overwhelming.”',
    insight: 'Reaching the end of university without a definitive roadmap is far more common than people admit. Transition is not about having the next twenty years mapped out—it is about seeing your very next step clearly and taking it with confidence.',
    invitation: 'One conversation can help bring focus to what comes next.'
  }
];

export default function StudentHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDilemma = DILEMMAS[activeIndex];

  return (
    <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 overflow-hidden">
      <div className="page-x relative z-10">
        {/* Eyebrow Meta Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[0.6875rem] sm:text-[0.75rem] font-mono uppercase tracking-[0.18em] text-muted mb-8 sm:mb-12"
        >
          <span>Young minds. New perspectives. Wider possibilities.</span>
          <span className="text-line">—</span>
          <span>Jaipur, India</span>
          <span className="text-line">—</span>
          <span>Ages 16 to 25</span>
        </motion.div>

        {/* Monumental Editorial Headline with Inline Deepak Sogani Pill */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(2.75rem,6.2vw,5.75rem)] font-normal leading-[1.06] tracking-[-0.03em] text-ink text-left"
        >
          Sometimes, you don’t need<br />
          another answer.{' '}
          <span className="inline-flex items-center align-middle mx-1.5 sm:mx-3 h-[0.72em] w-[2.2em] rounded-full overflow-hidden border border-line bg-paper-2 relative shadow-inner translate-y-[-0.04em]">
            <img
              src="/deepaksogani.jpeg"
              alt="Deepak Sogani"
              className="w-1/2 h-full object-cover object-top grayscale contrast-125 brightness-95"
            />
            <div className="w-1/2 h-full bg-[#E2DBD0] flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: 'radial-gradient(#1C1B18 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />
            </div>
          </span>{' '}
          You<br />
          need the{' '}
          <span className="italic text-coral font-normal">
            right conversation.
          </span>
        </motion.h1>

        {/* Right-Aligned Sub-Lede & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-18 grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          <div className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7 text-left">
            <p className="text-[1.0625rem] sm:text-[1.1875rem] text-ink-2 leading-relaxed font-sans mb-8">
              Second Innings is a space for young people to talk openly, understand themselves better, explore possibilities and find their own way forward.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Button href="/book">Start a Conversation</Button>
              <Link
                href="/#how-it-works"
                onClick={(e) => {
                  const el = document.getElementById('how-it-works');
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', '#how-it-works');
                  }
                }}
                className="inline-flex items-center gap-2 text-ink text-[0.9375rem] font-medium hover:text-coral transition-colors group cursor-pointer"
              >
                <span>Explore Second Innings</span>
                <Arrow direction="down" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Interactive Student Crossroads Navigator */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-line text-left max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <p className="meta text-muted">
              ✦ Click any question to see how a conversation begins:
            </p>
            <span className="meta text-sun font-semibold">
              Interactive Student Navigator
            </span>
          </div>

          {/* Dilemma Selector Chips */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {DILEMMAS.map((d, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? `${d.activePill} scale-[1.03]`
                      : `border border-line bg-paper text-ink hover:border-ink/30 hover:${d.pillColor}`
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Perspective Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDilemma.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`mt-6 p-6 sm:p-8 rounded-[1.75rem] border ${activeDilemma.border} ${activeDilemma.bg} transition-colors duration-500 relative overflow-hidden`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border bg-paper ${activeDilemma.border} ${activeDilemma.text}`}>
                  {activeDilemma.label.replace(/[“”]/g, '')}
                </span>
                <span className="text-xs font-mono text-muted">• Mentor Perspective</span>
              </div>
              <h3 className="font-serif text-[1.5rem] sm:text-[1.875rem] text-ink font-normal leading-snug mb-3">
                {activeDilemma.question}
              </h3>
              <p className="text-[0.9375rem] sm:text-[1.0625rem] text-ink-2 leading-relaxed max-w-3xl">
                {activeDilemma.insight}
              </p>
              <div className="mt-6 pt-5 border-t border-line/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className={`text-xs sm:text-[0.875rem] font-medium ${activeDilemma.text}`}>
                  {activeDilemma.invitation}
                </span>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ink hover:text-coral transition-colors shrink-0"
                >
                  Start a conversation with Deepak
                  <Arrow className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist 4-Column Proof & Reassurance Row */}
        <div className="mt-14 pt-8 border-t border-line grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="block font-serif text-[1.75rem] text-ink font-normal leading-none mb-1">35+ Years</span>
            <span className="meta text-muted text-[0.6875rem]">Across Corporate Life, Entrepreneurship &amp; Higher Education</span>
          </div>
          <div>
            <span className="block font-serif text-[1.75rem] text-ink font-normal leading-none mb-1">One-to-One</span>
            <span className="meta text-muted text-[0.6875rem]">Private Conversations</span>
          </div>
          <div>
            <span className="block font-serif text-[1.75rem] text-ink font-normal leading-none mb-1">Next Step</span>
            <span className="meta text-muted text-[0.6875rem]">Agreed Action &amp; Follow-Through</span>
          </div>
          <div>
            <span className="block font-serif text-[1.75rem] text-ink font-normal leading-none mb-1">No Prescriptions</span>
            <span className="meta text-muted text-[0.6875rem]">No ready-made answers. No predetermined path.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
