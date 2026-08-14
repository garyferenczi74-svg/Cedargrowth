import type { Metadata } from 'next';
import { Placeholder } from '@/components/shell/Placeholder';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { LineReveal } from '@/components/motion/LineReveal';
import { FrameWipe } from '@/components/motion/FrameWipe';
import { LINES, PIGMENT_MARK } from '@/lib/lines';

export const metadata: Metadata = {
  title: 'Wellness',
  description:
    'Five lines, each formulated around an intended state rather than a strain name: Rest, Relief, Focus, Calm, and Restore.',
};

// The Wellness index (CG Prompt 11A). Five full-width alternating rows, each one
// entry (not a card, not a grid cell): a pigment marker, a specimen plate, the
// line name, its descriptor, and a mono block of anchor and formats. Every
// descriptor states what a line was formulated around and nothing implies an
// outcome, effect, or benefit. Rows link to their line page, which is a real
// route. The FAQ deliberately does not appear here; it lives in the footer.
export default function WellnessPage() {
  return (
    <>
      <section className="bg-parchment py-16 md:py-32">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="flex max-w-editorial flex-col gap-6">
            <Eyebrow>The five lines</Eyebrow>
            <LineReveal
              text="Formulated by intention."
              className="font-display text-display-l-m md:text-display-xl text-primary"
            />
            <p className="text-body-m-m md:text-body-l text-secondary">
              Every line begins with an intended state rather than a strain
              name. What follows is what each was formulated around, the
              terpenes that anchor it, and the formats it comes in.
            </p>
          </div>
        </div>
      </section>

      {LINES.map((line, i) => {
        const imageFirst = i % 2 === 0;
        const tone = imageFirst ? 'bg-parchment' : 'bg-bone';
        return (
          <section key={line.key} className={tone}>
            <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-page-margin-mobile py-16 md:grid-cols-2 md:gap-16 md:px-page-margin md:py-24">
              <FrameWipe
                className={imageFirst ? 'md:order-1' : 'md:order-2'}
              >
                <Placeholder
                  family="specimen plate"
                  alt={`Placeholder, specimen plate for the ${line.name} line`}
                  className="aspect-[4/3]"
                />
              </FrameWipe>
              <div
                className={`flex flex-col items-start gap-5 ${imageFirst ? 'md:order-2' : 'md:order-1'}`}
              >
                <div
                  className={`h-[3px] w-10 ${PIGMENT_MARK[line.pigment]}`}
                  aria-hidden="true"
                />
                <h2 className="font-display text-heading-m-m md:text-display-l text-primary">
                  {line.name}
                </h2>
                <p className="text-body-l-m md:text-body-l text-secondary">
                  {line.descriptor}
                </p>
                <dl className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-3">
                    <dt className="min-w-[5rem] font-mono text-specimen uppercase tracking-specimen text-tertiary">
                      Anchor
                    </dt>
                    <dd className="font-mono text-data uppercase tracking-specimen text-primary">
                      {line.anchor}
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <dt className="min-w-[5rem] font-mono text-specimen uppercase tracking-specimen text-tertiary">
                      Formats
                    </dt>
                    <dd
                      className={`font-mono text-data uppercase tracking-specimen ${line.formats ? 'text-primary' : 'text-tertiary'}`}
                    >
                      {line.formats ?? 'UNKNOWN'}
                    </dd>
                  </div>
                </dl>
                <ButtonLink href={line.href} variant="ghost">
                  View the line
                </ButtonLink>
              </div>
            </div>
          </section>
        );
      })}

      {/* Closing block, not a nav replacement. Two research pillars appear here
          with the reason a reader would want them. The FAQ is intentionally not
          here; it lives in the footer. */}
      <section className="bg-ink py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="flex max-w-editorial flex-col gap-6">
            <Eyebrow tone="inverse">Understand</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-inverse">
              What sits behind the lines.
            </h2>
            <p className="text-body-m-m md:text-body-l text-inverse/80">
              Each line is anchored to terpenes with measurable properties,
              working through a receptor system that behaves differently in
              different people. Both are documented.
            </p>
            <div className="flex flex-col gap-3">
              <ButtonLink href="/research/terpenes" variant="ghost" tone="inverse">
                The terpene index
              </ButtonLink>
              <ButtonLink href="/research/ecs" variant="ghost" tone="inverse">
                The endocannabinoid system
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
