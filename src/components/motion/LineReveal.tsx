'use client';
import { m, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MOTION } from '@/lib/motion';

function splitIntoLines(el: HTMLElement, text: string): string[] {
  const words = text.split(' ');
  el.textContent = '';
  const spans = words.map((w, i) => {
    const s = document.createElement('span');
    s.textContent = i < words.length - 1 ? w + ' ' : w;
    el.appendChild(s);
    return s;
  });
  const lines: string[] = [];
  let top: number | null = null;
  let current = '';
  spans.forEach((s, i) => {
    const t = s.offsetTop;
    if (top === null) top = t;
    if (t !== top) { lines.push(current.trim()); current = ''; top = t; }
    current += words[i] + ' ';
  });
  if (current.trim()) lines.push(current.trim());
  return lines;
}

export function LineReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const measureRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[]>([text]);
  useEffect(() => {
    if (reduced || !measureRef.current) return;
    const el = measureRef.current;
    const recompute = () => setLines(splitIntoLines(el, text));
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, reduced]);
  if (reduced) {
    return <m.span className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>{text}</m.span>;
  }
  return (
    <span className={className} aria-label={text}>
      <span ref={measureRef} aria-hidden style={{ position: 'absolute', visibility: 'hidden', width: '100%' }} />
      {lines.map((line, i) => (
        <span key={i} aria-hidden style={{ display: 'block', overflow: 'hidden' }}>
          <m.span style={{ display: 'block' }} initial={{ y: '100%' }} whileInView={{ y: '0%' }}
            viewport={MOTION.viewport}
            transition={{ duration: MOTION.duration.base, ease: MOTION.ease, delay: delay + i * MOTION.stagger }}>
            {line}
          </m.span>
        </span>
      ))}
    </span>
  );
}
