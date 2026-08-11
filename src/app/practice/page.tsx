import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { practiceMode, hasPracticeSession } from '@/lib/practice/store';

// PRACTICE, the employee front door (CG Prompt 09, wired in 09G). In live mode it
// routes to the floor when a session is present and to the sign-in door when it
// is not. In preview it shows the structure. When Practice is off (no Supabase
// env), it renders the unavailable state so the public site builds and deploys
// with no Practice configuration present. noindex: an internal records system.

export const metadata: Metadata = {
  title: 'Practice',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function PracticeDoor() {
  const mode = practiceMode();
  if (mode === 'live') redirect(hasPracticeSession() ? '/practice/floor' : '/practice/signin');
  if (mode === 'preview') redirect('/practice/floor');

  return (
    <main className="flex min-h-screen items-center justify-center bg-clinical px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-heading-m text-primary">CedarGrowth</span>
          <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">PRACTICE</span>
        </div>
        <div className="flex w-full flex-col items-center gap-3 border border-hairline p-6 text-center">
          <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">UNAVAILABLE</p>
          <p className="text-body-m-m md:text-body-m text-secondary">
            Practice is being provisioned. It is not yet accepting sign-ins.
          </p>
        </div>
      </div>
    </main>
  );
}
