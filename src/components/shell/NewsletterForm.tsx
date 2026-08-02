'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

// Small newsletter row (Block 9). Real submission against the shared
// /api/capture endpoint with intent "newsletter" (see
// src/components/shell/CaptureForm.tsx for the sibling fetch + state pattern
// this mirrors). Success is only shown after a genuine 200 from a real
// insert into the signups table, never optimistically.

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (status === 'success') {
    return (
      <p role="status" className="text-caption-m md:text-caption text-inverse">
        Added to the list. This address was saved for the CedarGrowth newsletter only.
      </p>
    );
  }

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (status === 'pending') return;
          setError(null);
          setStatus('pending');
          const form = e.currentTarget;
          const value = (name: string) =>
            (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '';
          const payload = {
            intent: 'newsletter',
            email: value('email'),
            company: value('newsletter-company'),
          };
          try {
            const res = await fetch('/api/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              const data = (await res.json().catch(() => ({}))) as { error?: string };
              setError(data.error || 'Something went wrong. Please try again.');
              setStatus('error');
              return;
            }
            setStatus('success');
          } catch {
            setError('Could not reach the server. Please try again.');
            setStatus('error');
          }
        }}
        className="flex items-center gap-3 border-b border-hairline-inverse pb-2"
      >
        <input
          type="text"
          id="newsletter-company"
          name="newsletter-company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <label htmlFor="newsletter-email" className="sr-only">
          Email address for the newsletter
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Email address"
          aria-describedby={error ? 'newsletter-error' : undefined}
          aria-invalid={status === 'error' || undefined}
          className="flex-1 bg-transparent text-body-m-m md:text-body-m text-inverse placeholder:text-inverse/60"
        />
        <button
          type="submit"
          disabled={status === 'pending'}
          aria-label={status === 'pending' ? 'Sending' : 'Sign up for the newsletter'}
          className="text-inverse disabled:opacity-60"
        >
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </form>
      <p className="mt-2 text-caption-m md:text-caption text-inverse/70">
        Used only to send the CedarGrowth newsletter, stored until you unsubscribe.
      </p>
      {error ? (
        <p id="newsletter-error" role="alert" className="mt-2 text-caption-m md:text-caption text-inverse">
          {error}
        </p>
      ) : null}
    </div>
  );
}
