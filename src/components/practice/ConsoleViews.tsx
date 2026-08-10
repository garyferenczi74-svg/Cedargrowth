'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DriftEntry } from '@/lib/practice/types';
import { ROLES } from '@/lib/practice/types';

export type ConsoleDoc = {
  documentId: string;
  number: string;
  title: string | null;
  currentVersion: string | null;
};

type View = 'overview' | 'people' | 'assignments' | 'documents' | 'access' | 'reports';

const VIEWS: { key: View; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'people', label: 'People' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'documents', label: 'Documents' },
  { key: 'access', label: 'Access log' },
  { key: 'reports', label: 'Reports' },
];

function Empty({ text }: { text: string }) {
  return <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{text}</p>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-hairline pt-6">
      <h3 className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{title}</h3>
      {children}
    </section>
  );
}

export function ConsoleViews({ docs, drift }: { docs: ConsoleDoc[]; drift: DriftEntry[] }) {
  const [view, setView] = useState<View>('overview');

  return (
    <div className="flex flex-col gap-8">
      <nav className="flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            aria-pressed={view === v.key}
            className={`rounded-[2px] border px-3 py-1 font-mono text-specimen uppercase tracking-specimen ${
              view === v.key ? 'border-primary text-primary' : 'border-hairline text-tertiary hover:border-primary'
            }`}
          >
            {v.label}
          </button>
        ))}
      </nav>

      {view === 'overview' ? (
        <div className="flex flex-col gap-8">
          {/* Out of date on current procedure: first and largest. It does not
              collapse or hide. */}
          <section className="flex flex-col gap-3 border border-attention p-6">
            <h3 className="font-mono text-data uppercase tracking-specimen text-attention">
              Out of date on current procedure
            </h3>
            {drift.length === 0 ? (
              <Empty text="NONE" />
            ) : (
              <ul className="flex flex-col gap-2">
                {drift.map((d, i) => (
                  <li key={i} className="font-mono text-data text-primary">
                    {d.personName ?? 'UNKNOWN'} . {d.documentNumber} . acknowledged v
                    {d.acknowledgedVersion} . current v{d.currentVersion}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <Panel title="Overdue assignments">
            <Empty text="UNKNOWN" />
          </Panel>
          <Panel title="Upcoming expiries, next thirty days">
            <Empty text="UNKNOWN" />
          </Panel>
          <Panel title="Recent sign-in activity">
            <Empty text="UNKNOWN" />
          </Panel>
        </div>
      ) : null}

      {view === 'people' ? (
        <Panel title="People">
          <Empty text="NO PEOPLE" />
          <p className="text-body-m-m md:text-body-m text-secondary">
            One row per person: role, assignments outstanding, oldest overdue item, last sign-in. A
            row opens their full record, identical to the record they see themselves.
          </p>
        </Panel>
      ) : null}

      {view === 'assignments' ? (
        <Panel title="Assignments">
          <Empty text="AVAILABLE AFTER SIGN IN" />
          <p className="text-body-m-m md:text-body-m text-secondary">
            Assign a document to a person, a role, or everyone, with a due date and a required
            reason. Every assignment is auditable and names who assigned it.
          </p>
        </Panel>
      ) : null}

      {view === 'documents' ? (
        <Panel title="Documents">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline">
                  {['Document', 'Title', 'Current version'].map((h) => (
                    <th key={h} scope="col" className="py-3 pr-6 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.documentId} className="border-b border-hairline">
                    <th scope="row" className="py-4 pr-6 font-mono text-data text-primary">
                      <Link href={`/practice/procedures/${encodeURIComponent(d.number)}`} className="hover:underline">
                        {d.number}
                      </Link>
                    </th>
                    <td className="py-4 pr-6 text-body-m-m md:text-body-m text-secondary">
                      {d.title ?? 'UNKNOWN'}
                    </td>
                    <td className="py-4 font-mono text-data text-primary">
                      {d.currentVersion ?? 'UNKNOWN'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-body-m-m md:text-body-m text-secondary">
            Publishing a new current version requires an explicit confirmation stating how many
            people it will put out of date, shown at the moment of the decision.
          </p>
        </Panel>
      ) : null}

      {view === 'access' ? (
        <div className="flex flex-col gap-3">
          <Panel title="Access log">
            <Empty text="UNKNOWN" />
          </Panel>
          <p className="text-caption-m md:text-caption text-tertiary">
            This log records access to the system and to controlled documents. It is not a record of
            activity outside this system.
          </p>
        </div>
      ) : null}

      {view === 'reports' ? (
        <Panel title="Training matrix">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline">
                  <th scope="col" className="py-3 pr-6 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                    Role
                  </th>
                  {docs.map((d) => (
                    <th key={d.documentId} scope="col" className="py-3 pr-6 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                      {d.number}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r) => (
                  <tr key={r.key} className="border-b border-hairline">
                    <th scope="row" className="py-4 pr-6 font-mono text-specimen uppercase tracking-specimen text-primary">
                      {r.label}
                    </th>
                    {docs.map((d) => (
                      <td key={d.documentId} className="py-4 pr-6 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                        UNKNOWN
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-body-m-m md:text-body-m text-secondary">
            One export produces the audit answer: every person, every controlled document, the
            version acknowledged, and the date. The export is timestamped and written to the audit
            log. Available after sign-in.
          </p>
        </Panel>
      ) : null}
    </div>
  );
}
