'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Practice sign-in (CG Prompt 09G). A single-purpose door. Email and password;
// the session is set server-side. No marketing chrome.
export default function PracticeSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError('');
    try {
      const r = await fetch('/api/practice/signin', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (r.ok) {
        router.replace('/practice/floor');
        router.refresh();
      } else {
        const d = await r.json().catch(() => ({}));
        setError(typeof d.error === 'string' ? d.error : 'That did not resolve.');
        setPending(false);
      }
    } catch {
      setError('That did not resolve.');
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-clinical px-page-margin-mobile md:px-page-margin">
      <div className="flex w-full max-w-[420px] flex-col gap-8 border-t-2 border-calm pt-8">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-heading-s text-primary">CedarGrowth</span>
          <span className="font-mono text-specimen uppercase tracking-specimen text-calm">PRACTICE</span>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              className="border border-hairline bg-clinical p-3 text-body-m text-primary focus-visible:outline-cedar"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              className="border border-hairline bg-clinical p-3 text-body-m text-primary focus-visible:outline-cedar"
            />
          </label>
          {error ? (
            <p role="alert" className="font-mono text-specimen uppercase tracking-specimen text-fail">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={pending} className="cg-btn mt-2 min-h-[52px] disabled:opacity-60">
            {pending ? 'Signing in' : 'Sign in'}
          </button>
        </form>
        <p className="text-caption text-tertiary">
          Access is by staff account. There is no self sign-up. Accounts and multi-factor setup are
          issued by the operations manager.
        </p>
      </div>
    </div>
  );
}
