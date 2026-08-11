import type { ReactNode } from 'react';
import Link from 'next/link';
import type { PracticeMode } from '@/lib/practice/store';

// The Practice wing chrome. Calm accent (#7C8A72 via the calm token). A separate
// front door and default view from Kelvin Command. In live mode, role gating on
// each route decides what an employee versus a manager may reach; the nav is
// shown in full here and the routes enforce access.
export function PracticeShell({
  mode,
  active,
  children,
}: {
  mode: PracticeMode;
  active: 'floor' | 'procedures' | 'modules' | 'console';
  children: ReactNode;
}) {
  const nav = [
    { key: 'floor', label: 'Floor', href: '/practice/floor' },
    { key: 'procedures', label: 'Procedures', href: '/practice/procedures' },
    { key: 'modules', label: 'Modules', href: '/practice/modules' },
    { key: 'console', label: 'Console', href: '/practice/console' },
  ];
  return (
    <div className="min-h-screen bg-clinical">
      <header className="border-b-2 border-calm">
        <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-page-margin-mobile py-6 md:px-page-margin">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-heading-s text-primary">CedarGrowth</span>
            <span className="font-mono text-specimen uppercase tracking-specimen text-calm">PRACTICE</span>
          </div>
          <nav className="flex gap-6">
            {nav.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                className={`font-mono text-specimen uppercase tracking-specimen ${
                  active === n.key ? 'text-primary' : 'text-tertiary hover:text-primary'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {mode === 'preview' ? (
        <div className="border-b border-hairline bg-attention/10">
          <div className="mx-auto max-w-content px-page-margin-mobile py-2 md:px-page-margin">
            <p className="font-mono text-specimen uppercase tracking-specimen text-attention">
              PREVIEW. Structure only, no records, no sign in.
            </p>
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-content px-page-margin-mobile py-10 md:px-page-margin">{children}</main>
    </div>
  );
}
