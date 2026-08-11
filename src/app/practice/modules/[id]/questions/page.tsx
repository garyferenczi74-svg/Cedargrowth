import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { QuestionThread } from '@/components/practice/QuestionThread';
import { practiceMode, getPracticeStore } from '@/lib/practice/store';
import type { Module } from '@/lib/practice/modules';

export const metadata: Metadata = { title: 'Module questions', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

function teachesLine(m: Module): string {
  if (m.teaches.kind === 'DOCUMENT') return `${m.teaches.documentNumber} v${m.teaches.version}`;
  if (m.teaches.kind === 'PENDING') return 'a document number pending';
  return 'no controlled document';
}

export default async function ModuleQuestionsPage({ params }: { params: { id: string } }) {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');

  const id = decodeURIComponent(params.id);
  const store = getPracticeStore();
  const [modules, questions, replies] = await Promise.all([
    store.listModules(),
    store.listQuestions(),
    store.listReplies(),
  ]);
  const found = modules.find((m) => m.id === id);
  if (!found) notFound();

  const moduleQuestions = questions.filter((q) => q.moduleId === id);

  return (
    <PracticeShell mode={mode} active="modules">
      <div className="mx-auto flex max-w-[720px] flex-col gap-6">
        <Link
          href={`/practice/modules/${encodeURIComponent(id)}`}
          className="font-mono text-specimen uppercase tracking-specimen text-tertiary hover:text-primary"
        >
          {found.id} . {found.title ?? 'UNKNOWN'}
        </Link>
        <QuestionThread
          teaches={teachesLine(found)}
          questions={moduleQuestions}
          replies={replies}
          mode={mode}
        />
      </div>
    </PracticeShell>
  );
}
