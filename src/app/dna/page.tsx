import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';
import { CaptureForm } from '@/components/shell/CaptureForm';

export const metadata = holdPageMetadata('The Cannabis DNA Test');

export default function DnaPage() {
  return (
    <HoldPage
      eyebrow="THE CANNABIS DNA TEST"
      headline="Kits are not shipping yet."
      body="The Cannabis DNA Test is still being finalized. We are closing out the lab partnership and the kit packaging before any order ships. This page will carry the details once a ship date is set."
      capture={
        <CaptureForm
          intent="dna_kit"
          fields={{ name: true }}
          submitLabel="Tell me when kits ship"
          consent="CedarGrowth uses this email only to notify you when kits ship, and stores it until then or until you unsubscribe."
        />
      }
      onward={[
        { label: 'Read the method', href: '/method' },
        { label: 'Read the research', href: '/research' },
      ]}
    />
  );
}
