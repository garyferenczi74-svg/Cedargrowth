import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';
import { Unknown } from '@/components/atoms/Unknown';

export const metadata = holdPageMetadata('Practitioners');

export default function PractitionersPage() {
  return (
    <HoldPage
      eyebrow="PRACTITIONERS"
      headline="Not yet open."
      body="The practitioner channel is being established. This page holds its place until it opens."
      capture={
        <Unknown
          label="Contact"
          caption="Practitioner contact route, pending publication."
        />
      }
      onward={[{ label: 'The method', href: '/method' }]}
    />
  );
}
