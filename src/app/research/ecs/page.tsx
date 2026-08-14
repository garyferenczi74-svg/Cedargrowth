import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Rise } from '@/components/motion/Rise';
import { LineReveal } from '@/components/motion/LineReveal';
import { EvidenceChip } from '@/components/dna/EvidenceChip';
import { ECS, BATCH1_REFERENCES } from '@/content/research';

export const metadata: Metadata = {
  title: 'The endocannabinoid system . CedarGrowth Research',
  description:
    'The receptors a cannabinoid binds, the molecules the body makes to bind them, and the enzymes that clear them. Mechanism, at the level of the cell.',
};

// The endocannabinoid system primer (CG Prompt 11C), transcribed verbatim.
// Sections carry blocks: paragraphs (with optional superscript citation into the
// references block) and term lists. The four Batch 1 references are referenced
// by identifier from BATCH1_REFERENCES rather than duplicated here. Thin-line
// diagrams called for by 11C are omitted and reported rather than approximated.
export default function EcsPage() {
  return (
    <article className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="mx-auto flex max-w-[720px] flex-col gap-6">
          <Eyebrow>{ECS.eyebrow}</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            <LineReveal text={ECS.headline} />
          </h1>

          {/* Evidence header: evidence tier, source count, category. */}
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
                Category
              </dt>
              <dd className="font-mono text-data uppercase tracking-specimen text-primary">
                {ECS.category}
              </dd>
            </div>
          </dl>

          {ECS.intro.map((p, i) => (
            <Rise key={i} className="text-body-m-m md:text-body-l text-secondary">
              {p}
            </Rise>
          ))}

          {ECS.sections.map((s) => (
            <section key={s.key} className="flex flex-col gap-4 border-t border-hairline pt-8">
              <h2 className="font-display text-heading-m-m md:text-heading-m text-primary">
                {s.heading}
              </h2>
              {s.blocks.map((block, bi) => {
                if (block.kind === 'terms') {
                  return (
                    <dl key={bi} className="flex flex-col gap-3">
                      {block.items.map((item) => (
                        <div key={item.term} className="flex flex-col gap-1">
                          <dt className="font-mono text-specimen uppercase tracking-specimen text-primary">
                            {item.term}
                          </dt>
                          <dd className="text-body-m-m md:text-body-m text-secondary">
                            {item.text}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  );
                }
                return (
                  <Rise key={bi} className="text-body-m-m md:text-body-l text-secondary">
                    {block.text}
                    {block.cite ? (
                      <sup className="ml-0.5">
                        <a
                          href={`#ref-${block.cite}`}
                          className="cedar-underline font-mono text-specimen text-cedar"
                        >
                          {block.cite}
                        </a>
                      </sup>
                    ) : null}
                  </Rise>
                );
              })}
            </section>
          ))}

          {/* References, keyed by their Batch 1 identifier so the superscripts
              above resolve to them. */}
          <section className="mt-6 border-t border-hairline pt-8">
            <h2 className="mb-4 font-mono text-specimen uppercase tracking-specimen text-tertiary">
              References
            </h2>
            <ol className="flex flex-col gap-3">
              {ECS.sources.map((id) => (
                <li
                  key={id}
                  id={`ref-${id}`}
                  className="flex gap-3 scroll-mt-28 text-body-m-m md:text-body-m text-secondary"
                >
                  <span className="font-mono text-specimen text-tertiary">{id}</span>
                  <span>{BATCH1_REFERENCES[id]}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}
