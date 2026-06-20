/**
 * Shared Framer Motion animation variants.
 * Import these across pages and components for consistent motion design.
 */

import type { Variants, Transition } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Transitions                                                       */
/* ------------------------------------------------------------------ */

export const springTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

export const smoothTransition: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

/* ------------------------------------------------------------------ */
/*  Fade                                                              */
/* ------------------------------------------------------------------ */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: smoothTransition },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

/* ------------------------------------------------------------------ */
/*  Scale                                                             */
/* ------------------------------------------------------------------ */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: smoothTransition,
  },
};

/* ------------------------------------------------------------------ */
/*  Stagger containers                                                */
/* ------------------------------------------------------------------ */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Stagger children                                                  */
/* ------------------------------------------------------------------ */

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

/* ------------------------------------------------------------------ */
/*  Page transition                                                   */
/* ------------------------------------------------------------------ */

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Hover / tap micro-interactions                                    */
/* ------------------------------------------------------------------ */

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
} as const;

export const hoverScale = {
  whileHover: { scale: 1.03, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97 },
} as const;

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 0 6px rgba(15, 159, 111, 0.12)",
    transition: { duration: 0.2 },
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Gauge / progress animations                                       */
/* ------------------------------------------------------------------ */

export const gaugeReveal: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Slide variants (for wizard steps, etc.)                           */
/* ------------------------------------------------------------------ */

export const slideInFromRight: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: smoothTransition },
  exit: { x: -60, opacity: 0, transition: { duration: 0.3 } },
};

export const slideInFromLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: smoothTransition },
  exit: { x: 60, opacity: 0, transition: { duration: 0.3 } },
};
