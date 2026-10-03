'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Sticky stacking cards (gpt-taste "card stack", Framer edition).
 * Each card pins below the nav; earlier cards scale down slightly as later ones arrive.
 */
function StackCard({ step, index, total, progress }) {
  const reduce = useReducedMotion();
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index) * 0.03]);

  return (
    <div className="sticky top-24 md:top-28" style={{ paddingTop: `${index * 14}px` }}>
      <motion.article
        style={reduce ? undefined : { scale, transformOrigin: 'top center' }}
        className="relative grid min-h-[22rem] grid-cols-1 gap-8 overflow-hidden rounded-[1.75rem] border border-line bg-paper p-7 md:grid-cols-12 md:gap-10 md:p-12"
      >
        <div className="md:col-span-5 flex flex-col justify-between gap-8">
          <p className="meta">
            Step {step.step} of {String(total).padStart(2, '0')}
          </p>
          <p
            aria-hidden="true"
            className="text-outline font-serif text-[clamp(6rem,14vw,11rem)] leading-[0.8] tracking-[-0.04em]"
          >
            {step.step}
          </p>
        </div>
        <div className="md:col-span-7 flex flex-col justify-end">
          <h3 className="font-serif text-[clamp(2rem,3.4vw,3rem)] leading-[1] tracking-[-0.02em] text-ink">
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
