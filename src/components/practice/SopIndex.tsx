'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DocStatus } from '@/lib/practice/types';
import { StatusChip } from '@/components/practice/DocElements';

export type SopRow = {
  documentId: string;
  number: string;
  title: string | null;
  version: string;
  status: DocStatus;
  effectiveDate: string | null;
  category: string | null;
};

type SortKey = 'number' | 'title' | 'version' | 'effectiveDate';

export function SopIndex({ rows, categories }: { rows: SopRow[]; categories: string[] }) {
  const [includeSuperseded, setIncludeSuperseded] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('number');
  const [asc, setAsc] = useState(true);

  // Default view: CURRENT only. The toggle adds superseded versions rather than
  // hiding them behind a hidden control.
  let shown = rows.filter((r) => (includeSuperseded ? true : r.status === 'CURRENT'));
  if (category) shown = shown.filter((r) => r.category === category);
  shown = shown.slice().sort((a, b) => {
    const av = (a[sort] ?? '') as string;
    const bv = (b[sort] ?? '') as string;
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return asc ? cmp : -cmp;
  });

  const setSortKey = (k: SortKey) => {
    if (k === sort) setAsc(!asc);
    else {
      setSort(k);
      setAsc(true);
    }
  };

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <th scope="col" className="py-3 pr-6 text-left">
      <button
        type="button"
        onClick={() => setSortKey(k)}
        className="font-mono text-specimen uppercase tracking-specimen text-tertiary hover:text-primary focus-visible:outline-cedar"
      >
        {label}
        {sort === k ? (asc ? ' up' : ' down') : ''}
      </button>
    </th>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 font-mono text-specimen uppercase tracking-specimen text-tertiary">
          <input
            type="checkbox"
            checked={includeSuperseded}
            onChange={(e) => setIncludeSuperseded(e.target.checked)}
          />
          Include superseded
        </label>
        <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Category</span>
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`rounded-[2px] border px-3 py-1 font-mono text-specimen uppercase tracking-specimen ${
            category === null ? 'border-primary text-primary' : 'border-hairline text-tertiary'
          }`}
        >
          ALL
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(category === c ? null : c)}
            aria-pressed={category === c}
            className={`rounded-[2px] border px-3 py-1 font-mono text-specimen uppercase tracking-specimen ${
              category === c ? 'border-primary text-primary' : 'border-hairline text-tertiary'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline">
              <Th k="number" label="Document" />
              <Th k="title" label="Title" />
              <Th k="version" label="Version" />
              <Th k="effectiveDate" label="Effective" />
              <th scope="col" className="py-3 text-left font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                  UNKNOWN
                </td>
              </tr>
            ) : (
              shown.map((r) => (
                <tr key={`${r.number}-${r.version}`} className="border-b border-hairline align-top">
                  <th scope="row" className="py-4 pr-6 font-mono text-data text-primary">
                    <Link
                      href={`/practice/procedures/${encodeURIComponent(r.number)}?version=${encodeURIComponent(r.version)}`}
                      className="hover:underline"
                    >
                      {r.number}
                    </Link>
                  </th>
                  <td className="py-4 pr-6 text-body-m-m md:text-body-m text-secondary">
                    {r.title ?? 'UNKNOWN'}
                  </td>
                  <td className="py-4 pr-6 font-mono text-data text-primary">{r.version}</td>
                  <td className="py-4 pr-6 font-mono text-data text-secondary">
                    {r.effectiveDate ?? 'UNKNOWN'}
                  </td>
                  <td className="py-4">
                    <StatusChip status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
