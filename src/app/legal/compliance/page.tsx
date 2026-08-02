import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';
import { UNKNOWNS } from '@/lib/site';

// Real, indexed page (not a HoldPage). Controller-added: this route is not
// listed in the Task 6 brief's Part A/B scope, but the footer's Legal column
// (src/lib/nav.ts) already links to /legal/compliance, so this page resolves
// that link with the same structured-pending treatment as privacy and terms.
// Structure only: headings are set, the body of every section is the
// Unknown atom. No compliance language is drafted here.

export const metadata: Metadata = {
  title: 'Compliance',
  description:
    'Licensing, state warnings, and lab testing compliance for CedarGrowth Organics.',
};

export default function CompliancePage() {
  return (
    <>
      {/* Intro */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              Compliance
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              This page sets out the structure of our compliance disclosures.
              The text of each section below is pending counsel review and
              has not been published yet.
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
                Licensing
              </h2>
              <Unknown caption={UNKNOWNS.license} />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                State warnings
              </h2>
              <Unknown caption={UNKNOWNS.stateWarnings} />
            </div>

            <div className="reveal border-t border-hairline pt-10">
              <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
                Lab testing
              </h2>
              <Unknown caption="UNKNOWN, PENDING COUNSEL REVIEW" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
