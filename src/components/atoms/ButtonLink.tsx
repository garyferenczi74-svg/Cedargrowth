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
    'group inline-flex items-center gap-3 text-caption uppercase tracking-eyebrow focus-visible:outline-cedar';

  let variantClasses = '';
  if (variant === 'ghost') {
    // Ghost stays a plain label with the arrow and the underline draw on hover;
    // it is a link, not a rectangle, so it keeps its own treatment.
    variantClasses = tone === 'inverse' ? 'cedar-underline text-inverse' : 'cedar-underline text-primary';
  } else {
    // Outline and solid both adopt the highlight button: a bone rectangle that
    // floods to near black with bone type and lifts on hover. The tone no longer
    // splits the color, since the highlight reads on both grounds.
    variantClasses = 'cg-btn';
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
