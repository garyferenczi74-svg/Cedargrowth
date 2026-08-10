import type { Metadata } from 'next';
import { isPracticeConfigured } from '@/lib/practice/store';

// PRACTICE, the employee front door (CG Prompt 09). A quiet, single-purpose
// room, not a command center. noindex: this is an internal records system, never
// a public page. Until Supabase Auth is provisioned, the door renders its
// unavailable state so the public site builds and deploys with no Supabase env
// present. The email, password, and MFA flow are wired to the Supabase auth
// client once the owner completes docs/practice-supabase-setup.md.

export const metadata: Metadata = {
  title: 'Practice',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function PracticeDoor() {
  const configured = isPracticeConfigured();
  return (
    <main className="flex min-h-screen items-center justify-center bg-clinical px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-heading-m text-primary">CedarGrowth</span>
          <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
            PRACTICE
          </span>
        </div>

        {configured ? (
          // The sign-in form is provisioned with the Supabase auth client. It is
          // intentionally not rendered until the backend exists, so no inert
          // credential field ships to the public build.
          <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
            SIGN IN
          </p>
        ) : (
          <div className="flex w-full flex-col items-center gap-3 border border-hairline p-6 text-center">
            <p className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
              UNAVAILABLE
            </p>
            <p className="text-body-m-m md:text-body-m text-secondary">
              Practice is being provisioned. It is not yet accepting sign-ins.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
