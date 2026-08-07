'use client';
import type { CSSProperties } from 'react';
import { useReveal } from '@/lib/reveal';

// Additive headline reveal: a whole-headline roll-up. The text sits in an
// overflow-hidden frame and rolls up from below (translateY 110% to 0) when
// revealed. It renders visible (rolled into place) by default, so if it never
// reveals the headline is still shown, and the text is always in the DOM
// (LCP-safe, screen-reader and SEO readable). Whole-headline roll-up rather
// than per-line stagger, chosen for reliability.
export function LineReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const { ref, revealed } = useReveal<HTMLSpanElement>();
  const style = { display: 'block', overflow: 'hidden', '--cg-delay': `${Math.round(delay * 1000)}ms` } as CSSProperties;
  return (
    <span ref={ref} className={`cg-rollup${revealed ? ' cg-in' : ''}${className ? ' ' + className : ''}`} style={style}>
      <span style={{ display: 'block' }}>{text}</span>
    </span>
  );
}
