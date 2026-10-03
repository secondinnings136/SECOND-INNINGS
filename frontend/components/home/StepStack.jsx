'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const STEP_THEMES = [
  {
    pill: 'bg-sun-soft text-sun border-sun-border',
    accent: 'text-sun',
    border: 'border-sun-border/60',
    dot: 'bg-sun',
  },
  {
    pill: 'bg-coral-soft text-coral border-coral-border',
    accent: 'text-coral',
    border: 'border-coral-border/60',
    dot: 'bg-coral',
  },
  {
    pill: 'bg-sprout-soft text-sprout border-sprout-border',
    accent: 'text-sprout',
    border: 'border-sprout-border/60',
    dot: 'bg-sprout',
  },
  {
    pill: 'bg-sun-soft text-sun border-sun-border',
    accent: 'text-sun',
    border: 'border-sun-border/60',
    dot: 'bg-sun',
  },
  {
    pill: 'bg-sky-soft text-sky border-sky-border',
    accent: 'text-sky',
    border: 'border-sky-border/60',
    dot: 'bg-sky',
  },
];

/**
 * Sticky stacking cards with life-giving student vitality color arcs.
 * Each card pins below the nav; earlier cards scale down slightly as later ones arrive.
 */
function StackCard({ step, index, total, progress }) {
  const reduce = useReducedMotion();
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index) * 0.03]);
  const theme = STEP_THEMES[index % STEP_THEMES.length];

  return (
    <div className="sticky top-24 md:top-28" style={{ paddingTop: `${index * 14}px` }}>
      <motion.article
        style={reduce ? undefined : { scale, transformOrigin: 'top center' }}
        className="relative grid min-h-[22rem] grid-cols-1 gap-8 overflow-hidden rounded-[1.75rem] border border-line bg-paper p-7 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.05)] md:grid-cols-12 md:gap-10 md:p-12"
      >
        {/* Subtle decorative color bloom in corner */}
        <span
          aria-hidden="true"
          className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-20 pointer-events-none ${theme.dot}`}
        />

        <div className="md:col-span-5 flex flex-col justify-between gap-8 relative z-10">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${theme.pill}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
              Stage {step.step}
            </span>
            <span className="meta">
              of {String(total).padStart(2, '0')}
            </span>
          </div>
          <p
            aria-hidden="true"
            className={`font-serif text-[clamp(6rem,14vw,11rem)] leading-[0.8] tracking-[-0.04em] font-normal transition-colors ${theme.accent} opacity-35`}
          >
            {step.step}
          </p>
        </div>
        <div className="md:col-span-7 flex flex-col justify-end relative z-10">
          <h3 className="font-serif text-[clamp(2.25rem,3.4vw,3.25rem)] leading-[1] tracking-[-0.02em] text-ink">
            {step.name}
          </h3>
          <p className="mt-4 font-serif italic text-[1.25rem] leading-snug text-ink-2">{step.subtitle}</p>
          <p className="lede mt-5 text-muted">{step.description}</p>
        </div>
      </motion.article>
    </div>
  );
}

export default function StepStack({ steps }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <div ref={ref} className="relative flex flex-col gap-[18vh] pb-[6vh]">
      {steps.map((s, i) => (
        <StackCard key={s.step} step={s} index={i} total={steps.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}
