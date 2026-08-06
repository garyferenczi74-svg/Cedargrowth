import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Rise } from '@/components/motion/Rise';
import { RuleDraw } from '@/components/motion/RuleDraw';
import { LineReveal } from '@/components/motion/LineReveal';
import { Resolve } from '@/components/motion/Resolve';
import { MOTION } from '@/lib/motion';
import { home } from '@/content/home';

// Home Section A, the two inputs band (Section 6.1 spec addendum). Sits
// between the five lines (bone) and the five absences (ink), on parchment so
// no two adjacent sections share a surface. Left column, columns 1-5, carries
// the eyebrow, headline,
// body, and ghost link. Right column, columns 7-12, carries two comparison
// entries as hairline-separated rows, never cards: no border box, no fill,
// no shadow around either entry.

// Motion (CG Prompt 06, Task 14): the headline runs LineReveal. The two
// entries reveal 160ms apart (cured first, fresh frozen 0.16s behind, so the
// cured entry has already completed before the fresh frozen entry begins).
// Only the fresh frozen entry carries a visible hairline (the cured entry
// never had one, matching the doc comment above: "hairline-separated rows",
// one shared divider between the two, not a border around each). Within
// each entry the divider (where present) draws first, the heading and body
// rise together next, and the monospace specimen line resolves last. This
// is the only place on the home page that uses Resolve, and it is used
// exactly twice (the two INPUT specimen lines), the maximum allowed on this
// screen.

export function TwoInputsBand() {
  return (
    <section className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-0">
          <div className="flex flex-col items-start gap-6 md:col-span-5">
            <Eyebrow>{home.twoInputs.eyebrow}</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              <LineReveal text={home.twoInputs.headline} />
            </h2>
            <p className="max-w-editorial text-body-m-m md:text-body-l text-secondary">
              {home.twoInputs.body}
            </p>
            <ButtonLink href="/method" variant="ghost">
              {home.twoInputs.cta}
            </ButtonLink>
          </div>
          <div className="flex flex-col md:col-start-7 md:col-span-6">
            {home.twoInputs.entries.map((entry, index) => {
              const baseDelay = index * 0.16;
              const riseDelay = baseDelay + MOTION.stagger;
              const resolveDelay = riseDelay + MOTION.stagger;
              return (
                <div
                  key={entry.heading}
                  className="flex flex-col gap-3 py-8 first:pt-0 last:pb-0"
                >
                  {index > 0 ? (
                    <RuleDraw delay={baseDelay} className="h-px w-full bg-hairline" />
                  ) : null}
                  <Rise delay={riseDelay} className="flex flex-col gap-3">
                    <h3 className="font-display text-heading-s-m md:text-heading-s text-primary">
                      {entry.heading}
                    </h3>
                    <p className="text-body-m-m md:text-body-m text-secondary">
                      {entry.body}
                    </p>
                  </Rise>
                  <Resolve
                    text={entry.specimen}
                    delay={resolveDelay}
                    className="block font-mono text-specimen uppercase tracking-specimen text-tertiary"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
