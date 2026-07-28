import type { Metadata } from 'next';
import Link from 'next/link';
import { Placeholder } from '@/components/shell/Placeholder';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { PRODUCTS, FORMAT_GROUPS } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Eight products across three formats. Vape, infused pre-roll, and gummy, each pressed to one solventless standard.',
};

export default function ProductsPage() {
  return (
    <>
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>By format</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              Eight products, one standard.
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              Every format begins as the same solventless rosin. Reserve a
              product to hold it for delivery to the nearest dispensary that
              carries CedarGrowth.
            </p>
          </div>
        </div>
      </section>

      {FORMAT_GROUPS.map((group, gi) => {
        const items = PRODUCTS.filter((p) => p.format === group.format);
        const tone = gi % 2 === 0 ? 'bg-bone' : 'bg-parchment';
        return (
          <section key={group.format} className={tone}>
            <div className="mx-auto max-w-content px-page-margin-mobile py-16 md:px-page-margin md:py-24">
              <Eyebrow className="reveal mb-10">{group.label}</Eyebrow>
              <ul className="reveal grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
                {items.map((product) => (
                  <li key={product.slug}>
                    <Link href={`/products/${product.slug}`} className="group block">
                      <Placeholder
                        family="specimen plate"
                        alt={`Placeholder, specimen plate of ${product.name}`}
                        className="aspect-[4/5]"
                        label={false}
                      />
                      <h2 className="mt-4 font-display text-heading-s-m md:text-heading-s text-primary">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-body-m-m md:text-body-m text-secondary">
                        {product.descriptor}
                      </p>
                      <p className="mt-3 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                        {product.spec}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
