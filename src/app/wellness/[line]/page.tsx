import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Placeholder } from '@/components/shell/Placeholder';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { LINES, PIGMENT_MARK } from '@/lib/lines';
import { WELLNESS_CONTENT } from '@/lib/wellness';

type Params = { params: { line: string } };

export function generateStaticParams() {
  return LINES.map((line) => ({ line: line.key }));
}

export function generateMetadata({ params }: Params): Metadata {
  const line = LINES.find((l) => l.key === params.line);
  if (!line) return {};
  return {
    title: line.name,
    description: `${line.name}. ${line.descriptor} A solventless line anchored by ${line.anchor.toLowerCase()}.`,
  };
}

export default function LinePage({ params }: Params) {
  const line = LINES.find((l) => l.key === params.line);
  const content = WELLNESS_CONTENT[params.line];
  if (!line || !content) notFound();

  return (
    <>
      {/* 1. Hero split */}
      <section className="bg-parchment">
        <div className="mx-auto grid max-w-content grid-cols-1 items-stretch gap-0 md:grid-cols-2">
          <Placeholder
            family="raw material macro"
            alt={content.botanicalAlt}
            className="settle min-h-[40vh] md:min-h-[70vh]"
            label
          />
          <div className="flex flex-col items-start justify-center gap-6 px-page-margin-mobile py-16 md:px-page-margin md:py-24">
            <div
              className={`h-[3px] w-10 ${PIGMENT_MARK[line.pigment]}`}
              aria-hidden="true"
            />
            <Eyebrow>Wellness line</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              {line.name}
            </h1>
            <p className="text-body-l-m md:text-body-l text-secondary">
              {line.descriptor}
            </p>
          </div>
        </div>
      </section>

      {/* 2. The intent */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
            <Eyebrow className="md:col-span-4">The intent</Eyebrow>
            <div className="flex max-w-editorial flex-col gap-6 md:col-span-8">
              {content.intent.map((p, i) => (
                <p
                  key={i}
                  className="text-body-m-m md:text-body-l text-secondary"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Terpene profile */}
      <section className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-10">Terpene profile</Eyebrow>
          <ul className="reveal grid grid-cols-1 gap-10 border-t border-hairline pt-10 md:grid-cols-2 md:gap-16">
            {content.terpenes.map((t) => (
              <li key={t.name} className="flex flex-col gap-4">
                <Placeholder
                  family="thin line diagram"
                  alt={`Placeholder, thin line diagram of the ${t.name} structure`}
                  className="aspect-[3/2]"
                />
                <div>
                  <h3 className="font-mono text-data text-primary">{t.name}</h3>
                  <p className="mt-1 text-body-m-m md:text-body-m text-secondary">
                    {t.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Genetic traits */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>Genetic selection</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              The traits that select into {line.name}.
            </h2>
            <p className="text-body-m-m md:text-body-l text-secondary">
              Which of the thirteen traits point toward this line is set by your
              Cannabis DNA Test. The trait mapping opens with the test and is not
              published here yet.
            </p>
            <ButtonLink href="/dna/traits" variant="ghost">
              See the thirteen traits
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 5. Formats in this line */}
      <section className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex flex-col gap-6">
            <Eyebrow>Formats</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              Formats in this line.
            </h2>
            <div className="border-t border-hairline py-8">
              <p className="text-body-m-m md:text-body-m text-tertiary">
                The formats carried in the {line.name} line are being confirmed.
                The full catalog is grouped by format on the products page.
              </p>
            </div>
            <ButtonLink href="/products" variant="ghost">
              See all products
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 6. Related research */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex flex-col gap-6">
            <Eyebrow>Research</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              Related notes.
            </h2>
            <div className="border-t border-hairline py-8">
              <p className="text-body-m-m md:text-body-m text-tertiary">
                No research notes are published for this line yet. The index
                opens with the terpene and endocannabinoid pillars.
              </p>
            </div>
            <ButtonLink href="/research" variant="ghost">
              Read the research
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
