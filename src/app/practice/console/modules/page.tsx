import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { ModuleLibrary } from '@/components/practice/ModuleLibrary';
import { practiceMode, getPracticeStore } from '@/lib/practice/store';

export const metadata: Metadata = { title: 'Module library', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

// The manager module library. In live mode this route is reachable only by a
// manager or owner. Read-only overview; editing and publishing are on each
// module detail.
export default async function ManagerModulesPage() {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');

  const store = getPracticeStore();
  const [modules, versions] = await Promise.all([store.listModules(), store.listVersions()]);

  return (
    <PracticeShell mode={mode} active="console">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link
            href="/practice/console"
            className="font-mono text-specimen uppercase tracking-specimen text-tertiary hover:text-primary"
          >
            REVIEW CONSOLE
          </Link>
          <h1 className="font-display text-heading-m text-primary">Module library</h1>
          <p className="text-body-m md:text-body-l text-secondary">
            Every module, with the out-of-date list first. A module is out of date when the document it
            teaches has superseded, which is the drift computation applied to content. Open a module to
            edit its blocks and publish it.
          </p>
        </div>
        <ModuleLibrary modules={modules} versions={versions} />
      </div>
    </PracticeShell>
  );
}
