import { HoldPage, holdPageMetadata } from '@/components/shell/HoldPage';
import { CaptureForm } from '@/components/shell/CaptureForm';

export const metadata = holdPageMetadata('Find a Dispensary');

export default function FindPage() {
  return (
    <HoldPage
      eyebrow="FIND"
      headline="The locator is not live yet."
      body="A dispensary locator is being built. Until it is live, leave your postal code and we will tell you when CedarGrowth reaches you."
      capture={
        <CaptureForm
          intent="find_dispensary"
          fields={{ location: true }}
          locationLabel="Postal code"
          submitLabel="Tell me when you are near me"
          consent="CedarGrowth uses this email and postal code only to notify you when a retailer near you carries CedarGrowth, and stores them until then or until you unsubscribe."
        />
      }
      onward={[
        { label: 'Wellness', href: '/wellness' },
        { label: 'Products', href: '/products' },
      ]}
    />
  );
}
