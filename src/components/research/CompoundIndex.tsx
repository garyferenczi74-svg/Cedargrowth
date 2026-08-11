'use client';

import { useEffect, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Compound } from '@/content/research';
import { EvidenceChip } from '@/components/dna/EvidenceChip';

// One index for both compound pillars (terpenes and cannabinoids). Each entry
// is a real disclosure: a button with aria-expanded controlling a region with
// aria-controls, keyboard operable, focus visible, and in the tab order. The
// collapsed row is useful on its own. Multiple drawers may be open at once, and
// every entry is addressable by URL fragment so a compound can be cited.

type Filter = { key: string; label: string };
type Group = { key: string; label: string; band: string; note?: string };

function Pending({ text }: { text: string }) {
  return (
    <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{text}</span>
  );
}

function Drawer({ compound, open, regionId }: { compound: Compound; open: boolean; regionId: string }) {
  return (
    <div
      id={regionId}
      role="region"
      hidden={!open}
      className={`grid transition-[grid-template-rows] duration-[480ms] ease-cedar motion-reduce:transition-none ${
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        <dl
          className={`flex flex-col gap-4 pb-8 pt-2 transition-opacity duration-[240ms] ease-cedar motion-reduce:transition-none ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {compound.fields.map((f) => (
            <div key={f.label} className="grid grid-cols-1 gap-1 border-t border-hairline pt-3 md:grid-cols-[10rem_1fr] md:gap-6">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                {f.label}
              </dt>
              <dd className="text-body-m-m md:text-body-m text-secondary">
                {f.value ?? <Pending text="UNKNOWN" />}
              </dd>
            </div>
          ))}
          <div className="grid grid-cols-1 gap-1 border-t border-hairline pt-3 md:grid-cols-[10rem_1fr] md:gap-6">
            <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              Evidence
            </dt>
            <dd>{compound.tier ? <EvidenceChip tier={compound.tier} /> : <Pending text="UNKNOWN" />}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 border-t border-hairline pt-3 md:grid-cols-[10rem_1fr] md:gap-6">
            <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              Sources
            </dt>
            <dd className="text-body-m-m md:text-body-m text-secondary">
              {compound.sources && compound.sources.length > 0 ? (
                <ol className="flex flex-col gap-2">
                  {compound.sources.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-specimen text-tertiary">{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <Pending text="CITATION PENDING" />
              )}
            </dd>
          </div>
          {compound.clinical ? (
            <div className="grid grid-cols-1 gap-1 border-t border-hairline pt-3 md:grid-cols-[10rem_1fr] md:gap-6">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Clinical
              </dt>
              <dd className="text-body-m-m md:text-body-m text-secondary">
                {compound.clinical.references} references across {compound.clinical.indications}{' '}
                indications. Available to registered practitioners.
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}

function Entry({
  compound,
  open,
  onToggle,
  baseId,
}: {
  compound: Compound;
  open: boolean;
  onToggle: () => void;
  baseId: string;
}) {
  const regionId = `${baseId}-${compound.key}`;
  return (
    <div id={compound.key} className="scroll-mt-28 border-b border-hairline">
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={regionId}
          className="flex w-full items-center gap-4 py-5 text-left transition-colors duration-hover ease-cedar hover:bg-bone focus-visible:outline-cedar"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
            <span className="flex items-baseline gap-2">
              <span className="font-display text-heading-s-m md:text-heading-s text-primary">
                {compound.name}
              </span>
              {compound.abbr ? (
                <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                  {compound.abbr}
                </span>
              ) : null}
            </span>
            <span className="text-body-m-m md:text-body-m text-secondary md:flex-1">
              {compound.summary}
            </span>
          </span>
          {compound.tier ? <EvidenceChip tier={compound.tier} /> : null}
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className={`shrink-0 transition-transform duration-[240ms] ease-cedar motion-reduce:transition-none ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      </h3>
      <Drawer compound={compound} open={open} regionId={regionId} />
    </div>
  );
}

export function CompoundIndex({
  compounds,
  filters,
  groups,
}: {
  compounds: Compound[];
  filters: Filter[];
  groups?: Group[];
}) {
  const baseId = useId();
  const [active, setActive] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Landing on a fragment opens that drawer and scrolls to it.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && compounds.some((c) => c.key === hash)) {
      setOpenKeys((k) => (k.includes(hash) ? k : [...k, hash]));
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ block: 'start' });
    }
  }, [compounds]);

  const toggleFilter = (key: string) =>
    setActive((a) => (a.includes(key) ? a.filter((x) => x !== key) : [...a, key]));
  const toggleOpen = (key: string) =>
    setOpenKeys((k) => (k.includes(key) ? k.filter((x) => x !== key) : [...k, key]));

  // Filters compose: a compound must carry every active tag.
  const shown = compounds.filter((c) => active.every((t) => c.tags.includes(t)));

  const renderEntry = (c: Compound) => (
    <Entry
      key={c.key}
      compound={c}
      open={openKeys.includes(c.key)}
      onToggle={() => toggleOpen(c.key)}
      baseId={baseId}
    />
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter compounds">
        {filters.map((f) => {
          const on = active.includes(f.key);
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => toggleFilter(f.key)}
              aria-pressed={on}
              className={`rounded-[2px] border px-3 py-1 font-mono text-specimen uppercase tracking-specimen transition-colors duration-hover ease-cedar focus-visible:outline-cedar ${
                on
                  ? 'border-ink bg-ink text-bone'
                  : 'border-secondary text-tertiary hover:border-ink hover:bg-ink hover:text-bone'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {groups && groups.length > 0 ? (
        <div className="flex flex-col gap-12">
          {groups.map((g) => {
            const rows = shown.filter((c) => c.tags.includes(g.key));
            if (rows.length === 0) return null;
            return (
              <section key={g.key} aria-labelledby={`${baseId}-grp-${g.key}`}>
                <div className="mb-2 border-t border-primary pt-3">
                  <h2
                    id={`${baseId}-grp-${g.key}`}
                    className="font-mono text-data uppercase tracking-specimen text-primary"
                  >
                    {g.label}
                  </h2>
                  <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                    {g.band}
                  </p>
                  {g.note ? (
                    <p className="mt-3 max-w-editorial text-body-m-m md:text-body-m text-secondary">
                      {g.note}
                    </p>
                  ) : null}
                </div>
                <div>{rows.map(renderEntry)}</div>
              </section>
            );
          })}
        </div>
      ) : (
        <div>{shown.map(renderEntry)}</div>
      )}
    </div>
  );
}
