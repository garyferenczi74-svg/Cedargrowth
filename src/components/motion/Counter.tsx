'use client';
import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/lib/reveal';
import { MOTION } from '@/lib/motion';

// Additive counter: renders its FINAL value (the target, e.g. 00) by default, so
// if it never reveals it shows the correct resting value, never a stranded
// ceiling. When revealed it counts from `from` to `to` with an ease-out that
// settles slower in the final third. Tabular numerals at fixed width, zero CLS.
export function Counter({ to, from, mode, pad = 2, delay = 0, className }:
  { to: number; from?: number; mode: 'countUp' | 'countDown'; pad?: number; delay?: number; className?: string }) {
  const start = from ?? (mode === 'countDown' ? Math.max(to, 12) : 0);
  const { ref, revealed } = useReveal<HTMLSpanElement>();
  const [val, setVal] = useState(to);
  const raf = useRef(0);
  useEffect(() => {
    if (!revealed) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to);
      return;
    }
    const durMs = MOTION.duration.settle * 1000;
    const delayMs = delay * 1000;
    let startT = 0;
    const ease = (p: number) => 1 - Math.pow(1 - p, 3);
    const step = (t: number) => {
      if (!startT) startT = t + delayMs;
      const p = Math.min(Math.max((t - startT) / durMs, 0), 1);
      setVal(Math.round(start + (to - start) * ease(p)));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setVal(to);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [revealed, to, start, delay]);
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {String(val).padStart(pad, '0')}
    </span>
  );
}
