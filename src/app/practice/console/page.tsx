import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { ConsoleViews, type ConsoleDoc } from '@/components/practice/ConsoleViews';
import { practiceMode, getPracticeStore } from '@/lib/practice/store';
import { computeDrift, currentVersion } from '@/lib/practice/documentControl';

export const metadata: Metadata = { title: 'Console', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

// The operations manager console. In live mode this route is reachable only by a
// manager or owner (enforced by the auth check and RLS). Drift is computed live;
// with no people or acknowledgments it is empty, and the out-of-date list shows
// NONE rather than a fabricated figure.
export default async function ConsolePage() {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');

  const store = getPracticeStore();
  const [documents, versions, persons, acks] = await Promise.all([
    store.listDocuments(),
    store.listVersions(),
    store.listPersons(),
    store.listAcknowledgments(),
  ]);

  const drift = computeDrift(persons, documents, versions, acks);

  const docs: ConsoleDoc[] = documents.map((d) => ({
    documentId: d.id,
    number: d.number,
    title: d.title,
    currentVersion: currentVersion(d.id, versions)?.version ?? null,
  }));

  return (
    <PracticeShell mode={mode} active="console">
      <div className="flex flex-col gap-8">
        <h1 className="font-display text-heading-m text-primary">Review console</h1>
        <ConsoleViews docs={docs} drift={drift} />
      </div>
    </PracticeShell>
  );
}
