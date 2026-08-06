'use client';
import { m, useReducedMotion } from 'framer-motion';
import { MOTION } from '@/lib/motion';

// Headline reveal: a transform-based mask driven by variants. The OUTER span is
// the whileInView trigger and never moves, so it stays in view and fires
// reliably; the INNER span rolls the headline up from below (translateY 110% to
// 0) inside the overflow-hidden frame. Triggering from the stable outer element
// (not the translated inner) makes this reliable regardless of headline size.
// The text is always in the DOM (LCP-safe, screen-reader and SEO readable).
// This is a whole-headline roll-up, not a per-line stagger, chosen for
// reliability after clip-path and per-line masks proved flaky under LazyMotion.
// Reduced motion shows the text immediately with opacity only.
export function LineReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <m.span className={className} style={{ display: 'block' }} initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }} viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>
        {text}
      </m.span>
    );
  }
  return (
    <m.span className={className} style={{ display: 'block', overflow: 'hidden' }}
      initial="hidden" whileInView="shown" viewport={MOTION.viewport}>
      <m.span style={{ display: 'block' }} variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }}
        transition={{ duration: MOTION.duration.base, ease: MOTION.ease, delay }}>
        {text}
      </m.span>
    </m.span>
  );
}
