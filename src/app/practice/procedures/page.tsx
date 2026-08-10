import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { SopIndex, type SopRow } from '@/components/practice/SopIndex';
import { practiceMode, getPracticeStore } from '@/lib/practice/store';

export const metadata: Metadata = { title: 'Procedures', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

export default async function ProceduresPage() {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');

  const store = getPracticeStore();
  const [documents, versions] = await Promise.all([store.listDocuments(), store.listVersions()]);
  const byId = new Map(documents.map((d) => [d.id, d]));

  const rows: SopRow[] = versions
    .map((v) => {
      const doc = byId.get(v.documentId);
      if (!doc) return null;
      return {
        documentId: doc.id,
        number: doc.number,
        title: doc.title,
        version: v.version,
        status: v.status,
        effectiveDate: v.effectiveDate,
        category: doc.category,
      };
    })
    .filter((r): r is SopRow => r !== null);

  const categories = Array.from(
    new Set(documents.map((d) => d.category).filter((c): c is string => Boolean(c))),
  );

  return (
    <PracticeShell mode={mode} active="procedures">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-heading-m text-primary">Procedures</h1>
          <p className="max-w-editorial text-body-m-m md:text-body-m text-secondary">
            The controlled document library. One version is current; prior versions are retained as
            superseded, never deleted, and cannot be opened without their status shown.
          </p>
        </div>
        <SopIndex rows={rows} categories={categories} />
      </div>
    </PracticeShell>
  );
}
