import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Eyebrow } from '@/components/atoms/Eyebrow';
import { LineReveal } from '@/components/motion/LineReveal';
import { EvidenceChip } from '@/components/dna/EvidenceChip';
import { NOTES } from '@/content/research';

// The article template. Notes without supplied copy render as a shell in a
// visible COPY PENDING state rather than a hold page, because a reader who
// clicks into the library expects a document. No product link, no call to
// action, no newsletter prompt, no share control: an article ends with its
// references.

export function generateStaticParams() {
  return NOTES.filter((n) => !n.redirectTo).map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const note = NOTES.find((n) => n.slug === params.slug);
  if (!note) return {};
  return {
    title: `${note.title} . CedarGrowth Research`,
    description: note.abstract,
  };
}

export default function NotePage({ params }: { params: { slug: string } }) {
  const note = NOTES.find((n) => n.slug === params.slug);
  if (!note) notFound();
  if (note.redirectTo) redirect(note.redirectTo);

  return (
    <article className="bg-parchment py-16 md:py-24">
      <div className="mx-auto max-w-content px-page-margin-mobile md:px-page-margin">
        <div className="mx-auto flex max-w-[720px] flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-specimen text-tertiary">{note.date}</span>
            <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              {note.category}
            </span>
          </div>
          <h1 className="font-display text-display-l-m md:text-display-xl text-primary">
            <LineReveal text={note.title} />
          </h1>

          {/* Evidence header */}
          <dl className="grid grid-cols-1 gap-3 border border-hairline bg-clinical p-6 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Evidence
              </dt>
              <dd>
                {note.tier ? (
                  <EvidenceChip tier={note.tier} />
                ) : (
                  <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                    UNKNOWN
                  </span>
                )}
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Sources
              </dt>
              <dd className="font-mono text-data text-primary">
                {note.sources ? note.sources.length : 0}
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                Last reviewed
              </dt>
              <dd className="font-mono text-data text-primary">{note.date}</dd>
            </div>
          </dl>

          {/* Body */}
          <div className="border-t border-hairline pt-8">
            {note.body ? (
              <div className="text-body-m-m md:text-body-l text-secondary">{note.body}</div>
            ) : (
              <p className="font-mono text-data uppercase tracking-specimen text-tertiary">
                COPY PENDING
              </p>
            )}
          </div>

          {/* References */}
          <section className="mt-2 border-t border-hairline pt-8">
            <h2 className="mb-4 font-mono text-specimen uppercase tracking-specimen text-tertiary">
              References
            </h2>
            {note.sources && note.sources.length > 0 ? (
              <ol className="flex flex-col gap-3">
                {note.sources.map((s, i) => (
                  <li key={i} id={`ref-${i + 1}`} className="flex gap-3 text-body-m-m md:text-body-m text-secondary">
                    <span className="font-mono text-specimen text-tertiary">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
                CITATION PENDING
              </p>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}
