import type { ImageFamily } from '@/lib/nav';

// Every image in the references is a marked placeholder. We keep them marked,
// with the family named, and never substitute stock or generate imagery. This
// is a labeled empty frame, a hairline box with the family in mono.

export function Placeholder({
  family,
  alt,
  className = '',
}: {
  family: ImageFamily;
  alt: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-end border border-hairline bg-bone ${className}`}
    >
      <span className="p-3 font-mono text-specimen uppercase tracking-specimen text-tertiary">
        Placeholder, {family}
      </span>
    </div>
  );
}
