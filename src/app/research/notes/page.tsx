import type { Metadata } from 'next';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { LineReveal } from '@/components/motion/LineReveal';
import { NotesList } from '@/components/research/NotesList';
import { NOTES, NOTE_CATEGORIES } from '@/content/research';

export const metadata: Metadata = {
  title: 'Research notes . CedarGrowth Research',
  description: 'Notes from the CedarGrowth research library. Every note carries its evidence and its sources.',
};

const notes = [...NOTES].sort((a, b) => (a.date < b.date ? 1 : -1));

export default function NotesIndexPage() {
  return (
    <section className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="flex max-w-editorial flex-col gap-6">
          <Eyebrow>Research notes</Eyebrow>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            <LineReveal text="The notes." />
          </h1>
        </div>
        <div className="mt-12">
          <NotesList notes={notes} categories={NOTE_CATEGORIES} />
        </div>
      </div>
    </section>
  );
}
