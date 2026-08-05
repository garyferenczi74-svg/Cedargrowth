import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { Placeholder } from '@/components/shell/Placeholder';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { BatchTeaser } from '@/components/home/BatchTeaser';
import { HeroVideo } from '@/components/home/HeroVideo';
import { TwoInputsBand } from '@/components/home/TwoInputsBand';
import { TeamSection } from '@/components/home/TeamSection';
import { LINES, ABSENCES, PIGMENT_MARK } from '@/lib/lines';
import { SITE_URL } from '@/lib/site';
import { home } from '@/content/home';

// Home page metadata (spec Section C item 2). Title is absolute so it does
// not run through the root layout's "%s, CedarGrowth Organics" template.
// The Open Graph image is a documented placeholder path, not a real asset:
// see task-4-report.md for the outstanding-asset note.
export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: home.meta.title,
    description: home.meta.description,
    url: SITE_URL,
    siteName: home.meta.title,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}${home.meta.ogImagePath}`,
        width: 1200,
        height: 630,
        alt: home.meta.ogImageAlt,
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Block 1, hero */}
      <section className="relative flex min-h-[82vh] flex-col justify-end overflow-hidden bg-ink">
        <HeroVideo
          src={home.hero.videoSrc}
          className="settle absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-content px-page-margin-mobile pb-16 md:px-page-margin md:pb-24">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow tone="inverse">{home.hero.eyebrow}</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-inverse [text-shadow:0_1px_18px_rgb(28_27_25_/_0.5)]">
              {home.hero.headlineLines.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h1>
            <p className="text-body-m-m md:text-body-l text-inverse/90 [text-shadow:0_1px_14px_rgb(28_27_25_/_0.55)]">
              {home.hero.body}
            </p>
            <div>
              <ButtonLink
                href="/method"
                variant="outline"
                tone="inverse"
                className="!border-inverse bg-ink/25 backdrop-blur-sm hover:!bg-inverse hover:!text-primary"
              >
                {home.hero.cta}
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
            headline={home.position.headline}
            sub={
              <>
                {home.position.sub}
                <br />
                {home.position.subDetail}
              </>
            }
          />
        </div>
      </section>

      {/* Block 3, the five lines */}
      <section className="bg-bone py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-10">{home.fiveLines.eyebrow}</Eyebrow>
          <ul className="reveal flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
            {LINES.map((line) => (
              <li
                key={line.key}
                className="min-w-[70%] snap-start sm:min-w-[42%] md:min-w-0"
              >
                <Link href={line.href} className="group block">
                  <Placeholder
                    family={home.placeholders.fiveLines.family}
                    alt={home.placeholders.fiveLines.altFor(line.name)}
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

      {/* Section A, the two inputs band */}
      <TwoInputsBand />

      {/* Block 4, the five absences */}
      <section className="bg-ink py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <ul className="reveal grid grid-cols-1 border-t border-hairline-inverse sm:grid-cols-3 md:grid-cols-5">
            {ABSENCES.map((item) => (
              <li
                key={item.label}
                className="flex flex-col gap-3 border-b border-hairline-inverse py-8 md:border-b-0 md:border-l md:first:border-l-0 md:pl-6"
              >
                <span className="font-mono text-data text-inverse/50">00</span>
                <span className="text-body-l-m md:text-body-l text-inverse">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="reveal mt-8 max-w-editorial text-body-m-m md:text-body-m text-inverse/70">
            {home.absences.trailing}
          </p>
        </div>
      </section>

      {/* Block 5, the DNA test */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-page-margin-mobile md:grid-cols-2 md:gap-16 md:px-page-margin">
          <Placeholder
            family={home.placeholders.dna.family}
            alt={home.placeholders.dna.alt}
            className="reveal aspect-[4/3]"
          />
          <div className="reveal flex flex-col items-start gap-6">
            <Eyebrow>{home.dna.eyebrow}</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              {home.dna.headline}
            </h2>
            <p className="max-w-editorial text-body-m-m md:text-body-l text-secondary">
              {home.dna.body}
            </p>
            <ButtonLink href="/dna" variant="ghost">
              {home.dna.cta}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Block 6, transparency band */}
      <section className="bg-ink py-16 md:py-24">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-8 px-page-margin-mobile md:grid-cols-2 md:items-end md:px-page-margin">
          <div className="flex flex-col gap-4">
            <Eyebrow tone="inverse">{home.transparency.eyebrow}</Eyebrow>
            <p className="max-w-editorial text-body-l-m md:text-body-l text-inverse">
              {home.transparency.body}
            </p>
          </div>
          <BatchTeaser />
        </div>
      </section>

      {/* Section B, the team section */}
      <TeamSection />

      {/* Block 7, research teaser */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex flex-col gap-6">
            <Eyebrow>{home.research.eyebrow}</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              {home.research.headline}
            </h2>
            <div className="border-t border-hairline py-8">
              <p className="text-body-m-m md:text-body-m text-tertiary">
                {home.research.emptyNote}
              </p>
            </div>
            <ButtonLink href="/research" variant="ghost">
              {home.research.cta}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Block 8, find */}
      <section className="relative overflow-hidden bg-bone">
        <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-page-margin-mobile py-16 md:grid-cols-2 md:gap-16 md:px-page-margin md:py-40">
          <div className="reveal order-2 flex flex-col items-start gap-6 md:order-1">
            <Eyebrow>{home.find.eyebrow}</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              {home.find.headline}
            </h2>
            <ButtonLink href="/find" variant="outline">
              {home.find.cta}
            </ButtonLink>
          </div>
          <Placeholder
            family={home.placeholders.find.family}
            alt={home.placeholders.find.alt}
            className="reveal order-1 aspect-[4/3] md:order-2"
          />
        </div>
      </section>
    </>
  );
}
