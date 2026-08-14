import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { LineReveal } from '@/components/motion/LineReveal';
import { ProductsGrid } from '@/components/products/ProductsGrid';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Eight products in three formats: vape, infused pre-roll, and gummy. Every format begins as the same material, separated with ice, water, and pressure.',
};

// The Products index (CG Prompt 11). All eight products on one page, no
// pagination, in three fixed format groups. No cart, no price, no per-product
// action: the commerce constraint means the only page action is finding a
// dispensary. Filtering lives in ProductsGrid (client). Detail pages at
// /products/[slug] are real routes.
export default function ProductsPage() {
  return (
    <>
      <section className="bg-parchment py-16 md:py-32">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="flex max-w-editorial flex-col gap-6">
            <Eyebrow>Products</Eyebrow>
            <LineReveal
              text="Eight products. One process."
              className="font-display text-display-l-m md:text-display-xl text-primary"
            />
            <p className="text-body-m-m md:text-body-l text-secondary">
              Every format begins as the same material: resin separated with
              ice, water, and pressure, then formulated around an intended state
              rather than a strain name.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-parchment pb-16 md:pb-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <ProductsGrid />
        </div>
      </section>

      <section className="bg-bone py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="flex flex-col gap-6">
            <Eyebrow>Where to buy</Eyebrow>
            <p className="text-body-m-m md:text-body-l text-secondary max-w-editorial">
              CedarGrowth does not sell directly. Find the nearest licensed
              dispensary that carries these products.
            </p>
            <div>
              <ButtonLink href="/find" variant="outline">
                Find these products
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
