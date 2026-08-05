'use client';
import { m, useReducedMotion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { MOTION } from '@/lib/motion';

export function Counter({ to, from, mode, pad = 2, delay = 0, className }:
  { to: number; from?: number; mode: 'countUp' | 'countDown'; pad?: number; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const start = from ?? (mode === 'countDown' ? Math.max(to, 12) : 0);
  const mv = useMotionValue(start);
  const text = useTransform(mv, (v) => String(Math.round(v)).padStart(pad, '0'));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: MOTION.viewport.amount });
  useEffect(() => {
    if (reduced) { mv.set(to); return; }
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: MOTION.duration.settle,
      delay,
      ease: [0.16, 0.84, 0.24, 1], // slower final third, no overshoot
    });
    return controls.stop;
  }, [inView, reduced, to, delay, mv]);
  return <m.span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>{reduced ? String(to).padStart(pad, '0') : text}</m.span>;
}
