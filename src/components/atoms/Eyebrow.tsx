import type { ReactNode } from 'react';

// Eyebrow label (Section 4.2): Inter Tight Medium, uppercase, wide tracking.
// Cedar is the one accent, capped at four per screen, so it defaults to the
// quiet tertiary and opts into cedar only where a highlight is earned. On ink
// it uses inverse since tertiary would fail contrast there.

export function Eyebrow({
  children,
  tone = 'quiet',
  className = '',
}: {
  children: ReactNode;
  tone?: 'quiet' | 'cedar' | 'inverse';
  className?: string;
}) {
  const color =
    tone === 'cedar'
      ? 'text-cedar'
      : tone === 'inverse'
        ? 'text-inverse/70'
        : 'text-tertiary';
  return (
    <p
      className={`font-sans font-medium text-eyebrow-m md:text-eyebrow uppercase ${color} ${className}`}
    >
      {children}
    </p>
  );
}
