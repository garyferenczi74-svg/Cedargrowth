import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';
import { Unknown } from '@/components/atoms/Unknown';
import { FACILITY_ADDRESS } from '@/lib/site';

export const metadata = holdPageMetadata('Contact');

export default function ContactPage() {
  return (
    <HoldPage
      eyebrow="CONTACT"
      headline="How to reach us is being finalized."
      body={`CedarGrowth Organics operates from ${FACILITY_ADDRESS}. A public contact email is not yet published, and this page will carry it once it is.`}
      capture={
        <Unknown label="Email" caption="Public contact email, pending publication." />
      }
      onward={[{ label: 'The method', href: '/method' }]}
    />
  );
}
