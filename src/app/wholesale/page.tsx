import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';
import { CaptureForm } from '@/components/shell/CaptureForm';

export const metadata: Metadata = {
  title: 'Wholesale',
  description:
    'Request a CedarGrowth wholesale account. A licensed processor in Buffalo, New York, pressed from two inputs to one solventless standard.',
};

export default function WholesalePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>Wholesale</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              Stock the standard, not a strain name.
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              CedarGrowth is a licensed processor in Buffalo, New York.
              Dispensary buyers request an account below and a CedarGrowth
              coordinator follows up directly.
            </p>
          </div>
        </div>
      </section>

      {/* What CedarGrowth produces, plus the two inputs */}
      <section className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>What we produce</Eyebrow>
            <p className="text-body-m-m md:text-body-l text-secondary">
              Five lines across eight products, in vape, infused pre-roll,
              and gummy formats, each pressed to one solventless standard.
              Every batch begins as one of two inputs: dried and cured sugar
              trim, or fresh frozen whole plant. Both are washed cold and
              pressed, never diverted through hydrocarbons, distillate, or
              synthetic terpenes.
            </p>
          </div>
        </div>
      </section>

      {/* Case configurations, minimums, lead times */}
      <section className="bg-clinical py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-10">Order terms</Eyebrow>
          <div className="reveal grid grid-cols-1 gap-10 border-t border-hairline pt-10 md:grid-cols-3">
            <Unknown
              label="Case configuration"
              caption="Case configuration, pending confirmation."
            />
            <Unknown
              label="Order minimum"
              caption="Order minimum, pending confirmation."
            />
            <Unknown
              label="Lead time"
              caption="Lead time, pending confirmation."
            />
          </div>
        </div>
      </section>

      {/* Account request form */}
      <section className="bg-parchment py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-8">
            <div className="flex flex-col gap-6">
              <Eyebrow>Request an account</Eyebrow>
              <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
                Tell us about your dispensary.
              </h2>
            </div>
            <CaptureForm
              intent="wholesale"
              fields={{ name: true, business: true, note: true }}
              submitLabel="Request an account"
              consent="These details are used to respond to your wholesale account request and are kept only until the inquiry is resolved."
            />
          </div>
        </div>
      </section>
    </>
  );
}
