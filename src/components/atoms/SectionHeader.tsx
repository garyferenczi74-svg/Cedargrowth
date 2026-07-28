import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

// Eyebrow, headline, and one line (molecule from Section 4.4). Headline in the
// editorial face, sentence case with a full stop per the house voice.

export function SectionHeader({
  eyebrow,
  headline,
  sub,
  as = 'h2',
  align = 'center',
  tone = 'light',
  className = '',
}: {
  eyebrow?: string;
  headline: ReactNode;
  sub?: ReactNode;
  as?: 'h1' | 'h2';
  align?: 'center' | 'left';
  tone?: 'light' | 'inverse';
  className?: string;
}) {
  const Heading = as;
  const headText = tone === 'inverse' ? 'text-inverse' : 'text-primary';
  const subText = tone === 'inverse' ? 'text-inverse/70' : 'text-secondary';
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? (
        <Eyebrow tone={tone === 'inverse' ? 'inverse' : 'quiet'}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Heading
        className={`font-display text-heading-m-m md:text-heading-m ${headText}`}
      >
        {headline}
      </Heading>
      {sub ? (
        <p
          className={`max-w-editorial text-body-m-m md:text-body-l ${subText}`}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}
