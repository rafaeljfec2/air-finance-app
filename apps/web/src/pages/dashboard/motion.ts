import type { Transition, Variants } from 'framer-motion';

export const PAGE_TRANSITION: Transition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

export const sectionContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

export const sectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: PAGE_TRANSITION,
  },
};

export const reducedSectionContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.01 } },
};

export const reducedSectionItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.01 } },
};

export const pillarDetailVariants: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
  expanded: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

export const reducedPillarDetailVariants: Variants = {
  collapsed: { opacity: 0, height: 0, transition: { duration: 0.01 } },
  expanded: { opacity: 1, height: 'auto', transition: { duration: 0.01 } },
};
