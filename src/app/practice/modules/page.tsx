import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { StatusChip } from '@/components/practice/DocElements';
import { practiceMode, getPracticeStore } from '@/lib/practice/store';
import { moduleIsAssignable, type Module } from '@/lib/practice/modules';

export const metadata: Metadata = { title: 'Modules', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

function teaches(m: Module): string {
  if (m.teaches.kind === 'DOCUMENT') return `${m.teaches.documentNumber} v${m.teaches.version}`;
  if (m.teaches.kind === 'PENDING') return 'Document number pending';
  return 'No controlled document';
}

export default async function ModulesPage() {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');

  const store = getPracticeStore();
  const [modules, versions] = await Promise.all([store.listModules(), store.listVersions()]);

  return (
    <PracticeShell mode={mode} active="modules">
      <div className="mx-auto flex max-w-[760px] flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-heading-m text-primary">Training modules</h1>
          <p className="text-body-m md:text-body-l text-secondary">
            Every module teaches a controlled document version, or nothing. A module teaching a
            superseded version cannot be assigned, and no module is assignable until a named human
            approves it. External modules are marked, because only CedarGrowth procedure is the thing
            you are assessed against.
          </p>
        </div>

        {modules.length === 0 ? (
          <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">NO MODULES</p>
        ) : (
          <ul className="border-t border-hairline">
            {modules.map((m) => {
              const assignable = moduleIsAssignable(m, versions);
              return (
                <li key={m.id} className="border-b border-hairline py-5">
                  <Link
                    href={`/practice/modules/${encodeURIComponent(m.id)}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-data uppercase tracking-specimen text-primary">
                        {m.id}
                      </span>
                      <StatusChip status={m.status} />
                      {m.source === 'EXTERNAL_PACKAGE' ? (
                        <span className="rounded-[2px] border border-hairline px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                          External
                        </span>
                      ) : null}
                    </div>
                    <span className="font-display text-heading-s-m md:text-heading-s text-primary">
                      {m.title ?? 'UNKNOWN'}
                    </span>
                    <span className="font-mono text-data text-secondary">{teaches(m)}</span>
                    <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                      {assignable.ok ? 'ASSIGNABLE' : `NOT ASSIGNABLE. ${assignable.reason}`}
                    </span>
                  </Link>
                  <Link
                    href={`/practice/modules/${encodeURIComponent(m.id)}/questions`}
                    className="mt-3 inline-block font-mono text-specimen uppercase tracking-specimen text-tertiary hover:text-primary"
                  >
                    QUESTIONS
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PracticeShell>
  );
}
