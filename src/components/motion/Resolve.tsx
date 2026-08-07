'use client';
import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/lib/reveal';
import { MOTION } from '@/lib/motion';

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

// Additive specimen resolve: renders the FINAL string by default (never blank),
// so if it never reveals the readout still shows its value. When revealed it
// resolves characters left to right from a randomized set, one pass, no loop.
// The wrapper carries aria-label so the accessible name is always the final
// string. Reduced motion shows the final string with no cycling.
export function Resolve({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const { ref, revealed } = useReveal<HTMLSpanElement>();
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);
  useEffect(() => {
    if (!revealed) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    const durMs = MOTION.duration.fast * 1000;
    const delayMs = delay * 1000;
    let startT = 0;
    const step = (t: number) => {
      if (!startT) startT = t + delayMs;
      const p = Math.min(Math.max((t - startT) / durMs, 0), 1);
      const locked = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') out += ' ';
        else if (i < locked) out += text[i];
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setDisplay(text);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [revealed, text, delay]);
  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  );
}
