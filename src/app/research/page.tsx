import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';

export const metadata = holdPageMetadata('Research');

export default function ResearchPage() {
  return (
    <HoldPage
      eyebrow="RESEARCH"
      headline="Not yet published."
      body="The research library is being assembled for publication. We are holding it until it is complete rather than releasing it in pieces."
      onward={[
        { label: 'The method', href: '/method' },
        { label: 'The five lines', href: '/wellness' },
      ]}
    />
  );
}
