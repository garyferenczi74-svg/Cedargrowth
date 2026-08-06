'use client';
import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION } from '@/lib/motion';

// Image / frame reveal. Transform and clip-path masks that hide the frame
// initially proved unreliable for tall frames under LazyMotion: their
// whileInView reveal never fired and the frame stayed stuck hidden (the hero
// video and the team portraits both got stranded). This uses the proven
// opacity plus rise reveal, which fires reliably at every element size and can
// never leave a frame invisible. There is no scale on the image, per spec.
// Reduced motion shows the frame immediately with opacity only.
export function FrameWipe({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <m.div className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>
        {children}
      </m.div>
    );
  }
  return (
    <m.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={MOTION.viewport} transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay }}>
      {children}
    </m.div>
  );
}
