import type { ReactNode } from 'react';

// Renders an absent value honestly. Never a placeholder number, never a zero,
// never an invented citation. The literal UNKNOWN is set in mono, with a
// caption saying why the value is missing. The data layer reuses this.
//
// tone switches the palette so it stays AA on either a light or an ink surface.

export function Unknown({
  label,
  caption,
  tone = 'light',
}: {
  label?: ReactNode;
  caption: string;
  tone?: 'light' | 'inverse';
}) {
  const value = tone === 'inverse' ? 'text-inverse' : 'text-secondary';
  const muted = tone === 'inverse' ? 'text-inverse/70' : 'text-tertiary';

  return (
    <span className="inline-flex flex-col gap-1">
      <span className="flex items-baseline gap-2">
        {label ? (
          <span
            className={`font-mono text-specimen uppercase tracking-specimen ${muted}`}
          >
            {label}
          </span>
        ) : null}
        <span
          className={`font-mono text-data uppercase tracking-specimen ${value}`}
        >
          UNKNOWN
        </span>
      </span>
      <span className={`text-caption-m md:text-caption ${muted}`}>{caption}</span>
    </span>
  );
}
