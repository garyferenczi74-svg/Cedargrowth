import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { ButtonLink } from '@/components/atoms/ButtonLink';

// The 404 page (spec Section C item 4). Renders inside the root layout, so
// it carries no <html>/<body> of its own, and inherits the Shell header and
// footer. Short, plain, one link back home. No apology theatre.

export const metadata: Metadata = {
  title: 'Not found',
  description: 'This page does not exist.',
};

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col justify-center bg-parchment py-16 md:py-24">
      <div className="mx-auto w-full max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex max-w-editorial flex-col gap-6">
          <Eyebrow>404</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-l text-primary">
            This page does not exist.
          </h1>
          <p className="text-body-m-m md:text-body-l text-secondary">
            The address does not match anything published here.
          </p>
          <div>
            <ButtonLink href="/" variant="outline">
              Back to the front page
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
