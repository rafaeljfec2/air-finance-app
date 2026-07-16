import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
  type Transition,
} from 'framer-motion';
import { type ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

import { V3_EASE } from './motion';

const MOTION: Transition = {
  duration: 0.55,
  ease: V3_EASE,
};

const REDUCED: Transition = {
  duration: 0.01,
};

type RevealVariant = 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'fade' | 'scale';

function buildRevealVariants(reduced: boolean): Record<RevealVariant, Variants> {
  if (reduced) {
    const instant: Variants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
    return {
      fadeUp: instant,
      fadeDown: instant,
      fadeLeft: instant,
      fadeRight: instant,
      fade: instant,
      scale: instant,
    };
  }

  return {
    fadeUp: {
      hidden: { opacity: 0, y: 28 },
      visible: { opacity: 1, y: 0 },
    },
    fadeDown: {
      hidden: { opacity: 0, y: -24 },
      visible: { opacity: 1, y: 0 },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: 28 },
      visible: { opacity: 1, x: 0 },
    },
    fadeRight: {
      hidden: { opacity: 0, x: -28 },
      visible: { opacity: 1, x: 0 },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.94 },
      visible: { opacity: 1, scale: 1 },
    },
  };
}

interface ScrollRevealProps {
  readonly children: ReactNode;
  readonly variant?: RevealVariant;
  readonly delay?: number;
  readonly duration?: number;
  readonly threshold?: number;
  readonly className?: string;
  readonly once?: boolean;
}

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.55,
  threshold = 0.12,
  className,
  once = true,
}: ScrollRevealProps) {
  const reduced = useReducedMotion() === true;
  const { ref, inView } = useInView({ threshold, triggerOnce: once });
  const variants = buildRevealVariants(reduced);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={
        reduced
          ? REDUCED
          : {
              ...MOTION,
              duration,
              delay,
            }
      }
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
  readonly delayChildren?: number;
  readonly threshold?: number;
  readonly once?: boolean;
  readonly as?: 'div' | 'ol' | 'ul';
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delayChildren = 0.04,
  threshold = 0.1,
  once = true,
  as = 'div',
}: StaggerContainerProps) {
  const reduced = useReducedMotion() === true;
  const { ref, inView } = useInView({ threshold, triggerOnce: once });
  const MotionTag = as === 'ol' ? motion.ol : as === 'ul' ? motion.ul : motion.div;

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: reduced
            ? { staggerChildren: 0, delayChildren: 0 }
            : {
                staggerChildren: staggerDelay,
                delayChildren,
              },
        },
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerItemProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly variant?: 'fadeUp' | 'fade' | 'scale' | 'fadeRight';
  readonly duration?: number;
  readonly as?: 'div' | 'li';
}

export function StaggerItem({
  children,
  className,
  variant = 'fadeUp',
  duration = 0.45,
  as = 'div',
}: StaggerItemProps) {
  const reduced = useReducedMotion() === true;
  const variants = buildRevealVariants(reduced);
  const MotionTag = as === 'li' ? motion.li : motion.div;

  return (
    <MotionTag
      variants={variants[variant]}
      transition={reduced ? REDUCED : { duration, ease: V3_EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

interface HeroAnimationProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
}

export function HeroAnimation({ children, delay = 0, className }: HeroAnimationProps) {
  const reduced = useReducedMotion() === true;

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={
        reduced
          ? REDUCED
          : {
              duration: 0.65,
              delay,
              ease: V3_EASE,
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AmbientBlobProps {
  readonly className?: string;
  readonly duration?: number;
  readonly x?: number;
  readonly y?: number;
}

export function AmbientBlob({ className, duration = 12, x = 18, y = 12 }: AmbientBlobProps) {
  const reduced = useReducedMotion() === true;

  if (reduced) {
    return <div className={className} aria-hidden />;
  }

  return (
    <motion.div
      className={className}
      aria-hidden
      animate={{
        x: [0, x, -x * 0.5, 0],
        y: [0, -y, y * 0.6, 0],
        scale: [1, 1.06, 0.97, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

interface CollapseProps {
  readonly isOpen: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export function Collapse({ isOpen, children, className }: CollapseProps) {
  const reduced = useReducedMotion() === true;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={reduced ? REDUCED : { duration: 0.28, ease: V3_EASE }}
          className={className}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FadePresenceProps {
  readonly show: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export function FadePresence({ show, children, className }: FadePresenceProps) {
  const reduced = useReducedMotion() === true;

  return (
    <AnimatePresence initial={false}>
      {show ? (
        <motion.div
          key="fade-presence"
          initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={reduced ? REDUCED : { duration: 0.28, ease: V3_EASE }}
          className={className}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ScrollProgress() {
  const reduced = useReducedMotion() === true;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduced) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[110] h-[2px] origin-left bg-emerald-400/90"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

interface HoverLiftProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function HoverLift({ children, className }: HoverLiftProps) {
  const reduced = useReducedMotion() === true;

  return (
    <motion.div
      className={className}
      whileHover={reduced ? undefined : { y: -3 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: V3_EASE }}
    >
      {children}
    </motion.div>
  );
}
