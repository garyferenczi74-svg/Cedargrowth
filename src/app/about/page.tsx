import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';

export const metadata = holdPageMetadata('About');

export default function AboutPage() {
  return (
    <HoldPage
      eyebrow="ABOUT"
      headline="The full company page is not published yet."
      body="The team, the facility, and the story behind CedarGrowth are being prepared as one page rather than released in pieces."
      onward={[{ label: 'The method', href: '/method' }]}
    />
  );
}
