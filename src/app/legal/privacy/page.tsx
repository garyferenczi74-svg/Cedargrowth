import type { Metadata } from 'next';
import { privacy } from '@/content/legal/privacy';
import { ReviewBanner } from '@/components/legal/ReviewBanner';
import { LegalDocument } from '@/components/legal/LegalDocument';

// Real, indexed page. Rebuilds the Prompt 04 structural shell to render
// content/legal/privacy.ts verbatim through the shared LegalDocument
// renderer. privacy.reviewPending is true, so the draft-review banner
// renders above the h1.
//
// Section 6's lead paragraph already contains the literal, backticked
// reference "`/dna/privacy`" in the source copy (unedited). sectionLinks
// turns that one occurrence into a real link to /dna/privacy, without
// changing a word of the module text; it is a presentation-only
// substitution scoped to this section. Section 9 contains the same
// backticked reference in a different context and is left as plain text,
// per the brief's scope (Section 6 only).
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: privacy.metaDescription,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <ReviewBanner reviewPending={privacy.reviewPending} />
      <LegalDocument
        doc={privacy}
        sectionLinks={{
          '6. Genetic information': [
            { marker: '`/dna/privacy`', href: '/dna/privacy' },
          ],
        }}
      />
    </>
  );
}
