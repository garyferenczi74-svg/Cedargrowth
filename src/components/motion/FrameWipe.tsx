'use client';
import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION } from '@/lib/motion';

// Image / frame reveal: a transform-based mask. The content sits in an
// overflow-hidden frame and rises into place from below (translateY 100% to 0),
// a bottom-to-top wipe with no scale and no fade. Transform reveals fire
// reliably here from first paint (unlike clip-path, which was flaky under
// LazyMotion). The outer element carries the frame className (border, radius,
// dimensions); the inner element carries the moving content. Reduced motion
// shows the content immediately with opacity only.
export function FrameWipe({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} style={{ overflow: 'hidden' }}>
        <m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>
          {children}
        </m.div>
      </div>
    );
  }
  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <m.div initial={{ y: '100%' }} whileInView={{ y: '0%' }}
        viewport={MOTION.viewport} transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay }}>
        {children}
      </m.div>
    </div>
  );
}
