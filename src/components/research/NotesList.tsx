'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Note, NoteCategory } from '@/content/research';

// The full notes index with category filter chips. No search until there are
// more than twenty notes. One row per note: date, category, title, one abstract.

export function NotesList({
  notes,
  categories,
}: {
  notes: Note[];
  categories: NoteCategory[];
}) {
  const [active, setActive] = useState<NoteCategory | null>(null);
  const shown = active ? notes.filter((n) => n.category === active) : notes;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter notes by category">
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={`rounded-[2px] border px-3 py-1 font-mono text-specimen uppercase tracking-specimen transition-colors duration-hover ease-cedar focus-visible:outline-cedar ${
            active === null ? 'border-ink bg-ink text-bone' : 'border-secondary text-tertiary hover:border-ink hover:bg-ink hover:text-bone'
          }`}
        >
          ALL
        </button>
        {categories.map((c) => {
          const on = active === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(on ? null : c)}
              aria-pressed={on}
              className={`rounded-[2px] border px-3 py-1 font-mono text-specimen uppercase tracking-specimen transition-colors duration-hover ease-cedar focus-visible:outline-cedar ${
                on ? 'border-ink bg-ink text-bone' : 'border-secondary text-tertiary hover:border-ink hover:bg-ink hover:text-bone'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <ul className="border-t border-hairline">
        {shown.map((note) => (
          <li key={note.slug}>
            <Link
              href={note.redirectTo ?? `/research/notes/${note.slug}`}
              className="grid grid-cols-1 gap-2 border-b border-hairline py-6 md:grid-cols-[8rem_7rem_1fr] md:gap-6"
            >
              <span className="font-mono text-specimen text-tertiary">{note.date}</span>
              <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                {note.category}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-heading-s-m md:text-heading-s text-primary">
                  {note.title}
                </span>
                <span className="text-body-m-m md:text-body-m text-secondary">{note.abstract}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
