import type { Metadata } from 'next';
import Link from 'next/link';
import { Placeholder } from '@/components/shell/Placeholder';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { LINES, PIGMENT_MARK } from '@/lib/lines';

export const metadata: Metadata = {
  title: 'Wellness',
  description:
    'Five lines, each formulated for an intended state. Rest, Relief, Focus, Calm, and Restore.',
};

export default function WellnessPage() {
  return (
    <>
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>The five lines</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              An intended state, not a strain name.
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              Every formulation begins with an outcome. Five lines, each built
              from the same solventless standard and separated by terpene profile
              and ratio.
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
              <Placeholder
                family="raw material macro"
                alt={`Placeholder, raw material macro for the ${line.name} line`}
                className={`reveal aspect-[4/3] ${imageFirst ? 'md:order-1' : 'md:order-2'}`}
              />
              <div
                className={`reveal flex flex-col items-start gap-5 ${imageFirst ? 'md:order-2' : 'md:order-1'}`}
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
                <dl className="flex flex-col gap-1">
                  <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                    Terpene anchor
                  </dt>
                  <dd className="font-mono text-data text-primary">
                    {line.anchor}
                  </dd>
                </dl>
                <p className="text-caption-m md:text-caption text-tertiary">
                  Formats in this line are being confirmed.
                </p>
                <ButtonLink href={line.href} variant="ghost">
                  View the line
                </ButtonLink>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
