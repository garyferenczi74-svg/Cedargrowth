import type { Metadata } from 'next';
import { Placeholder } from '@/components/shell/Placeholder';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Unknown } from '@/components/atoms/Unknown';
import {
  METHOD_STEPS,
  METHOD_ECONOMICS,
  METHOD_ABSENCES,
} from '@/lib/method';

export const metadata: Metadata = {
  title: 'Method',
  description:
    'From trim to rosin. The nine step solventless protocol, written like a protocol document.',
};

export default function MethodPage() {
  return (
    <>
      {/* Intro */}
      <section className="bg-parchment py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex max-w-editorial flex-col gap-6">
            <Eyebrow>The method</Eyebrow>
            <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
              From trim to rosin.
            </h1>
            <p className="text-body-m-m md:text-body-l text-secondary">
              A protocol document, not a story. Nine sequential steps, each one
              stated plainly, from the input material to the third-party
              Certificate of Analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Nine steps */}
      <section className="bg-parchment pb-16 md:pb-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <ol>
            {METHOD_STEPS.map((step) => (
              <li
                key={step.n}
                className="reveal grid grid-cols-1 gap-6 border-t border-hairline py-10 md:grid-cols-12 md:gap-16 md:py-16"
              >
                <div className="md:col-span-5">
                  <Placeholder
                    family="process documentary"
                    alt={`Placeholder, process documentary of ${step.title.toLowerCase()}`}
                    className="aspect-[5/4]"
                    label={false}
                  />
                </div>
                <div className="flex flex-col gap-4 md:col-span-7">
                  <span className="font-mono text-data text-tertiary">
                    {step.n}
                  </span>
                  <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
                    {step.title}
                  </h2>
                  <p className="max-w-editorial text-body-m-m md:text-body-l text-secondary">
                    {step.body}
                  </p>
                  {step.unknownFigure ? (
                    <Unknown
                      label={step.unknownFigure.label}
                      caption={step.unknownFigure.caption}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Input economics, clinical surface */}
      <section className="bg-clinical py-16 md:py-24">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <Eyebrow className="reveal mb-10">Input economics</Eyebrow>
          <div className="reveal grid grid-cols-1 gap-10 border-t border-hairline pt-10 md:grid-cols-3">
            <div>
              <p className="mb-3 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Input material
              </p>
              <Unknown caption={METHOD_ECONOMICS.inputCaption} />
            </div>
            <div>
              <p className="mb-3 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Yield
              </p>
              <Unknown caption={METHOD_ECONOMICS.yieldCaption} />
            </div>
            <p className="max-w-editorial text-body-m-m md:text-body-m text-secondary">
              {METHOD_ECONOMICS.note}
            </p>
          </div>
        </div>
      </section>

      {/* Closing statement band */}
      <section className="bg-ink py-16 md:py-40">
        <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
          <div className="reveal flex flex-col gap-8">
            <h2 className="font-display text-heading-m-m md:text-heading-m text-inverse">
              What we do not do.
            </h2>
            <ul className="grid grid-cols-1 border-t border-hairline-inverse sm:grid-cols-2 md:grid-cols-4">
              {METHOD_ABSENCES.map((label) => (
                <li
                  key={label}
                  className="border-b border-hairline-inverse py-8 text-body-l-m md:text-body-l text-inverse md:border-b-0 md:border-l md:first:border-l-0 md:pl-6"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
