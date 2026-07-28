'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// Inline batch lookup on the home transparency band (Section 6.1 Block 6). It
// forwards the entered batch to the transparency page, where the full lookup
// and COA panel live. It never fabricates a result here.

export function BatchTeaser() {
  const router = useRouter();
  const [batch, setBatch] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const id = batch.trim();
        if (!id) return;
        router.push(`/transparency?batch=${encodeURIComponent(id)}`);
      }}
      className="flex items-center gap-3 border-b border-hairline-inverse pb-2"
    >
      <label htmlFor="home-batch" className="sr-only">
        Batch number
      </label>
      <input
        id="home-batch"
        name="batch"
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
        placeholder="BATCH ID"
        autoComplete="off"
        className="flex-1 bg-transparent font-mono text-data uppercase tracking-specimen text-inverse placeholder:text-inverse/50 focus-visible:outline-none"
      />
      <button
        type="submit"
        aria-label="Look up this batch"
        className="text-inverse"
      >
        <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </form>
  );
}
