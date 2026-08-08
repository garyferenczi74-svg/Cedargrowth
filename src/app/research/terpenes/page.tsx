import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Rise } from '@/components/motion/Rise';
import { LineReveal } from '@/components/motion/LineReveal';
import { CompoundIndex } from '@/components/research/CompoundIndex';
import { TERPENES, terpeneIndex } from '@/content/research';

export const metadata: Metadata = {
  title: 'The terpene index . CedarGrowth Research',
  description:
    'The aromatic compounds cannabis produces, their character and co-occurrence, and what the literature actually settles about them.',
};

export default function TerpeneIndexPage() {
  return (
    <section className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex max-w-editorial flex-col gap-6">
          <Eyebrow>{terpeneIndex.eyebrow}</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            <LineReveal text={terpeneIndex.headline} />
          </h1>
          {terpeneIndex.body.map((p, i) => (
            <Rise key={i} delay={0.08 + i * 0.04} className="text-body-m-m md:text-body-l text-secondary">
              {p}
            </Rise>
          ))}
        </div>

        <div className="mt-12">
          <CompoundIndex compounds={TERPENES} filters={terpeneIndex.filters} />
        </div>

        <p className="mt-10 max-w-editorial text-body-m-m md:text-body-m text-tertiary">
          {terpeneIndex.closing}
        </p>
      </div>
    </section>
  );
}
