import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';

// Referenced by the research practitioner gate (/research/practitioner) and by
// the wider practitioner-channel plan. The channel is not built yet, so this is
// a hold page rather than a dead link. Registration, credential verification,
// and the gated clinical library land here once counsel has cleared them.
export const metadata = holdPageMetadata('For practitioners');

export default function PractitionersPage() {
  return (
    <HoldPage
      eyebrow="FOR PRACTITIONERS"
      headline="A channel for registered practitioners."
      body="We are preparing a registered channel for clinicians and formulators, with credential verification and access to the clinical literature that does not belong on a public page. It is being built alongside the review it requires. This page will carry the details once it opens."
      onward={[
        { label: 'The research library', href: '/research' },
        { label: 'The method', href: '/method' },
      ]}
    />
  );
}
