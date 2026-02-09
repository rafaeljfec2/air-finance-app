import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { type ReactNode } from 'react';

interface ScrollRevealProps {
  readonly children: ReactNode;
  readonly variant?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'fade' | 'scale';
  readonly delay?: number;
  readonly duration?: number;
  readonly threshold?: number;
  readonly className?: string;
  readonly once?: boolean;
}

const revealVariants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -32 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  threshold = 0.15,
  className,
  once = true,
}: ScrollRevealProps) {
  const { ref, inView } = useInView({ threshold, triggerOnce: once });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={revealVariants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly staggerDelay?: number;
  readonly threshold?: number;
  readonly once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  threshold = 0.1,
  once = true,
}: StaggerContainerProps) {
  const { ref, inView } = useInView({ threshold, triggerOnce: once });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly variant?: 'fadeUp' | 'fade' | 'scale';
  readonly duration?: number;
}

export function StaggerItem({
  children,
  className,
  variant = 'fadeUp',
  duration = 0.45,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={revealVariants[variant]}
      transition={{
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HeroAnimationProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
}

export function HeroAnimation({ children, delay = 0, className }: HeroAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CollapseProps {
  readonly isOpen: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export function Collapse({ isOpen, children, className }: CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className={className}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
