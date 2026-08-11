import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { StatusChip } from '@/components/practice/DocElements';
import { practiceMode, getPracticeStore } from '@/lib/practice/store';
import { moduleIsAssignable, type Module } from '@/lib/practice/modules';

export const metadata: Metadata = { title: 'Module', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

function teachesLine(m: Module): string {
  if (m.teaches.kind === 'DOCUMENT') return `${m.teaches.documentNumber} v${m.teaches.version}`;
  if (m.teaches.kind === 'PENDING') return 'Document number pending';
  return 'No controlled document';
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{label}</span>
      <span className="font-mono text-data text-primary">{value ?? 'UNKNOWN'}</span>
    </div>
  );
}

function Gated({ text }: { text: string }) {
  return <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{text}</p>;
}

// The manager module detail: the builder shell. Block-based editing, reorder, and
// preview as an employee sees it, and publishing that requires a status change,
// an effective date, and a named approver, exactly as document control does. The
// write actions are gated until a person is signed in. No auto-publish path
// exists. APEX can produce a DRAFT outline from a document but cannot move a
// module past DRAFT; the attempt records in WARRANT.
export default async function ManagerModuleDetailPage({ params }: { params: { id: string } }) {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');

  const id = decodeURIComponent(params.id);
  const store = getPracticeStore();
  const [modules, versions] = await Promise.all([store.listModules(), store.listVersions()]);
  const found = modules.find((m) => m.id === id);
  if (!found) notFound();

  const assignable = moduleIsAssignable(found, versions);
  const teachesDoc = found.teaches.kind === 'DOCUMENT';

  return (
    <PracticeShell mode={mode} active="console">
      <div className="mx-auto flex max-w-[760px] flex-col gap-8">
        <Link
          href="/practice/console/modules"
          className="font-mono text-specimen uppercase tracking-specimen text-tertiary hover:text-primary"
        >
          MODULE LIBRARY
        </Link>

        {/* Control block, the same header document control carries. */}
        <div className="flex flex-col gap-6 border border-hairline bg-clinical p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-data uppercase tracking-specimen text-primary">{found.id}</span>
            <StatusChip status={found.status} />
            {found.source === 'EXTERNAL_PACKAGE' ? (
              <span className="rounded-[2px] border border-hairline px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen text-tertiary">
                External
              </span>
            ) : null}
          </div>
          <span className="font-display text-heading-s text-primary">{found.title ?? 'UNKNOWN'}</span>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Field label="Teaches" value={teachesLine(found)} />
            <Field label="Version" value={found.version} />
            <Field label="Effective" value={found.effectiveDate} />
            <Field label="Approved by" value={found.approvedByName} />
          </div>
          <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
            {assignable.ok ? 'ASSIGNABLE' : `NOT ASSIGNABLE. ${assignable.reason}`}
          </span>
        </div>

        {/* Blocks. Ordered content; reorder and edit are gated. */}
        <section className="flex flex-col gap-3 border-t border-hairline pt-6">
          <h2 className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Blocks</h2>
          {found.blocks.length === 0 ? (
            <Gated text="NO BLOCKS YET" />
          ) : (
            <ol className="flex flex-col gap-2">
              {found.blocks.map((b, i) => (
                <li key={b.id} className="flex items-center gap-3 border border-hairline p-3">
                  <span className="font-mono text-data text-tertiary">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-specimen uppercase tracking-specimen text-primary">{b.type}</span>
                </li>
              ))}
            </ol>
          )}
          <p className="text-body-m text-secondary">
            Add, edit, and reorder blocks in the builder. Available after sign in.
          </p>
          <Link
            href={`/practice/modules/${encodeURIComponent(found.id)}`}
            className="cg-btn min-h-[44px] self-start"
          >
            Preview as an employee
          </Link>
        </section>

        {/* Publish, exactly as document control does: a status change, an
            effective date, and a named approver. No auto-publish path. */}
        <section className="flex flex-col gap-3 border-t border-hairline pt-6">
          <h2 className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Publish</h2>
          <p className="text-body-m text-secondary">
            Publishing requires a status change, an effective date, and a named approver, recorded with
            a timestamp. There is no auto-publish path.
          </p>
          <Gated text="AVAILABLE AFTER SIGN IN" />
        </section>

        {/* Draft from document, the APEX action. DRAFT only. */}
        {teachesDoc ? (
          <section className="flex flex-col gap-3 border-t border-hairline pt-6">
            <h2 className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Draft from document</h2>
            <p className="text-body-m text-secondary">
              APEX can produce a module outline from {teachesLine(found)} as a DRAFT with proposed blocks
              and excerpt points. It is a draft and it says so. A human writes the final content and
              approves it. APEX cannot move a module past DRAFT, and the attempt is a blocked action
              recorded in WARRANT.
            </p>
            <Gated text="AVAILABLE AFTER SIGN IN" />
          </section>
        ) : null}

        <Link
          href={`/practice/modules/${encodeURIComponent(found.id)}/questions`}
          className="font-mono text-specimen uppercase tracking-specimen text-tertiary hover:text-primary"
        >
          QUESTIONS
        </Link>
      </div>
    </PracticeShell>
  );
}
