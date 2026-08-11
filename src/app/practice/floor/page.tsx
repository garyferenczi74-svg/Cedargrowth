import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { RecognitionPanel } from '@/components/practice/RecognitionPanel';
import { practiceMode, hasPracticeSession } from '@/lib/practice/store';

export const metadata: Metadata = { title: 'Floor', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-hairline pt-8">
      <h2 className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{text}</p>;
}

// The employee floor. In live mode it renders the signed-in person's own record;
// in preview there is no person, so the sections render their empty states. No
// fabricated assignments or completions.
export default async function FloorPage() {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');
  if (mode === 'live' && !hasPracticeSession()) redirect('/practice/signin');

  return (
    <PracticeShell mode={mode} active="floor">
      <div className="flex flex-col gap-10">
        <h1 className="font-display text-heading-m text-primary">Your floor</h1>

        {/* Recognition panel: the four-line standing view, above Due now. It is
            computed from the training record and writes nothing. In preview there
            is no signed-in person and no history, so every figure is UNKNOWN; the
            values compute once the backend is provisioned. There is deliberately
            no time-to-complete figure and no comparison to any other person. */}
        <RecognitionPanel
          standing={null}
          credentialsCurrent={null}
          facilityCurrencyPercent={null}
          zeroGapDays={null}
          questionsAsked={null}
          ledToSopRevision={null}
        />

        {/* Due now: outstanding assignments, ordered by due date, each with its
            required reason. Empty until assignments exist. */}
        <Section title="Due now">
          <Empty text="NOTHING DUE" />
        </Section>

        {/* My record: complete, read-only history. Exportable by the employee. */}
        <Section title="My record">
          <Empty text="NO RECORDS YET" />
          <p className="text-body-m-m md:text-body-m text-secondary">
            Your acknowledgments, completions, and assessments appear here, each with its document
            version, date, and the name of the person who recorded it. This is your professional
            record and you may export a copy.
          </p>
        </Section>

        {/* Procedures: the controlled document library. */}
        <Section title="Procedures">
          <Link
            href="/practice/procedures"
            className="font-mono text-specimen uppercase tracking-specimen text-primary hover:underline"
          >
            OPEN THE DOCUMENT LIBRARY
          </Link>
        </Section>

        {/* Account: password and MFA, nothing else. A records system, not a profile. */}
        <Section title="Account">
          <ul className="flex flex-col gap-2 text-body-m-m md:text-body-m text-secondary">
            <li>Password</li>
            <li>Multi-factor authentication</li>
          </ul>
          <Empty text="AVAILABLE AFTER SIGN IN" />
        </Section>
      </div>
    </PracticeShell>
  );
}
