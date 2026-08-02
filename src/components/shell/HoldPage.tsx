import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';

// Shared shell for a route that is real (full site chrome, a real URL) but
// not built yet. It says so plainly and offers one useful action instead of
// a placeholder screen. Every hold route renders this with its own copy, so
// tone rails (no "coming soon", no exclamation marks, no apology) live with
// the callers; this component only lays the section out.

export function holdPageMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export function HoldPage({
  eyebrow,
  headline,
  body,
  capture,
  onward,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  capture?: React.ReactNode;
  onward?: { label: string; href: string }[];
}) {
  return (
    <section className="bg-parchment py-16 md:py-40">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex max-w-editorial flex-col gap-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            {headline}
          </h1>
          <p className="text-body-m-m md:text-body-l text-secondary">
            {body}
          </p>
          {capture ? <div>{capture}</div> : null}
          {onward && onward.length > 0 ? (
            <div className="flex flex-wrap gap-8">
              {onward.map((link) => (
                <ButtonLink key={link.href} href={link.href} variant="ghost">
                  {link.label}
                </ButtonLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
