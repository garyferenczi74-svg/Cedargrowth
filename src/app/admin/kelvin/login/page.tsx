'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// The door. On first run, when no access code is set, it shows a create screen so
// the admin picks their own code. After that it shows the normal sign in. Every
// failure returns the same neutral line, so the screen enumerates nothing.

type Mode = 'loading' | 'create' | 'signin' | 'unconfigured';

export default function KelvinLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('loading');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/kelvin/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active) return;
        if (!d || !d.configured) setMode('unconfigured');
        else setMode(d.setup ? 'signin' : 'create');
      })
      .catch(() => { if (active) setMode('unconfigured'); });
    return () => { active = false; };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError('');
    if (mode === 'create') {
      if (code.length < 8) { setError('Choose an access code of at least 8 characters.'); return; }
      if (code !== confirm) { setError('The two codes do not match.'); return; }
    }
    setPending(true);
    const endpoint = mode === 'create' ? '/api/admin/kelvin/setup' : '/api/admin/kelvin/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) { router.replace('/admin/kelvin'); return; }
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === 'string' ? data.error : 'That did not resolve.');
    } catch {
      setError('That did not resolve.');
    } finally {
      setPending(false);
    }
  }

  const creating = mode === 'create';

  return (
    <div className="door">
      <div className="door-card">
        <div className="wm">CEDARGROWTH</div>
        <div className="sys">KELVIN</div>

        {mode === 'loading' ? (
          <p className="foot" style={{ marginTop: 32, borderTop: 'none' }}>Checking access.</p>
        ) : mode === 'unconfigured' ? (
          <p className="foot" style={{ marginTop: 32, borderTop: 'none', color: 'var(--k-attention)' }}>
            Access is not configured yet. The session secret or the storage is not set on this deployment.
          </p>
        ) : (
          <form onSubmit={submit} noValidate>
            {creating ? (
              <p className="foot" style={{ marginTop: 24, marginBottom: 8, borderTop: 'none', paddingTop: 0 }}>
                First sign in. Set the access code for this console. You will use it every time after.
              </p>
            ) : null}
            <div className="field">
              <label htmlFor="em">Admin email</label>
              <input id="em" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="pw">{creating ? 'Choose an access code' : 'Access code'}</label>
              <input id="pw" type="password" autoComplete={creating ? 'new-password' : 'current-password'} value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            {creating ? (
              <div className="field">
                <label htmlFor="pw2">Confirm access code</label>
                <input id="pw2" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
            ) : null}
            <button className="btn solid" type="submit" style={{ width: '100%' }} disabled={pending}>
              {pending ? 'Working' : creating ? 'Set code and enter' : 'Enter'}
            </button>
            <div className="neutral">{error}</div>
          </form>
        )}

        <div className="foot">
          Access is restricted to the site admin. The session is a signed, http only cookie scoped to this
          console. Every route under the console returns 404 without a valid session, so the surface does not
          announce that it exists. Multi factor and rate limited lockout land when this ports onto full accounts.
        </div>
      </div>
    </div>
  );
}
