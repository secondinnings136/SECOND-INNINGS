'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { revealVariants } from './motion';

/** Single element that fades/blurs in once when scrolled into view. */
export function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) {
    const Plain = as;
    return <Plain className={className} {...rest}>{children}</Plain>;
  }
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={revealVariants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Parent that staggers its RevealItem children by 0.08s. */
export function RevealGroup({ as = 'div', className = '', stagger = 0.08, children, ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) {
    const Plain = as;
    return <Plain className={className} {...rest}>{children}</Plain>;
  }
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ as = 'div', className = '', children, ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) {
    const Plain = as;
    return <Plain className={className} {...rest}>{children}</Plain>;
  }
  return (
    <Comp className={className} variants={revealVariants} {...rest}>
      {children}
    </Comp>
  );
}

export default Reveal;
