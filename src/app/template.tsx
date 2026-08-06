'use client';

import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { MOTION } from '@/lib/motion';

// Route level crossfade (Section 4.5, interaction motion). Shell (header,
// footer) lives in layout.tsx, outside this file, so it never moves or
// remounts on navigation. Only the content column fades in, opacity only,
// no position or layout change. LazyMotion features are already provided by
// MotionProvider higher in the tree.

export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: MOTION.reducedMs }}>
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: MOTION.duration.fast, ease: MOTION.ease }}
    >
      {children}
    </m.div>
  );
}
