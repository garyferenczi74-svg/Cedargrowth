'use client';

import { useState } from 'react';

const ROLES: [string, string][] = [
  ['EMPLOYEE', 'Employee'],
  ['ASSESSOR', 'Assessor'],
  ['OPERATIONS_MANAGER', 'Operations manager'],
  ['OWNER', 'Owner'],
];

// The manager invite form. Names an email and a role, creates the account and the
// invite link, and shows the link to send to the person. Email delivery is not
// assumed, so the link is shown here to copy.
export function InviteForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ link: string; email: string; role: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError('');
    setResult(null);
    setCopied(false);
    try {
      const r = await fetch('/api/practice/invite', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.link) {
        setResult({ link: d.link, email: d.email, role: d.role });
        setEmail('');
      } else {
        setError(typeof d.error === 'string' ? d.error : 'Could not create the invite.');
      }
    } catch {
      setError('Could not create the invite.');
    }
    setPending(false);
  }

  return (
    <div className="flex max-w-[640px] flex-col gap-6">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Email</span>
          <input
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
            className="border border-hairline bg-clinical p-3 text-body-m text-primary focus-visible:outline-cedar"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">Role</span>
          <select
            value={role}
            onChange={(ev) => setRole(ev.target.value)}
            className="border border-hairline bg-clinical p-3 text-body-m text-primary focus-visible:outline-cedar"
          >
            {ROLES.map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {error ? (
          <p role="alert" className="font-mono text-specimen uppercase tracking-specimen text-fail">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={pending} className="cg-btn min-h-[52px] self-start disabled:opacity-60">
          {pending ? 'Creating invite' : 'Create invite'}
        </button>
      </form>

      {result ? (
        <div className="flex flex-col gap-3 border border-hairline bg-parchment p-6">
          <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
            Invite created for {result.email} as {result.role}
          </span>
          <p className="text-body-m text-secondary">
            Send this one-time link to the person. They open it, set their own password, and sign in. It
            expires, so do not save it.
          </p>
          <div className="overflow-x-auto border border-hairline bg-clinical p-3">
            <code className="font-mono text-caption text-primary">{result.link}</code>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(result.link).then(() => setCopied(true));
            }}
            className="cg-btn min-h-[44px] self-start"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
