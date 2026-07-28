'use client';

import { useId, useState, type ReactNode } from 'react';

// Canonical collapsible for the product detail page: the COA panel and the
// ingredients, packaging, storage, and warnings sections. A plain disclosure
// button with a hairline, a mono label, and a plus or minus marker. No chevron
// chrome. Fully keyboard operable, the region stays in the DOM and toggles
// hidden so the control always references a real element.

export function Accordion({
  title,
  children,
  defaultOpen = false,
  tone = 'light',
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  tone?: 'light' | 'inverse';
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const isInk = tone === 'inverse';

  return (
    <div className={isInk ? 'border-t border-hairline-inverse' : 'border-t border-hairline'}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span
          className={`font-mono text-specimen uppercase tracking-specimen ${isInk ? 'text-inverse' : 'text-primary'}`}
        >
          {title}
        </span>
        <span
          aria-hidden="true"
          className={`font-mono text-data ${isInk ? 'text-inverse/70' : 'text-tertiary'}`}
        >
          {open ? '-' : '+'}
        </span>
      </button>
      <div id={id} hidden={!open} className="pb-6">
        {children}
      </div>
    </div>
  );
}
