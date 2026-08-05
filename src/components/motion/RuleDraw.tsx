'use client';
import { m, useReducedMotion } from 'framer-motion';
import { MOTION } from '@/lib/motion';

export function RuleDraw({ axis = 'x', delay = 0, duration = MOTION.duration.slow, className = '' }:
  { axis?: 'x' | 'y'; delay?: number; duration?: number; className?: string }) {
  const reduced = useReducedMotion();
  const origin = axis === 'x' ? 'left' : 'top';
  const scaleKey = axis === 'x' ? 'scaleX' : 'scaleY';
  if (reduced) {
    return <m.div className={className} style={{ transformOrigin: origin }}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={MOTION.viewport}
      transition={{ duration: MOTION.reducedMs }} />;
  }
  return <m.div className={className} style={{ transformOrigin: origin }}
    initial={{ [scaleKey]: 0 }} whileInView={{ [scaleKey]: 1 }} viewport={MOTION.viewport}
    transition={{ duration, ease: MOTION.ease, delay }} />;
}
