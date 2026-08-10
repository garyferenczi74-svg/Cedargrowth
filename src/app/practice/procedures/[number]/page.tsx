import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { ControlBlock, SupersededBanner, StatusChip } from '@/components/practice/DocElements';
import { practiceMode, getPracticeStore } from '@/lib/practice/store';
import { currentVersion, versionHistory } from '@/lib/practice/documentControl';

export const metadata: Metadata = { title: 'Document', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

export default async function DocumentViewPage({
  params,
  searchParams,
}: {
  params: { number: string };
  searchParams: { version?: string };
}) {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');

  const number = decodeURIComponent(params.number);
  const store = getPracticeStore();
  const [documents, versions] = await Promise.all([store.listDocuments(), store.listVersions()]);
  const doc = documents.find((d) => d.number === number);
  if (!doc) notFound();

  const history = versionHistory(doc.id, versions);
  const current = currentVersion(doc.id, versions);
  const requested = searchParams.version
    ? history.find((v) => v.version === searchParams.version)
    : null;
  const version = requested ?? current ?? history[0];
  if (!version) notFound();

  const ackStatement = `I have read ${doc.number} version ${version.version} and I understand the procedure it describes.`;

  return (
    <PracticeShell mode={mode} active="procedures">
      <div className="mx-auto flex max-w-[760px] flex-col gap-8">
        {version.status === 'SUPERSEDED' ? (
          <SupersededBanner supersedingNumber={current ? doc.number : null} />
        ) : null}

        <ControlBlock document={doc} version={version} />

        {/* Document body. The reading treatment renders from content_ref when a
            source is attached; none is supplied here, so it renders UNKNOWN
            rather than inventing procedure text. */}
        <section className="border-t border-hairline pt-8">
          <p className="font-mono text-data uppercase tracking-specimen text-tertiary">
            DOCUMENT BODY UNKNOWN, PENDING SOURCE
          </p>
        </section>

        {/* Acknowledgment, bound to this exact version. */}
        {doc.requiresAck ? (
          <section className="flex flex-col gap-3 border-t border-hairline pt-8">
            <h2 className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              Acknowledgment
            </h2>
            <p className="text-body-m-m md:text-body-m text-secondary">{ackStatement}</p>
            <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              {version.status === 'CURRENT'
                ? 'AVAILABLE AFTER SIGN IN'
                : 'SUPERSEDED VERSION, NOT ACKNOWLEDGEABLE'}
            </p>
          </section>
        ) : null}

        {/* Version history. Nothing is deleted. */}
        <section className="flex flex-col gap-3 border-t border-hairline pt-8">
          <h2 className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
            Version history
          </h2>
          <ul className="border-t border-hairline">
            {history.map((v) => (
              <li
                key={v.id}
                className="grid grid-cols-1 gap-2 border-b border-hairline py-4 md:grid-cols-[6rem_9rem_1fr_auto] md:items-center md:gap-6"
              >
                <span className="font-mono text-data text-primary">{v.version}</span>
                <span className="font-mono text-data text-secondary">
                  {v.effectiveDate ?? 'UNKNOWN'}
                </span>
                <span className="font-mono text-data text-secondary">
                  {v.approvedByName ?? 'UNKNOWN'}
                </span>
                <StatusChip status={v.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PracticeShell>
  );
}
