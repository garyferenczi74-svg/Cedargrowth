'use client';
import { useReducedMotion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MOTION } from '@/lib/motion';

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

export function Resolve({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: MOTION.viewport.amount });
  const [display, setDisplay] = useState(reduced ? text : text.replace(/[^ ]/g, ' '));
  useEffect(() => {
    if (reduced || !inView) { if (reduced) setDisplay(text); return; }
    let raf = 0; const durMs = MOTION.duration.fast * 1000; let startT = 0;
    const step = (t: number) => {
      if (!startT) startT = t + delay * 1000;
      const p = Math.min(Math.max((t - startT) / durMs, 0), 1);
      const locked = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') out += ' ';
        else if (i < locked) out += text[i];
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(step); else setDisplay(text);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, text, delay]);
  return <span ref={ref} className={className} aria-label={text}>{display}</span>;
}
