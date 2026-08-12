import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { InviteForm } from '@/components/practice/InviteForm';
import { practiceMode, hasPracticeSession } from '@/lib/practice/store';

export const metadata: Metadata = { title: 'Invite', robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

// Manager invite. The API enforces that only a manager or owner may create an
// invite; this page is the surface for it.
export default function InvitePage() {
  const mode = practiceMode();
  if (mode === 'off') redirect('/practice');
  if (mode === 'live' && !hasPracticeSession()) redirect('/practice/signin');

  return (
    <PracticeShell mode={mode} active="console">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/practice/console" className="font-mono text-specimen uppercase tracking-specimen text-tertiary hover:text-primary">
            REVIEW CONSOLE
          </Link>
          <h1 className="font-display text-heading-m text-primary">Invite a staff member</h1>
          <p className="text-body-m md:text-body-l text-secondary">
            Name an email and a role. The person receives a one-time link to set their own password.
            There is no public sign-up, and no temporary password is ever handed to anyone.
          </p>
        </div>
        <InviteForm />
      </div>
    </PracticeShell>
  );
}
