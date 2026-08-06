'use client';
import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION } from '@/lib/motion';

// Image / frame reveal: a transform-based mask driven by variants. The OUTER
// frame is the whileInView trigger and never moves, so it stays in view and
// fires reliably even for tall elements. The INNER element carries the moving
// content, which rises into the frame from below (translateY 100% to 0), a
// bottom-to-top wipe with no scale and no fade. Triggering from the stable
// outer frame (rather than the translated inner) is what makes this reliable:
// translating a large element by 100% would push it out of view and its own
// whileInView would never fire. Reduced motion shows the content immediately.
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
    <m.div className={className} style={{ overflow: 'hidden' }}
      initial="hidden" whileInView="shown" viewport={MOTION.viewport}>
      <m.div variants={{ hidden: { y: '100%' }, shown: { y: '0%' } }}
        transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay }}>
        {children}
      </m.div>
    </m.div>
  );
}
