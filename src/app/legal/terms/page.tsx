import type { Metadata } from 'next';
import { terms } from '@/content/legal/terms';
import { ReviewBanner } from '@/components/legal/ReviewBanner';
import { LegalDocument } from '@/components/legal/LegalDocument';

// Real, indexed page. Rebuilds the Prompt 04 structural shell to render
// content/legal/terms.ts verbatim through the shared LegalDocument
// renderer. terms.reviewPending is true, so the draft-review banner
// renders above the h1.
export const metadata: Metadata = {
  title: 'Terms of Service',
  description: terms.metaDescription,
};

export default function TermsOfServicePage() {
  return (
    <>
      <ReviewBanner reviewPending={terms.reviewPending} />
      <LegalDocument doc={terms} />
    </>
  );
}
