'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReservation } from './ReservationProvider';

// Primary action on a cannabis product page. It reserves, it does not sell.
// Adds the product to the shared reservations bag and states plainly that the
// reservation is held and routed to the nearest dispensary, with no sale
// completed on this site.

export function ReserveButton({
  slug,
  name,
  spec,
}: {
  slug: string;
  name: string;
  spec: string;
}) {
  const { add } = useReservation();
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => {
          add({ slug, name, spec });
          setAdded(true);
        }}
        className="cg-btn group"
      >
        Reserve this product
        <ArrowRight
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="transition-transform duration-hover ease-cedar group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </button>
      <p
        aria-live="polite"
        className="max-w-editorial text-caption-m md:text-caption text-tertiary"
      >
        {added ? (
          <>
            Added to your reservation.{' '}
            <Link href="/reserve" className="cedar-underline text-primary">
              Review reservations
            </Link>
            .
          </>
        ) : (
          'Reserved products are held and routed to the nearest dispensary that carries CedarGrowth. No sale is completed on this site.'
        )}
      </p>
    </div>
  );
}
