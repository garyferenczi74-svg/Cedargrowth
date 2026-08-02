import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';

export const metadata = holdPageMetadata('Journal');

export default function JournalPage() {
  return (
    <HoldPage
      eyebrow="JOURNAL"
      headline="Not yet published."
      body="The journal, CedarGrowth's editorial notes on the method, the lines, and the facility, is being prepared for publication."
      onward={[
        { label: 'The method', href: '/method' },
        { label: 'Research', href: '/research' },
      ]}
    />
  );
}
