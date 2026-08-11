import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Rise } from '@/components/motion/Rise';
import { LineReveal } from '@/components/motion/LineReveal';
import { CompoundIndex } from '@/components/research/CompoundIndex';
import { CANNABINOIDS, cannabinoidIndex } from '@/content/research';

export const metadata: Metadata = {
  title: 'The cannabinoid index . CedarGrowth Research',
  description:
    'The cannabinoids, their chemistry, receptor behavior, and how each survives extraction. Chemistry and mechanism, with sources.',
};

export default function CannabinoidIndexPage() {
  return (
    <section className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex max-w-editorial flex-col gap-6">
          <Eyebrow>{cannabinoidIndex.eyebrow}</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            <LineReveal text={cannabinoidIndex.headline} />
          </h1>
          <Rise delay={0.12} className="text-body-m-m md:text-body-l text-secondary">
            {cannabinoidIndex.body}
          </Rise>
          <Link
            href="/research/provenance"
            className="cedar-underline w-fit font-mono text-specimen uppercase tracking-specimen text-primary"
          >
            See how well we know each figure
          </Link>
        </div>

        <div className="mt-12">
          <CompoundIndex
            compounds={CANNABINOIDS}
            filters={cannabinoidIndex.filters}
            groups={cannabinoidIndex.groups}
          />
        </div>
      </div>
    </section>
  );
}
