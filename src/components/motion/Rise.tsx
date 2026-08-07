'use client';
import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '@/lib/reveal';

// Additive: renders visible by default; the cg-rise CSS animation plays once
// when the element is revealed. If it never reveals, content stays visible.
export function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const style = { '--cg-delay': `${Math.round(delay * 1000)}ms` } as CSSProperties;
  return (
    <div ref={ref} className={`cg-rise${revealed ? ' cg-in' : ''}${className ? ' ' + className : ''}`} style={style}>
      {children}
    </div>
  );
}
