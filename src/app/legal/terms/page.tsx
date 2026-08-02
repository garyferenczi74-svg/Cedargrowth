import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';
import { AGE_LINE } from '@/lib/site';

// Real, indexed page (not a HoldPage). Structure only: headings are set, the
// body of every section is the Unknown atom until counsel supplies the
// actual clause text, with the one exception of Eligibility, which restates
// the 21-or-older AGE_LINE fact that already exists in src/lib/site.ts and
// nothing more. No other policy language is drafted here.

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern use of the CedarGrowth Organics website.',
};

const SECTIONS_AFTER_ELIGIBILITY = [
  'Use of the site',
  'Intellectual property',
  'Disclaimers',
  'Limitation of liability',
  'Governing law',
  'Contact',
];

export default function TermsOfServicePage() {
  return (
    <>
      {/* Intro */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              Terms of Service
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              This page sets out the structure of our terms of service. The
              text of each section below is pending counsel review and has
              not been published yet.
            </p>
          </div>
        </div>
      </section>

      {/* Sections, structure only */}
      <section className="bg-parchment pb-16 md:pb-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="flex flex-col gap-10 md:gap-16">
            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                Acceptance of terms
              </h2>
              <Unknown caption="UNKNOWN, PENDING COUNSEL REVIEW" />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                Eligibility
              </h2>
              <p className="text-body-m-m md:text-body-m text-secondary">
                {AGE_LINE}
              </p>
            </div>

            {SECTIONS_AFTER_ELIGIBILITY.map((heading) => (
              <div
                key={heading}
                className="reveal border-t border-hairline pt-10"
              >
                <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                  {heading}
                </h2>
                <Unknown caption="UNKNOWN, PENDING COUNSEL REVIEW" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
