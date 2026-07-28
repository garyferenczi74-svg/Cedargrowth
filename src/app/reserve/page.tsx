import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ReserveClient } from '@/components/reserve/ReserveClient';

export const metadata: Metadata = {
  title: 'Reserve',
  description:
    'Reserve CedarGrowth products to hold for delivery to the nearest dispensary. A request, not a sale.',
};

export default function ReservePage() {
  return (
    <section className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="mb-12 flex max-w-editorial flex-col gap-6">
          <Eyebrow>Reservations</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-l text-primary">
            Reserve, do not buy.
          </h1>
          <p className="text-body-m-m md:text-body-l text-secondary">
            CedarGrowth is a licensed processor, not a retail store. Reserved
            products are held and fulfilled as wholesale to the nearest
            dispensary that carries CedarGrowth. Buyers can also request a
            special product run.
          </p>
        </div>
        <ReserveClient />
      </div>
    </section>
  );
}
