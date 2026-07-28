import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Buttons are outlined rectangles with a label and a thin right arrow, or full
// width solid rectangles in near black (Section 3). Square corners, no shadow.
// Ghost is a plain label with the arrow and the underline draw on hover.

type Variant = 'outline' | 'solid' | 'ghost';
type Tone = 'light' | 'inverse';

export function ButtonLink({
  href,
  children,
  variant = 'outline',
  tone = 'light',
  className = '',
}: {
  href: string;
  children: string;
  variant?: Variant;
  tone?: Tone;
  className?: string;
}) {
  const base =
    'group inline-flex items-center gap-3 text-caption uppercase tracking-eyebrow transition-colors duration-hover ease-cedar focus-visible:outline-cedar';

  let variantClasses = '';
  if (variant === 'solid') {
    variantClasses =
      tone === 'inverse'
        ? 'bg-parchment text-primary px-6 py-4'
        : 'bg-ink text-inverse px-6 py-4';
  } else if (variant === 'outline') {
    variantClasses =
      tone === 'inverse'
        ? 'border border-hairline-inverse text-inverse px-6 py-4 hover:border-inverse'
        : 'border border-hairline text-primary px-6 py-4 hover:border-primary';
  } else {
    // ghost
    variantClasses =
      tone === 'inverse'
        ? 'cedar-underline text-inverse'
        : 'cedar-underline text-primary';
  }

  return (
    <Link href={href} className={`${base} ${variantClasses} ${className}`}>
      {children}
      <ArrowRight
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className="transition-transform duration-hover ease-cedar group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      />
    </Link>
  );
}
