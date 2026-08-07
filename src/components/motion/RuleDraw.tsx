'use client';
import type { CSSProperties } from 'react';
import { useReveal } from '@/lib/reveal';

// Additive hairline: renders drawn (full) by default; the scaleX/scaleY draw
// animation plays once when revealed. If it never reveals, the rule stays drawn.
export function RuleDraw({ axis = 'x', delay = 0, duration, className }:
  { axis?: 'x' | 'y'; delay?: number; duration?: number; className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const base = axis === 'x' ? 'cg-drawx' : 'cg-drawy';
  const style = { '--cg-delay': `${Math.round(delay * 1000)}ms` } as CSSProperties;
  if (duration) (style as Record<string, string>)['--cg-dur'] = `${Math.round(duration * 1000)}ms`;
  return <div ref={ref} className={`${base}${revealed ? ' cg-in' : ''}${className ? ' ' + className : ''}`} style={style} />;
}
