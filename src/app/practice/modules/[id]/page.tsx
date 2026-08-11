import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ModulePlayer } from '@/components/practice/ModulePlayer';
import { practiceMode, getPracticeStore } from '@/lib/practice/store';

export const metadata: Metadata = { title: 'Module', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

export default async function ModulePlayerPage({ params }: { params: { id: string } }) {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');

  const id = decodeURIComponent(params.id);
  const store = getPracticeStore();
  const modules = await store.listModules();
  const found = modules.find((m) => m.id === id);
  if (!found) notFound();

  // startAt would come from the person's saved progress once the store is
  // provisioned; here it starts at the first block.
  return <ModulePlayer module={found} startAt={0} />;
}
