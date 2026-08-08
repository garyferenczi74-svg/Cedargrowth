import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Placeholder } from '@/components/shell/Placeholder';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Accordion } from '@/components/atoms/Accordion';
import { Unknown } from '@/components/atoms/Unknown';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { ReserveButton } from '@/components/reserve/ReserveButton';
import { PRODUCTS, getProduct } from '@/lib/products';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name}. ${product.descriptor} Reserve for delivery to the nearest dispensary that carries CedarGrowth.`,
  };
}

// A known value renders in mono, an absent one renders UNKNOWN. Kept compact so
// the specimen block reads like a laboratory sheet.
function SpecRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1 border-t border-hairline py-4">
      <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
        {label}
      </dt>
      <dd className="font-mono text-data text-primary">
        {value ?? <span className="text-secondary">UNKNOWN</span>}
      </dd>
    </div>
  );
}

export default function ProductPage({ params }: Params) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const specRows: { label: string; value: string | null }[] = [
    { label: 'Format', value: product.formatLabel },
    { label: 'Net weight', value: product.netWeight },
    ...(product.potency
      ? [{ label: 'Labeled total', value: product.potency }]
      : []),
    { label: 'Cannabinoid profile', value: null },
    { label: 'Dominant terpenes', value: null },
    { label: 'Batch', value: null },
    { label: 'Harvest', value: null },
    { label: 'Laboratory', value: null },
    { label: 'Test date', value: null },
  ];

  const coaRows = [
    'Cannabinoids',
    'Terpenes',
    'Pesticides',
    'Residual solvents',
    'Microbials',
    'Heavy metals',
    'Result',
  ];

  return (
    <>
      {/* Hero, specimen plate and reserve */}
      <section className="bg-parchment">
        <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-page-margin-mobile py-16 md:grid-cols-2 md:gap-16 md:px-page-margin md:py-24">
          <Placeholder
            family="specimen plate"
            alt={`Placeholder, specimen plate of ${product.name}`}
            className="settle aspect-[4/5]"
            label
          />
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>{product.formatLabel}</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-l text-primary">
              {product.name}
            </h1>
            <p className="max-w-editorial text-body-l-m md:text-body-l text-secondary">
              {product.descriptor}
            </p>
            <ReserveButton
              slug={product.slug}
              name={product.name}
              spec={product.spec}
            />
          </div>
        </div>
      </section>

      {/* Specimen block */}
      <section className="bg-clinical py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-8">Specimen</Eyebrow>
          <dl className="reveal grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {specRows.map((row) => (
              <SpecRow key={row.label} label={row.label} value={row.value} />
            ))}
          </dl>
          <p className="mt-6 text-caption-m md:text-caption text-tertiary">
            Batch specific values publish with each batch Certificate of
            Analysis, verifiable by batch number.
          </p>
        </div>
      </section>

      {/* How it is made */}
      <section className="bg-parchment py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>How it is made</Eyebrow>
            <p className="text-body-m-m md:text-body-l text-secondary">
              Pressed from ice water hash, freeze dried, and cold cured. Eight
              steps, no hydrocarbons, no distillate. Every batch is verified by
              an independent laboratory before it is released.
            </p>
            <ButtonLink href="/method" variant="ghost">
              Read the method
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* COA panel */}
      <section className="bg-clinical py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-8">Testing</Eyebrow>
          <div className="reveal">
            <Accordion title="Certificate of Analysis">
              <div className="flex flex-col gap-6">
                <p className="max-w-editorial text-body-m-m md:text-body-m text-secondary">
                  No Certificate of Analysis is attached to this listing. Each
                  released batch publishes its full COA, verifiable by batch
                  number on the transparency page.
                </p>
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  {coaRows.map((label) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 border-t border-hairline py-3"
                    >
                      <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                        {label}
                      </dt>
                      <dd className="font-mono text-data text-secondary">
                        UNKNOWN
                      </dd>
                    </div>
                  ))}
                </dl>
                <Unknown
                  label="Full report"
                  caption="COA PDF publishes with each released batch."
                />
                <ButtonLink href="/transparency" variant="ghost">
                  Look up a batch
                </ButtonLink>
              </div>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Genetic matching */}
      <section className="bg-bone py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>Genetic matching</Eyebrow>
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              Which traits point to this product.
            </h2>
            <p className="text-body-m-m md:text-body-l text-secondary">
              Your Cannabis DNA Test informs which format and ratio suit you. The
              trait to product mapping opens with the test and is not published
              here yet. The test informs selection, it is not a diagnostic.
            </p>
            <ButtonLink href="/dna" variant="ghost">
              See the Cannabis DNA Test
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Details accordion */}
      <section className="bg-parchment py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-8">Details</Eyebrow>
          <div className="reveal">
            <Accordion title="Ingredients">
              <Unknown caption="Full ingredient list, pending confirmation." />
            </Accordion>
            <Accordion title="Packaging">
              <Unknown caption="Packaging specification, pending confirmation." />
            </Accordion>
            <Accordion title="Storage">
              <p className="max-w-editorial text-body-m-m md:text-body-m text-secondary">
                Store in a cool, dark place, away from heat and direct light.
                Keep out of the reach of children and pets.
              </p>
            </Accordion>
            <Accordion title="Required state warnings">
              <Unknown caption="Required state warnings, pending counsel review." />
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
