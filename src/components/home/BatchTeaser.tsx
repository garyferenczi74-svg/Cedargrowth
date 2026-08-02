import { ArrowRight } from 'lucide-react';

// Inline batch lookup on the home transparency band (Section 6.1 Block 6).
// The field is intentionally disabled: no batch has published yet, so it
// never accepts input, submits, or navigates to a lookup that would 404.
// The full lookup lives on /transparency once a batch is published.

export function BatchTeaser() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 border-b border-hairline-inverse pb-2">
        <label htmlFor="home-batch" className="sr-only">
          Batch number
        </label>
        <input
          id="home-batch"
          name="batch"
          disabled
          placeholder="BATCH ID"
          autoComplete="off"
          className="flex-1 bg-transparent font-mono text-data uppercase tracking-specimen text-inverse placeholder:text-inverse/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        <ArrowRight
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
          className="text-inverse/50"
        />
      </div>
      <p className="text-caption-m md:text-caption text-inverse/70">
        Batch lookup opens with the first published batch.
      </p>
    </div>
  );
}
