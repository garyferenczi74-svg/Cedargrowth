import type { Metadata } from 'next';
import Link from 'next/link';
import { faq } from '@/content/legal/faq';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { slugifyHeading } from '@/components/legal/slugify';

// Real, indexed page rendering content/legal/faq.ts as data. Every
// question is a heading (h2) with its answer always visible, no accordion:
// the brief calls for questions-as-headings, not a disclosure widget.
// faq.reviewPending is false, so no ReviewBanner renders (LegalDocument
// never renders it either way; only the page composes it).
export const metadata: Metadata = {
  title: 'FAQ',
  description: faq.metaDescription,
};

export default function FaqPage() {
  return (
    <LegalDocument
      doc={faq}
      afterTitle={
        <nav aria-label="Questions on this page">
          <p className="mb-4 font-mono text-specimen uppercase tracking-specimen text-tertiary">
            On this page
          </p>
          <ul className="flex flex-col gap-2">
            {faq.sections.map((section) => (
              <li key={section.heading}>
                <Link
                  href={`#${slugifyHeading(section.heading)}`}
                  className="cedar-underline text-body-m-m md:text-body-m text-secondary"
                >
                  {section.heading}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
    />
  );
}
