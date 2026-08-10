import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Rise } from '@/components/motion/Rise';
import { LineReveal } from '@/components/motion/LineReveal';
import { EvidenceChip } from '@/components/dna/EvidenceChip';
import { ECS } from '@/content/research';

export const metadata: Metadata = {
  title: 'The endocannabinoid system . CedarGrowth Research',
  description:
    'The receptors a cannabinoid binds, the molecules the body makes to bind them, and the enzymes that clear them. Mechanism, at the level of the cell.',
};

const LAST_REVIEWED = '2026-08-08';

export default function EcsPage() {
  return (
    <article className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="mx-auto flex max-w-[720px] flex-col gap-6">
          <Eyebrow>{ECS.eyebrow}</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            <LineReveal text={ECS.headline} />
          </h1>

          {/* Evidence header */}
          <dl className="grid grid-cols-1 gap-3 border border-hairline bg-clinical p-6 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Evidence
              </dt>
              <dd>
                <EvidenceChip tier={ECS.tier} />
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Sources
              </dt>
              <dd className="font-mono text-data text-primary">{ECS.sources.length}</dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Last reviewed
              </dt>
              <dd className="font-mono text-data text-primary">{LAST_REVIEWED}</dd>
            </div>
          </dl>

          <Rise className="text-body-m-m md:text-body-l text-secondary">{ECS.intro}</Rise>

          {ECS.sections.map((s) => (
            <section key={s.key} className="flex flex-col gap-3 border-t border-hairline pt-8">
              <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
                {s.heading}
              </h2>
              <Rise className="text-body-m-m md:text-body-l text-secondary">{s.body}</Rise>
            </section>
          ))}

          {/* The endocannabinoids: made by the body, not the plant. */}
          <section className="flex flex-col gap-3 border-t border-hairline pt-8">
            <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
              The endocannabinoids
            </h2>
            <p className="text-body-m-m md:text-body-l text-secondary">
              These are the cannabinoids the body makes for itself. They sit here rather than in the
              cannabinoid index because the plant does not produce them.
            </p>
            <ul className="border-t border-hairline">
              {ECS.endocannabinoids.map((e) => (
                <li
                  key={e.symbol}
                  className="grid grid-cols-1 gap-1 border-b border-hairline py-4 md:grid-cols-[7rem_1fr] md:gap-6"
                >
                  <span className="font-mono text-data uppercase tracking-specimen text-primary">
                    {e.symbol}
                  </span>
                  <span className="text-body-m-m md:text-body-m text-secondary">
                    {e.name}. {e.note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              SOURCES CITATION PENDING
            </p>
          </section>

          {/* References */}
          <section className="mt-6 border-t border-hairline pt-8">
            <h2 className="mb-4 font-mono text-specimen uppercase tracking-specimen text-tertiary">
              References
            </h2>
            <ol className="flex flex-col gap-3">
              {ECS.sources.map((s, i) => (
                <li key={i} id={`ref-${i + 1}`} className="flex gap-3 text-body-m-m md:text-body-m text-secondary">
                  <span className="font-mono text-specimen text-tertiary">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}
