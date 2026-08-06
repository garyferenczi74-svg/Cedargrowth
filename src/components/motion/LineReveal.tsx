'use client';
import { m, useReducedMotion } from 'framer-motion';
import { MOTION } from '@/lib/motion';

// Headline reveal. The per-line masked roll-up (split into lines, each line
// translated from behind an overflow-hidden mask) proved unreliable in
// production: the animated spans mount after a client-side line split, and
// their whileInView / useInView reveal never fired under LazyMotion, leaving
// headlines invisible. This uses the same clip-path wipe pattern as FrameWipe,
// which reveals reliably because it mounts from first paint. The text stays in
// the DOM at all times (LCP-safe, fully readable to screen readers and search),
// and reveals bottom to top over the base duration. Reduced motion shows the
// text immediately with opacity only.
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
    <m.span className={className} style={{ display: 'block' }}
      initial={{ clipPath: 'inset(100% 0 0 0)', y: 8 }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)', y: 0 }}
      viewport={MOTION.viewport}
      transition={{ duration: MOTION.duration.base, ease: MOTION.ease, delay }}>
      {text}
    </m.span>
  );
}
