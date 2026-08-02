import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';

// Real, indexed page (not a HoldPage). Unlike privacy/terms/compliance, this
// page is written, not left as a structure of Unknown atoms: it states only
// what is verifiable in this codebase today (skip link and focus-visible
// treatment in src/components/shell/Shell.tsx and globals.css, labeled form
// fields with aria-describedby/aria-invalid in CaptureForm.tsx, the
// aria-hidden decorative hero video in HeroVideo.tsx, the role="img" plus
// aria-label treatment of image placeholders in Placeholder.tsx, and the
// prefers-reduced-motion handling in HeroVideo.tsx and globals.css). It does
// not assert a certified conformance level, and the contact route is
// rendered Unknown because no public accessibility contact exists in the
// repo yet.

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description:
    'What this site does today to support accessibility, and what is still outstanding.',
};

const IMPLEMENTED = [
  {
    title: 'Keyboard operability and visible focus indicators',
    body: 'Links, buttons, form fields, and the navigation menu are built from standard interactive HTML elements and are operable by keyboard. A skip-to-content link is the first focusable element on every page. Focus is visible: links use an underline that draws in on :focus-visible, and form fields use a visible border on :focus-visible.',
  },
  {
    title: 'Semantic headings and landmarks',
    body: 'Each page has one top-level heading and nested section headings, inside header, nav, main, and footer landmarks, with the primary and legal navigation regions labeled by aria-label.',
  },
  {
    title: 'Form fields with visible labels and programmatic errors',
    body: 'Every form field on this site has a visible label associated with its input through htmlFor, and validation errors are tied to their field with aria-describedby and aria-invalid, and announced through role="alert".',
  },
  {
    title: 'Decorative media handled appropriately',
    body: 'The autoplaying hero video is decorative and is marked aria-hidden, so it is not announced as content. Image placeholders, used until real photography lands, are the opposite case: each carries role="img" with a descriptive aria-label naming the image family and subject, so a screen reader still gets a meaningful description of what will occupy that space.',
  },
  {
    title: 'Reduced motion support',
    body: 'The hero video honors prefers-reduced-motion by holding its first frame static instead of autoplaying, and scroll-triggered reveal animation is gated behind prefers-reduced-motion: no-preference, so content stays fully visible without motion for anyone who has that preference set.',
  },
];

const OUTSTANDING = [
  'No independent accessibility audit has been performed on this site.',
  'Color contrast and screen reader behavior have not been verified across every component and page.',
  'A dedicated accessibility contact route has not been published yet.',
];

export default function AccessibilityStatementPage() {
  return (
    <>
      {/* Intro */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              Accessibility Statement
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              This statement describes what this site does today to support
              accessibility, written from what is actually built, not from a
              claim we cannot verify.
            </p>
          </div>
        </div>
      </section>

      {/* Target */}
      <section className="bg-parchment pb-16 md:pb-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal border-t border-hairline pt-10">
            <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
              Target
            </h2>
            <p className="max-w-editorial text-body-m-m md:text-body-m text-secondary">
              CedarGrowth Organics aims to meet WCAG 2.1 Level AA. This is a
              target the team is building toward, not a claim of certified or
              independently audited conformance.
            </p>
          </div>
        </div>
      </section>

      {/* What is implemented */}
      <section className="bg-clinical py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-10">What is implemented</Eyebrow>
          <div className="reveal flex flex-col gap-10 border-t border-hairline pt-10">
            {IMPLEMENTED.map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                <h3 className="font-display text-heading-s-m md:text-heading-s text-primary">
                  {item.title}
                </h3>
                <p className="max-w-editorial text-body-m-m md:text-body-m text-secondary">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is outstanding */}
      <section className="bg-parchment py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal border-t border-hairline pt-10">
            <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
              What is outstanding
            </h2>
            <ul className="flex max-w-editorial flex-col gap-2">
              {OUTSTANDING.map((line) => (
                <li
                  key={line}
                  className="text-body-m-m md:text-body-m text-secondary"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-parchment pb-16 md:pb-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal border-t border-hairline pt-10">
            <h2 className="mb-4 font-display text-heading-m-m md:text-heading-m text-primary">
              Contact
            </h2>
            <Unknown caption="Accessibility contact route, pending publication." />
          </div>
        </div>
      </section>
    </>
  );
}
