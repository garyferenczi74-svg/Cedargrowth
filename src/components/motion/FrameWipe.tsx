'use client';
import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION } from '@/lib/motion';

export function FrameWipe({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <m.div className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>{children}</m.div>;
  }
  return (
    <m.div className={className}
      initial={{ clipPath: 'inset(100% 0 0 0)' }} whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={MOTION.viewport} transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay }}>
      {children}
    </m.div>
  );
}
