import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './kelvin.css';

// The console layer. A fixed full viewport dark surface that sits over the
// marketing chrome the root layout renders, so the operator sees only KELVIN.
// Noindexed: this is an admin surface, never a public page.

export const metadata: Metadata = {
  title: 'KELVIN',
  robots: { index: false, follow: false },
};

export default function KelvinLayout({ children }: { children: ReactNode }) {
  return <div className="kelvin-root">{children}</div>;
}
