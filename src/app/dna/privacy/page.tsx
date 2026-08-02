import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';

// Prompt-04-style hold page (noindex). Privacy Section 6 ("6. Genetic
// information") points here for "the full account, including the
// laboratory and the specific markers." Nothing here invents a lab name
// or a retention answer; both remain genuinely undecided.
export const metadata = holdPageMetadata('Genetic privacy');

export default function DnaPrivacyPage() {
  return (
    <HoldPage
      eyebrow="Genetic privacy"
      headline="The genetic privacy notice is in preparation."
      body="This page will carry the full, dedicated account of how CedarGrowth handles a saliva sample: the laboratory that performs the analysis, the specific markers it reads, how long the physical sample is kept, and the consent record behind each step. It will publish before any kit ships. Until then, the general handling of genetic information is set out in Section 6 of the privacy policy."
      onward={[
        { label: 'Read the privacy policy', href: '/legal/privacy' },
        { label: 'The Cannabis DNA Test', href: '/dna' },
      ]}
    />
  );
}
