'use client';
import { m, useReducedMotion } from 'framer-motion';
import { MOTION } from '@/lib/motion';

// Headline reveal: a transform-based mask. The text sits in an overflow-hidden
// frame and rolls up from below (translateY 110% to 0). Transform reveals fire
// reliably here from first paint (unlike clip-path, which was flaky under
// LazyMotion and left headlines invisible). The text is always in the DOM
// (LCP-safe, screen-reader and SEO readable). This is a whole-headline roll-up
// rather than a per-line stagger, chosen for reliability. Reduced motion shows
// the text immediately with opacity only.
export function LineReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <span className={className} style={{ display: 'block' }}>
        <m.span style={{ display: 'block' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>
          {text}
        </m.span>
      </span>
    );
  }
  return (
    <span className={className} style={{ display: 'block', overflow: 'hidden' }}>
      <m.span style={{ display: 'block' }} initial={{ y: '110%' }} whileInView={{ y: '0%' }}
        viewport={MOTION.viewport}
        transition={{ duration: MOTION.duration.base, ease: MOTION.ease, delay }}>
        {text}
      </m.span>
    </span>
  );
}
