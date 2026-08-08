import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { holdPageMetadata } from '@/components/shell/HoldPage';

// The practitioner gate. Scaffolded and empty by design: it is the route that
// will receive the reference guide's clinical and therapeutic material once
// counsel has cleared it. No therapeutic, indication, dosing, or interaction
// content sits behind it in this build. An empty gate is the correct state.
// noindex until it has real content.

export const metadata: Metadata = holdPageMetadata('For practitioners . CedarGrowth Research');

export default function PractitionerGatePage() {
  return (
    <section className="bg-parchment py-16 md:py-40">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex max-w-editorial flex-col gap-6">
          <Eyebrow>For practitioners</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            Clinical material, for registered practitioners.
          </h1>
          <p className="text-body-m-m md:text-body-l text-secondary">
            The library above is written for a general reader: it explains mechanism,
            chemistry, and how each compound behaves, and it stops there. The clinical
            literature, which reads in its proper context only for a clinical audience,
            is held for registered practitioners and is being prepared for release
            pending review.
          </p>
          <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
            PENDING COUNSEL REVIEW
          </p>
          <div className="mt-2">
            <ButtonLink href="/practitioners" variant="ghost">
              Practitioner registration
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
