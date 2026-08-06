'use client';
import { m, useReducedMotion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { MOTION } from '@/lib/motion';

function computeLines(measure: HTMLElement, text: string): string[] {
  const words = text.split(' ');
  measure.textContent = '';
  const spans = words.map((w, i) => {
    const s = document.createElement('span');
    s.textContent = i < words.length - 1 ? w + ' ' : w;
    measure.appendChild(s);
    return s;
  });
  const lines: string[] = [];
  let top: number | null = null;
  let cur: string[] = [];
  spans.forEach((s, i) => {
    const t = s.offsetTop;
    if (top === null) top = t;
    if (t !== top) { lines.push(cur.join(' ')); cur = []; top = t; }
    cur.push(words[i]);
  });
  if (cur.length) lines.push(cur.join(' '));
  measure.textContent = '';
  return lines.length ? lines : [text];
}

export function LineReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const lastW = useRef(-1);
  const [lines, setLines] = useState<string[] | null>(null);
  const inView = useInView(wrapRef, { once: true, amount: MOTION.viewport.amount });
  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const measure = measureRef.current;
    if (!wrap || !measure) return;
    const recompute = () => {
      const w = wrap.clientWidth;
      if (w === lastW.current) return;
      lastW.current = w;
      measure.style.width = w + 'px';
      setLines(computeLines(measure, text));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [text, reduced]);

  if (reduced) {
    return (
      <m.span className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={MOTION.viewport} transition={{ duration: MOTION.reducedMs }}>{text}</m.span>
    );
  }
  return (
    <span ref={wrapRef} className={className} aria-label={text} style={{ display: 'block' }}>
      <span ref={measureRef} aria-hidden
        style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'normal', left: 0, top: 0 }} />
      {lines === null ? (
        <span aria-hidden>{text}</span>
      ) : (
        lines.map((line, i) => (
          <span key={line + i} aria-hidden style={{ display: 'block', overflow: 'hidden' }}>
            <m.span style={{ display: 'block' }} initial={{ y: '100%' }}
              animate={inView ? { y: '0%' } : { y: '100%' }}
              transition={{ duration: MOTION.duration.base, ease: MOTION.ease, delay: delay + i * MOTION.stagger }}>
              {line}
            </m.span>
          </span>
        ))
      )}
    </span>
  );
}
