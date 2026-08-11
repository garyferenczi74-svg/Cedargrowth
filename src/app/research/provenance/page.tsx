import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { Rise } from '@/components/motion/Rise';
import { LineReveal } from '@/components/motion/LineReveal';
import { CANNABINOIDS } from '@/content/research';
import {
  CANNABINOID_PROVENANCE,
  provenanceSummary,
  awaitingCitation,
  type ProvenanceTier,
} from '@/content/research-provenance';

export const metadata: Metadata = {
  title: 'How well we know each figure . CedarGrowth Research',
  description:
    'The provenance of every figure in the cannabinoid index: read from a primary paper, held from our reference guide, chemically derived, or not yet established. We show where each value stands rather than present them all as equal.',
};

const LAST_REVIEWED = '2026-08-11';

const TIER_LABEL: Record<ProvenanceTier, string> = {
  verified: 'Verified',
  guide: 'Held',
  derived: 'Derived',
  unknown: 'Unknown',
};

const TIER_CHIP: Record<ProvenanceTier, string> = {
  verified: 'text-pass border-pass',
  guide: 'text-attention border-attention',
  derived: 'text-cedar border-cedar',
  unknown: 'text-tertiary border-hairline',
};

const TIER_NOTE: Record<ProvenanceTier, string> = {
  verified: 'Read from a primary paper.',
  guide: 'Held from our reference guide, awaiting a primary source.',
  derived: 'Derived from a definitional relationship, awaiting a primary source.',
  unknown: 'Not yet established. Renders UNKNOWN.',
};

const TIER_ORDER: ProvenanceTier[] = ['verified', 'guide', 'derived', 'unknown'];

function TierChip({ tier }: { tier: ProvenanceTier }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-[2px] border px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen ${TIER_CHIP[tier]}`}
    >
      {TIER_LABEL[tier]}
    </span>
  );
}

export default function ProvenancePage() {
  const summary = provenanceSummary();
  const total = TIER_ORDER.reduce((n, t) => n + summary[t], 0);
  const awaiting = awaitingCitation().length;
  const compounds = CANNABINOIDS.filter((c) => CANNABINOID_PROVENANCE[c.key]);

  return (
    <section className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex max-w-editorial flex-col gap-6">
          <Eyebrow>DATA PROVENANCE</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            <LineReveal text="Every figure, and how well we know it." />
          </h1>
          <Rise delay={0.12} className="text-body-m-m md:text-body-l text-secondary">
            The cannabinoid index carries {total} figures across {compounds.length} compounds, and not
            every one stands on the same footing. Collapsing that distinction is how a reference quietly
            becomes unreliable, so we mark the provenance of each value: read from a primary paper, held
            from our reference guide while it awaits a primary, derived from a definitional relationship,
            or not yet established. This page shows where each one stands.
          </Rise>

          <dl className="mt-2 grid grid-cols-1 gap-3 border border-hairline bg-clinical p-6 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Figures</dt>
              <dd className="font-mono text-data text-primary">{total}</dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Awaiting a primary</dt>
              <dd className="font-mono text-data text-primary">{awaiting}</dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Last reviewed</dt>
              <dd className="font-mono text-data text-primary">{LAST_REVIEWED}</dd>
            </div>
          </dl>
        </div>

        {/* The four tiers. */}
        <div className="mt-12 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {TIER_ORDER.map((t) => (
            <div key={t} className="flex flex-col gap-2 bg-clinical p-6">
              <span className="font-mono text-data uppercase tracking-specimen">
                <span className={TIER_CHIP[t].split(' ')[0]}>{TIER_LABEL[t]}</span>
              </span>
              <span className="font-mono text-heading-s text-primary">{summary[t]}</span>
              <span className="text-caption-m md:text-caption text-tertiary">{TIER_NOTE[t]}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-editorial text-body-m-m md:text-body-m text-secondary">
          The verified figures are read from the primary literature. The comparative binding data for
          THC, THCV, THCB, THCP, and CBDP is from Citti 2019. Held and derived figures are chemically
          sound and still await a primary citation, and we show that rather than present them as settled.
        </p>

        {/* Per-compound provenance. */}
        <div className="mt-16 flex flex-col gap-12">
          {compounds.map((c) => {
            const points = CANNABINOID_PROVENANCE[c.key];
            return (
              <section key={c.key} aria-labelledby={`prov-${c.key}`}>
                <div className="mb-2 flex items-baseline gap-3 border-t border-primary pt-3">
                  <h2 id={`prov-${c.key}`} className="font-display text-heading-s-m md:text-heading-s text-primary">
                    {c.name}
                  </h2>
                  <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{c.abbr}</span>
                </div>
                <ul>
                  {points.map((p, i) => (
                    <li
                      key={`${c.key}-${i}`}
                      className="grid grid-cols-1 gap-1 border-b border-hairline py-3 md:grid-cols-[11rem_1fr_auto] md:items-baseline md:gap-6"
                    >
                      <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                        {p.datum}
                      </span>
                      <span className="text-body-m-m md:text-body-m text-primary">
                        {p.value ?? <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">UNKNOWN</span>}
                        {p.derivation ? (
                          <span className="font-mono text-specimen text-tertiary"> . {p.derivation}</span>
                        ) : null}
                      </span>
                      <TierChip tier={p.tier} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <p className="mt-16 max-w-editorial text-caption-m md:text-caption text-tertiary">
          Provenance is tracked per figure and reviewed as sources are confirmed. Evidence tiers for the
          compounds themselves are held separately and render on each entry in the cannabinoid index.
        </p>
      </div>
    </section>
  );
}
