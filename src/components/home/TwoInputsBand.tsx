import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { home } from '@/content/home';

// Home Section A, the two inputs band (Section 6.1 spec addendum). Sits
// between the five lines and the five absences, stepping the surface from
// parchment to ink. Left column, columns 1-5, carries the eyebrow, headline,
// body, and ghost link. Right column, columns 7-12, carries two comparison
// entries as hairline-separated rows, never cards: no border box, no fill,
// no shadow around either entry.

export function TwoInputsBand() {
  return (
    <section className="bg-bone py-16 md:py-40">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-0">
          <div className="reveal flex flex-col items-start gap-6 md:col-span-5">
            <Eyebrow>{home.twoInputs.eyebrow}</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              {home.twoInputs.headline}
            </h2>
            <p className="max-w-editorial text-body-m-m md:text-body-l text-secondary">
              {home.twoInputs.body}
            </p>
            <ButtonLink href="/method" variant="ghost">
              {home.twoInputs.cta}
            </ButtonLink>
          </div>
          <div className="reveal flex flex-col md:col-start-7 md:col-span-6">
            {home.twoInputs.entries.map((entry, index) => (
              <div
                key={entry.heading}
                className={`flex flex-col gap-3 py-8 first:pt-0 last:pb-0 ${
                  index > 0 ? 'border-t border-hairline' : ''
                }`}
              >
                <h3 className="font-display text-heading-s-m md:text-heading-s text-primary">
                  {entry.heading}
                </h3>
                <p className="text-body-m-m md:text-body-m text-secondary">
                  {entry.body}
                </p>
                <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                  {entry.specimen}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
