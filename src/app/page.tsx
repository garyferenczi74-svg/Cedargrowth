import Link from 'next/link';
import { Placeholder } from '@/components/shell/Placeholder';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { BatchTeaser } from '@/components/home/BatchTeaser';
import { LINES, ABSENCES, PIGMENT_MARK } from '@/lib/lines';

export default function HomePage() {
  return (
    <>
      {/* Block 1, hero */}
      <section className="relative flex min-h-[82vh] flex-col justify-end overflow-hidden bg-ink">
        <Placeholder
          family="raw material macro"
          alt="Placeholder, raw material macro of cured trim under raking light"
          tone="ink"
          label={false}
          bordered={false}
          className="settle absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/20" aria-hidden="true" />
        <span className="pointer-events-none absolute left-page-margin-mobile top-6 font-mono text-specimen uppercase tracking-specimen text-inverse/40 md:left-page-margin">
          Placeholder, raw material macro
        </span>
        <div className="relative mx-auto w-full max-w-content px-page-margin-mobile pb-16 md:px-page-margin md:pb-24">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow tone="inverse">A study in subtraction</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-inverse">
              Premium Fresh Frozen.
              <br />
              Ice. Pressure.
              <br />
              Nothing else.
            </h1>
            <p className="text-body-m-m md:text-body-l text-inverse/70">
              CedarGrowth produces solventless live rosin in Buffalo, New York,
              formulated for outcome rather than potency.
            </p>
            <div>
              <ButtonLink href="/method" variant="outline" tone="inverse">
                Read the method
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Block 2, position statement */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <SectionHeader
            className="reveal mx-auto"
            eyebrow="Position"
            headline="A wellness company that produces cannabis."
            sub="Every formulation begins with an intended state, not a strain name. Five lines, eight products, one extraction standard."
          />
        </div>
      </section>

      {/* Block 3, the five lines */}
      <section className="bg-bone py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-10">The five lines</Eyebrow>
          <ul className="reveal flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
            {LINES.map((line) => (
              <li
                key={line.key}
                className="min-w-[70%] snap-start sm:min-w-[42%] md:min-w-0"
              >
                <Link href={line.href} className="group block">
                  <Placeholder
                    family="specimen plate"
                    alt={`Placeholder, specimen plate for the ${line.name} line`}
                    className="aspect-[3/4]"
                    label={false}
                  />
                  <div
                    className={`mt-4 h-[3px] w-10 ${PIGMENT_MARK[line.pigment]}`}
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-display text-heading-s-m md:text-heading-s text-primary">
                    {line.name}
                  </h3>
                  <p className="mt-1 text-body-m-m md:text-body-m text-secondary">
                    {line.descriptor}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Block 4, the five absences */}
      <section className="bg-ink py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <ul className="reveal grid grid-cols-1 border-t border-hairline-inverse sm:grid-cols-3 md:grid-cols-5">
            {ABSENCES.map((label) => (
              <li
                key={label}
                className="flex flex-col gap-3 border-b border-hairline-inverse py-8 md:border-b-0 md:border-l md:first:border-l-0 md:pl-6"
              >
                <span className="font-mono text-data text-inverse/50">00</span>
                <span className="text-body-l-m md:text-body-l text-inverse">
                  {label}
                </span>
              </li>
            ))}
          </ul>
          <p className="reveal mt-8 max-w-editorial text-body-m-m md:text-body-m text-inverse/70">
            Ice water hash and rosin, pressed from 100 percent dried sugar trim.
          </p>
        </div>
      </section>

      {/* Block 5, the DNA test */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-page-margin-mobile md:grid-cols-2 md:gap-16 md:px-page-margin">
          <Placeholder
            family="process documentary"
            alt="Placeholder, process documentary of a sample kit on stainless"
            className="reveal aspect-[4/3]"
          />
          <div className="reveal flex flex-col items-start gap-6">
            <Eyebrow>Precision</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              Thirteen traits. One protocol.
            </h2>
            <p className="max-w-editorial text-body-m-m md:text-body-l text-secondary">
              Our Cannabis DNA Test reads how your body metabolizes cannabinoids,
              then matches you to a format, a ratio, and a starting protocol.
              Guesswork is not a wellness plan.
            </p>
            <ButtonLink href="/dna/traits" variant="ghost">
              See the thirteen traits
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Block 6, transparency band */}
      <section className="bg-ink py-16 md:py-24">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-8 px-page-margin-mobile md:grid-cols-2 md:items-end md:px-page-margin">
          <div className="flex flex-col gap-4">
            <Eyebrow tone="inverse">Transparency</Eyebrow>
            <p className="max-w-editorial text-body-l-m md:text-body-l text-inverse">
              Every batch we release is tested by a third-party laboratory. Enter
              a batch number to read its full profile.
            </p>
          </div>
          <BatchTeaser />
        </div>
      </section>

      {/* Block 7, research teaser */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex flex-col gap-6">
            <Eyebrow>Research</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              Written like a laboratory, read like a library.
            </h2>
            <div className="border-t border-hairline py-8">
              <p className="text-body-m-m md:text-body-m text-tertiary">
                No research notes are published yet. The index opens with the
                terpene and endocannabinoid pillars.
              </p>
            </div>
            <ButtonLink href="/research" variant="ghost">
              Read the research
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Block 8, find */}
      <section className="relative overflow-hidden bg-bone">
        <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-page-margin-mobile py-16 md:grid-cols-2 md:gap-16 md:px-page-margin md:py-40">
          <div className="reveal order-2 flex flex-col items-start gap-6 md:order-1">
            <Eyebrow>Availability</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              Available across New York State.
            </h2>
            <ButtonLink href="/find" variant="outline">
              Find a dispensary
            </ButtonLink>
          </div>
          <Placeholder
            family="map still"
            alt="Placeholder, map still of New York State with dispensary pins"
            className="reveal order-1 aspect-[4/3] md:order-2"
          />
        </div>
      </section>
    </>
  );
}
