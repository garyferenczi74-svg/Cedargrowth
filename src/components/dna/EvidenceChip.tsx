import type { EvidenceTier } from '@/content/dna';

// The evidence tier chip is the only color on the DNA page. 1px border, no
// fill, 2px radius, mono uppercase. Never conveyed by color alone: the chip
// always carries its text label. Established green, Supported amber, Emerging
// grey. Literal class strings per tier so Tailwind keeps them through JIT.
const TIER_CLASS: Record<EvidenceTier, string> = {
  Established: 'text-pass border-pass',
  Supported: 'text-attention border-attention',
  Emerging: 'text-tertiary border-hairline',
};

export function EvidenceChip({ tier }: { tier: EvidenceTier }) {
  return (
    <span
      className={`inline-block rounded-[2px] border px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen ${TIER_CLASS[tier]}`}
    >
      {tier}
    </span>
  );
}
