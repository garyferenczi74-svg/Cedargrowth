import type { Standing } from '@/lib/practice/recognition';

// The recognition panel (CG Prompt 09C Amendment One Section 5). Four lines,
// above Due now, hairline separated, no card, no color beyond the status chip.
// It is presentation over the record: it displays computed state and never
// writes. Values render UNKNOWN where there is no record to compute from, which
// in preview is all of them, because there is no signed-in person and no history.
// There is deliberately no time-to-complete figure and no comparison to any other
// person.

const STANDING_CLASS: Record<Standing, string> = {
  CURRENT: 'text-pass border-pass',
  APPROACHING: 'text-attention border-attention',
  BEHIND: 'text-fail border-fail',
};

function StandingChip({ standing }: { standing: Standing }) {
  return (
    <span
      className={`inline-block rounded-[2px] border px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen ${STANDING_CLASS[standing]}`}
    >
      {standing}
    </span>
  );
}

function Unk() {
  return <span className="text-tertiary">UNKNOWN</span>;
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline py-3 last:border-b-0">
      <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{label}</span>
      <span className="font-mono text-data text-primary">{children}</span>
    </div>
  );
}

export function RecognitionPanel({
  standing,
  credentialsCurrent,
  facilityCurrencyPercent,
  zeroGapDays,
  questionsAsked,
  ledToSopRevision,
}: {
  standing: Standing | null;
  credentialsCurrent: number | null;
  facilityCurrencyPercent: number | null;
  zeroGapDays: number | null;
  questionsAsked: number | null;
  ledToSopRevision: number | null;
}) {
  return (
    <div className="border-t-2 border-calm pt-2">
      <Line label="Standing">{standing ? <StandingChip standing={standing} /> : <Unk />}</Line>
      <Line label="Credentials">
        {credentialsCurrent === null ? <Unk /> : `${credentialsCurrent} current`}
      </Line>
      <Line label="Facility currency">
        {facilityCurrencyPercent === null ? <Unk /> : `${facilityCurrencyPercent} percent`}
        {' . '}
        {zeroGapDays === null ? <Unk /> : `${zeroGapDays} zero-gap days`}
      </Line>
      <Line label="Questions asked">
        {questionsAsked === null ? <Unk /> : questionsAsked}
        {' . '}
        {ledToSopRevision === null ? <Unk /> : `${ledToSopRevision} led to an SOP revision`}
      </Line>
    </div>
  );
}
