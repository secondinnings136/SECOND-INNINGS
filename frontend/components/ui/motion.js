// Shared motion tokens. See /DESIGN.md (Motion).
export const EASE = [0.32, 0.72, 0, 1];

export const revealVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE },
  },
};
