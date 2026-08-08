import type { Domain } from '@/content/dna';
import { Resolve } from '@/components/motion/Resolve';
import { EvidenceChip } from '@/components/dna/EvidenceChip';

// A real table, hairlines, no cards. Columns: MARKER, GOVERNS, INFORMS,
// EVIDENCE, SOURCES. Every unsupplied cell renders honestly: governs/informs/
// evidence as UNKNOWN, citations as CITATION PENDING. Nothing is authored here.
// Resolve runs on the first marker symbol only (at most once per domain); a
// gene symbol is a legitimate readout. It never runs on a result or a tier.

function Pending({ text }: { text: string }) {
  return (
    <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
      {text}
    </span>
  );
}

function Sources({ citations }: { citations: number[] | null }) {
  if (!citations || citations.length === 0) return <Pending text="CITATION PENDING" />;
  return (
    <span className="font-mono text-specimen text-secondary">
      {citations.map((n, i) => (
        <span key={n}>
          {i > 0 ? ' ' : ''}
          <a href={`#ref-${n}`} aria-label={`Reference ${n}`} className="cedar-underline">
            <sup>{n}</sup>
          </a>
        </span>
      ))}
    </span>
  );
}

export function MarkerTable({ domain }: { domain: Domain }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{domain.title} markers</caption>
        <thead>
          <tr className="border-b border-hairline">
            {['Marker', 'Governs', 'Informs', 'Evidence', 'Sources'].map((h) => (
              <th
                key={h}
                scope="col"
                className="py-3 pr-6 align-bottom font-mono text-specimen uppercase tracking-specimen text-tertiary"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domain.markers.map((m, i) => (
            <tr key={m.symbol} className="border-b border-hairline align-top">
              <th
                scope="row"
                className="py-4 pr-6 font-mono text-data uppercase tracking-specimen text-primary"
              >
                {i === 0 ? <Resolve text={m.symbol} /> : m.symbol}
              </th>
              <td className="py-4 pr-6 text-body-m-m md:text-body-m text-secondary">
                {m.governs ?? <Pending text="UNKNOWN" />}
              </td>
              <td className="py-4 pr-6 text-body-m-m md:text-body-m text-secondary">
                {m.informs ?? <Pending text="UNKNOWN" />}
              </td>
              <td className="py-4 pr-6">
                {m.tier ? <EvidenceChip tier={m.tier} /> : <Pending text="UNKNOWN" />}
              </td>
              <td className="py-4">
                <Sources citations={m.citations} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
