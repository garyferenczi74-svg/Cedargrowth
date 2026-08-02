import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';

// Real, indexed page (not a HoldPage). Structure only: headings are set, the
// body of every section is the Unknown atom until counsel supplies the
// actual clause text. No policy language is drafted here.

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How CedarGrowth Organics collects, uses, and discloses information from visitors to this site.',
};

const SECTIONS = [
  'Information we collect',
  'How we use information',
  'Sharing and disclosure',
  'Data retention',
  'Your rights',
  'Cookies and tracking',
  'Contact',
];

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Intro */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              Privacy Policy
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              This page sets out the structure of our privacy policy. The
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
            {SECTIONS.map((heading) => (
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
