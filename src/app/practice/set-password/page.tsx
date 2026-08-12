'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Where an invited staff member sets their own password (onboarding). The invite
// link lands here with a short-lived session in the URL. They choose a password,
// it is set, and they sign in normally. No temporary password ever passes through
// a person's hands.
export default function SetPasswordPage() {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      setError('Practice is not configured.');
      return;
    }
    const c = createClient(url, key, { auth: { persistSession: false, detectSessionInUrl: false } });
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const at = hash.get('access_token');
    const rt = hash.get('refresh_token');
    if (!at || !rt) {
      setError('This invite link is invalid or has expired. Ask your manager for a new one.');
      return;
    }
    c.auth.setSession({ access_token: at, refresh_token: rt }).then(({ error: e }) => {
      if (e) {
        setError('This invite link is invalid or has expired. Ask your manager for a new one.');
      } else {
        setClient(c);
        setReady(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    if (pw !== pw2) {
      setError('The two passwords do not match.');
      return;
    }
    if (!client) return;
    setPending(true);
    setError('');
    const { error: upErr } = await client.auth.updateUser({ password: pw });
    if (upErr) {
      setError(upErr.message);
      setPending(false);
      return;
    }
    await client.auth.signOut();
    setDone(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-clinical px-page-margin-mobile md:px-page-margin">
      <div className="flex w-full max-w-[420px] flex-col gap-8 border-t-2 border-calm pt-8">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-heading-s text-primary">CedarGrowth</span>
          <span className="font-mono text-specimen uppercase tracking-specimen text-calm">PRACTICE</span>
        </div>

        {done ? (
          <div className="flex flex-col gap-4">
            <p className="font-mono text-specimen uppercase tracking-specimen text-pass">PASSWORD SET</p>
            <p className="text-body-m text-secondary">Your password is set. You can sign in now.</p>
            <Link href="/practice/signin" className="cg-btn min-h-[52px] self-start">
              Go to sign in
            </Link>
          </div>
        ) : ready ? (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <p className="text-body-m text-secondary">Set a password for your Practice account.</p>
            <label className="flex flex-col gap-1">
              <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">New password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={pw}
                onChange={(ev) => setPw(ev.target.value)}
                required
                className="border border-hairline bg-clinical p-3 text-body-m text-primary focus-visible:outline-cedar"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Confirm password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={pw2}
                onChange={(ev) => setPw2(ev.target.value)}
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
              {pending ? 'Setting' : 'Set password'}
            </button>
          </form>
        ) : (
          <p role="alert" className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
            {error || 'Checking the invite link.'}
          </p>
        )}
      </div>
    </div>
  );
}
