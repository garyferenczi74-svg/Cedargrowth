'use client';
import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '@/lib/reveal';

// Additive image / frame reveal: renders visible by default; an opacity plus
// rise (no scale, per spec) plays once when revealed over the slow duration. If
// it never reveals, the frame stays visible. This replaced the clip/transform
// mask, which stranded tall frames hidden under framer whileInView.
export function FrameWipe({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const style = { '--cg-delay': `${Math.round(delay * 1000)}ms`, '--cg-dur': '720ms' } as CSSProperties;
  return (
    <div ref={ref} className={`cg-rise${revealed ? ' cg-in' : ''}${className ? ' ' + className : ''}`} style={style}>
      {children}
    </div>
  );
}
