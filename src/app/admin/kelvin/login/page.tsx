'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// The door. Posts the password to the login route, which sets the signed
// session cookie on success. Every failure returns the same neutral line, so
// the screen enumerates nothing. On success the console loads.

export default function KelvinLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError('');
    setPending(true);
    try {
      const res = await fetch('/api/admin/kelvin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace('/admin/kelvin');
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === 'string' ? data.error : 'That did not resolve.');
    } catch {
      setError('That did not resolve.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="door">
      <div className="door-card">
        <div className="wm">CEDARGROWTH</div>
        <div className="sys">KELVIN</div>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="pw">Access key</label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn solid" type="submit" style={{ width: '100%' }} disabled={pending}>
            {pending ? 'Checking' : 'Enter'}
          </button>
          <div className="neutral">{error}</div>
        </form>
        <div className="foot">
          Access is by key and the session is a signed, http only cookie scoped to this
          console. Every route under the console returns 404 without a valid session, so the
          surface does not announce that it exists. Multi factor and rate limited lockout land
          when this ports onto full accounts.
        </div>
      </div>
    </div>
  );
}
