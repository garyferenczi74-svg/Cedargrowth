import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Rise } from '@/components/motion/Rise';
import { LineReveal } from '@/components/motion/LineReveal';
import { Resolve } from '@/components/motion/Resolve';
import { research, NOTES } from '@/content/research';

export const metadata: Metadata = {
  title: 'Research',
  description:
    'What we know, and how well we know it. Every claim in the library carries its evidence tier and its sources.',
};

const recentNotes = [...NOTES].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);

export default function ResearchPage() {
  return (
    <>
      {/* Index header */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="flex max-w-editorial flex-col gap-6">
            <Eyebrow>{research.eyebrow}</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              <LineReveal text={research.headline} />
            </h1>
            <Rise delay={0.16} className="text-body-m-m md:text-body-l text-secondary">
              {research.body}
            </Rise>
          </div>
        </div>
      </section>

      {/* Pillars, as entries with data-driven counts */}
      <section className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="mb-8">Pillars</Eyebrow>
          <ul className="border-t border-hairline">
            {research.pillars.map((p) => (
              <li key={p.key}>
                <Link
                  href={p.href}
                  className="grid grid-cols-1 gap-2 border-b border-hairline py-8 md:grid-cols-[18rem_1fr] md:gap-10"
                >
                  <h2 className="font-display text-heading-s-m md:text-heading-s text-primary">
                    {p.title}
                  </h2>
                  <p className="max-w-editorial text-body-m-m md:text-body-l text-secondary">
                    {p.count != null ? (
                      <span className="font-mono text-data text-primary">{p.count} </span>
                    ) : null}
                    {p.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Notes, three most recent */}
      <section className="bg-parchment py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="mb-8">Notes</Eyebrow>
          <ul className="border-t border-hairline">
            {recentNotes.map((note, i) => (
              <li key={note.slug}>
                <Link
                  href={note.redirectTo ?? `/research/notes/${note.slug}`}
                  className="grid grid-cols-1 gap-2 border-b border-hairline py-6 md:grid-cols-[8rem_7rem_1fr] md:gap-6"
                >
                  <span className="font-mono text-specimen text-tertiary">
                    <Resolve text={note.date} delay={i * 0.08} />
                  </span>
                  <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                    {note.category}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-heading-s-m md:text-heading-s text-primary">
                      {note.title}
                    </span>
                    <span className="text-body-m-m md:text-body-m text-secondary">
                      {note.abstract}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/research/notes" variant="ghost">
              All research notes
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Facility placeholder, kept in place */}
      <section className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div
            role="img"
            aria-label="Placeholder, facility interior in winter light"
            className="flex aspect-[16/9] w-full items-end border border-hairline bg-parchment p-3"
          >
            <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              {research.facilityCaption}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
