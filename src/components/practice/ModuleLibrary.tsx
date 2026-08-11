'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Module } from '@/lib/practice/modules';
import type { DocumentVersion, DocStatus } from '@/lib/practice/types';
import { moduleIsOutOfDate, moduleIsAssignable } from '@/lib/practice/modules';
import { StatusChip } from './DocElements';

// The manager module library (CG Prompt 09C Section 6). All modules, filterable
// by status and by the document taught, with the out-of-date list first: the
// drift computation applied to content rather than to people, so a module whose
// document superseded surfaces the same way an out-of-date person does. Read
// only; editing and publishing are on the module detail.

function teaches(m: Module): string {
  if (m.teaches.kind === 'DOCUMENT') return `${m.teaches.documentNumber} v${m.teaches.version}`;
  if (m.teaches.kind === 'PENDING') return 'Document number pending';
  return 'No controlled document';
}

const STATUS_FILTERS: ('ALL' | DocStatus)[] = ['ALL', 'DRAFT', 'IN_REVIEW', 'CURRENT', 'SUPERSEDED', 'WITHDRAWN'];

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-[2px] border px-3 py-1 font-mono text-specimen uppercase tracking-specimen transition-colors duration-hover ease-cedar focus-visible:outline-cedar ${
        on ? 'border-ink bg-ink text-bone' : 'border-secondary text-tertiary hover:border-ink hover:bg-ink hover:text-bone'
      }`}
    >
      {children}
    </button>
  );
}

function Row({ m, versions }: { m: Module; versions: DocumentVersion[] }) {
  const assignable = moduleIsAssignable(m, versions);
  const outOfDate = moduleIsOutOfDate(m, versions);
  return (
    <li className="border-b border-hairline py-5">
      <Link href={`/practice/console/modules/${encodeURIComponent(m.id)}`} className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-data uppercase tracking-specimen text-primary">{m.id}</span>
          <StatusChip status={m.status} />
          {outOfDate ? (
            <span className="rounded-[2px] border border-attention px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen text-attention">
              Out of date
            </span>
          ) : null}
          {m.source === 'EXTERNAL_PACKAGE' ? (
            <span className="rounded-[2px] border border-hairline px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen text-tertiary">
              External
            </span>
          ) : null}
        </div>
        <span className="font-display text-heading-s-m md:text-heading-s text-primary">{m.title ?? 'UNKNOWN'}</span>
        <span className="font-mono text-data text-secondary">{teaches(m)}</span>
        <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
          {assignable.ok ? 'ASSIGNABLE' : `NOT ASSIGNABLE. ${assignable.reason}`}
        </span>
      </Link>
    </li>
  );
}

export function ModuleLibrary({ modules, versions }: { modules: Module[]; versions: DocumentVersion[] }) {
  const [status, setStatus] = useState<'ALL' | DocStatus>('ALL');
  const [docFilter, setDocFilter] = useState<string>('ALL');

  const docOptions = ['ALL', ...Array.from(new Set(modules.map((m) => (m.teaches.kind === 'DOCUMENT' ? m.teaches.documentNumber : m.teaches.kind))))];

  const outOfDate = modules.filter((m) => moduleIsOutOfDate(m, versions));
  const shown = modules.filter((m) => {
    if (status !== 'ALL' && m.status !== status) return false;
    if (docFilter !== 'ALL') {
      const key = m.teaches.kind === 'DOCUMENT' ? m.teaches.documentNumber : m.teaches.kind;
      if (key !== docFilter) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Out of date first: the drift view applied to content. */}
      <section className="flex flex-col gap-3 border border-attention p-6">
        <h2 className="font-mono text-data uppercase tracking-specimen text-attention">
          Out of date because their document superseded
        </h2>
        {outOfDate.length === 0 ? (
          <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">NONE</p>
        ) : (
          <ul>{outOfDate.map((m) => <Row key={m.id} m={m} versions={versions} />)}</ul>
        )}
      </section>

      <div className="flex flex-col gap-3">
        <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Status</span>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <Chip key={s} on={status === s} onClick={() => setStatus(s)}>{s}</Chip>
          ))}
        </div>
        <span className="mt-2 font-mono text-specimen uppercase tracking-specimen text-tertiary">Document taught</span>
        <div className="flex flex-wrap gap-2">
          {docOptions.map((d) => (
            <Chip key={d} on={docFilter === d} onClick={() => setDocFilter(d)}>{d}</Chip>
          ))}
        </div>
      </div>

      <ul className="border-t border-hairline">
        {shown.length === 0 ? (
          <li className="py-5"><span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">NO MODULES MATCH</span></li>
        ) : (
          shown.map((m) => <Row key={m.id} m={m} versions={versions} />)
        )}
      </ul>
    </div>
  );
}
