'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/** Portrait with halftone overlay that scales from 1.15 to 1 as it scrolls into view. */
export default function ScalePortrait({ src, alt, className = '', sizes = '(min-width: 768px) 40vw, 100vw', priority = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.15, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[1.75rem] bg-paper-3 ${className}`}>
      <motion.div style={reduce ? undefined : { scale }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover grayscale contrast-[1.05]"
        />
      </motion.div>
      <div aria-hidden="true" className="halftone absolute inset-0 opacity-40" />
      <div aria-hidden="true" className="absolute inset-0 bg-signal/10 mix-blend-multiply" />
    </div>
  );
}
