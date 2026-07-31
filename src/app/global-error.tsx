'use client';

import { useEffect } from 'react';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import '../../tokens.css';
import './globals.css';

// The 500 page (spec Section C item 4). global-error.tsx replaces the root
// layout entirely, so it renders its own <html>/<body> and stays a Client
// Component per the Next.js contract. It intentionally does not reuse Shell
// or ReservationProvider, since a root-layout failure could involve either.
// Short, plain, one link back home. No apology theatre, no retry button.

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-parchment text-primary font-sans">
        <section className="flex min-h-screen flex-col justify-center bg-parchment py-16 md:py-24">
          <div className="mx-auto w-full max-w-content px-page-margin-mobile md:px-page-margin">
            <div className="flex max-w-editorial flex-col gap-6">
              <Eyebrow>500</Eyebrow>
              <h1 className="font-display text-display-l-m md:text-display-l text-primary">
                Something failed to render.
              </h1>
              <p className="text-body-m-m md:text-body-l text-secondary">
                The page could not load. Nothing was lost.
              </p>
              <div>
                <ButtonLink href="/" variant="outline">
                  Back to the front page
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
