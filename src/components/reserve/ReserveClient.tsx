'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { useReservation } from './ReservationProvider';

export function ReserveClient() {
  const { items, count, hydrated, setQty, remove, clear } = useReservation();
  const [submitted, setSubmitted] = useState(false);

  if (!hydrated) {
    return (
      <p className="text-body-m-m md:text-body-m text-tertiary">
        Loading your reservation.
      </p>
    );
  }

  if (submitted) {
    return (
      <div className="flex max-w-editorial flex-col gap-6">
        <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
          Your reservation request is prepared.
        </h2>
        <p className="text-body-m-m md:text-body-l text-secondary">
          A CedarGrowth coordinator confirms availability and routes it to the
          nearest dispensary that carries CedarGrowth before anything is held. No
          payment is taken on this site, and no sale is completed here.
        </p>
        <p className="text-caption-m md:text-caption text-tertiary">
          Reservations are fulfilled as wholesale to a dispensary, so quantities
          and timing are confirmed with you directly.
        </p>
        <button
          type="button"
          onClick={() => {
            clear();
            setSubmitted(false);
          }}
          className="self-start cedar-underline text-caption uppercase tracking-eyebrow text-primary"
        >
          Start a new reservation
        </button>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="flex max-w-editorial flex-col gap-6">
        <p className="text-body-m-m md:text-body-l text-secondary">
          No products are reserved yet. Reserve a product to hold it for delivery
          to the nearest dispensary that carries CedarGrowth.
        </p>
        <ButtonLink href="/products" variant="outline">
          Browse products
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
      {/* The bag */}
      <div>
        <Eyebrow className="mb-6">Reserved products</Eyebrow>
        <ul>
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex items-start justify-between gap-4 border-t border-hairline py-5"
            >
              <div className="flex flex-col gap-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="cedar-underline font-display text-heading-s-m md:text-heading-s text-primary"
                >
                  {item.name}
                </Link>
                <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                  {item.spec}
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  className="mt-2 self-start text-caption-m md:text-caption text-tertiary underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${item.name}`}
                  onClick={() => setQty(item.slug, item.qty - 1)}
                  className="h-8 w-8 border border-hairline font-mono text-data text-primary"
                >
                  <span aria-hidden="true">-</span>
                </button>
                <span
                  className="w-6 text-center font-mono text-data text-primary"
                  aria-label={`Quantity, ${item.qty}`}
                >
                  {item.qty}
                </span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${item.name}`}
                  onClick={() => setQty(item.slug, item.qty + 1)}
                  className="h-8 w-8 border border-hairline font-mono text-data text-primary"
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-specimen uppercase tracking-specimen text-tertiary">
          {count} reserved
        </p>
      </div>

      {/* The request */}
      <div>
        <Eyebrow className="mb-6">Reservation request</Eyebrow>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-col gap-6"
        >
          <Field id="res-name" label="Name" type="text" autoComplete="name" />
          <Field
            id="res-email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <Field
            id="res-postal"
            label="Postal code or city"
            type="text"
            autoComplete="postal-code"
          />
          <div className="flex flex-col gap-2">
            <label
              htmlFor="res-note"
              className="font-mono text-specimen uppercase tracking-specimen text-tertiary"
            >
              Note, optional
            </label>
            <textarea
              id="res-note"
              name="note"
              rows={3}
              className="border-b border-hairline bg-transparent py-2 text-body-m-m md:text-body-m text-primary focus-visible:border-cedar focus-visible:outline-none"
            />
          </div>
          <button
            type="submit"
            className="self-start bg-ink px-6 py-4 text-caption uppercase tracking-eyebrow text-inverse"
          >
            Prepare reservation request
          </button>
          <p className="text-caption-m md:text-caption text-tertiary">
            Your postal code or city is used only to match the nearest dispensary
            that carries CedarGrowth. No payment is taken, and no sale is
            completed on this site.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-specimen uppercase tracking-specimen text-tertiary"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        className="border-b border-hairline bg-transparent py-2 text-body-m-m md:text-body-m text-primary focus-visible:border-cedar focus-visible:outline-none"
      />
    </div>
  );
}
