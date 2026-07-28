import type { ImageFamily } from '@/lib/nav';

// Every image in the references is a marked placeholder. We keep them marked,
// with the family named, and never substitute stock or generate imagery. This
// is a labeled empty frame. tone ink is for hero and dark surfaces so overlaid
// inverse type stays legible until a real image lands.

export function Placeholder({
  family,
  alt,
  tone = 'bone',
  label = true,
  bordered = true,
  className = '',
}: {
  family: ImageFamily | 'map still';
  alt: string;
  tone?: 'bone' | 'ink';
  label?: boolean;
  bordered?: boolean;
  className?: string;
}) {
  const surface = tone === 'ink' ? 'bg-ink' : 'bg-bone';
  const edge = bordered
    ? tone === 'ink'
      ? 'border border-hairline-inverse'
      : 'border border-hairline'
    : '';
  const marker = tone === 'ink' ? 'text-inverse/60' : 'text-tertiary';

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-end ${surface} ${edge} ${className}`}
    >
      {label ? (
        <span
          className={`p-3 font-mono text-specimen uppercase tracking-specimen ${marker}`}
        >
          Placeholder, {family}
        </span>
      ) : null}
    </div>
  );
}
