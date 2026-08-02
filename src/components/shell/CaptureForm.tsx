'use client';

import { useId, useState } from 'react';

// The one reusable "real submission" form. Every intent that captures an
// address on this site (newsletter, DNA kit interest, find a dispensary,
// wholesale account request) renders this component against the shared
// /api/capture endpoint, so there is one honest pattern, not several. See
// src/components/reserve/ReserveClient.tsx for the sibling pattern this
// mirrors.

export type CaptureIntent = 'newsletter' | 'dna_kit' | 'find_dispensary' | 'wholesale';

type CaptureFields = {
  name?: boolean;
  location?: boolean;
  business?: boolean;
  note?: boolean;
};

export function CaptureForm({
  intent,
  fields,
  submitLabel,
  consent,
  locationLabel,
}: {
  intent: CaptureIntent;
  fields?: CaptureFields;
  submitLabel: string;
  consent: string;
  locationLabel?: string;
}) {
  const formId = useId();
  const [status, setStatus] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const showName = fields?.name ?? false;
  const showLocation = fields?.location ?? false;
  const showBusiness = fields?.business ?? false;
  const showNote = fields?.note ?? false;

  if (status === 'success') {
    return (
      <p className="text-body-m-m md:text-body-l text-secondary" role="status">
        Your request is received. CedarGrowth uses this address only as described above.
      </p>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (status === 'pending') return;
        setError(null);
        setStatus('pending');
        const form = e.currentTarget;
        const value = (id: string) =>
          (form.elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value ??
          '';
        const payload = {
          intent,
          email: value(`${formId}-email`),
          name: showName ? value(`${formId}-name`) : undefined,
          location: showLocation ? value(`${formId}-location`) : undefined,
          business: showBusiness ? value(`${formId}-business`) : undefined,
          note: showNote ? value(`${formId}-note`) : undefined,
          company: value(`${formId}-company`),
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
      className="flex flex-col gap-6"
    >
      <input
        type="text"
        id={`${formId}-company`}
        name={`${formId}-company`}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {showName ? (
        <CaptureField
          id={`${formId}-name`}
          label="Name"
          type="text"
          autoComplete="name"
          required={false}
        />
      ) : null}
      <CaptureField
        id={`${formId}-email`}
        label="Email"
        type="email"
        autoComplete="email"
        required
        ariaDescribedBy={error ? `${formId}-error` : undefined}
        ariaInvalid={status === 'error'}
      />
      {showLocation ? (
        <CaptureField
          id={`${formId}-location`}
          label={locationLabel ?? 'Location'}
          type="text"
          autoComplete="postal-code"
          required={false}
        />
      ) : null}
      {showBusiness ? (
        <CaptureField
          id={`${formId}-business`}
          label="Business"
          type="text"
          autoComplete="organization"
          required={false}
        />
      ) : null}
      {showNote ? (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${formId}-note`}
            className="font-mono text-specimen uppercase tracking-specimen text-tertiary"
          >
            Note, optional
          </label>
          <textarea
            id={`${formId}-note`}
            name={`${formId}-note`}
            rows={3}
            className="border-b border-hairline bg-transparent py-2 text-body-m-m md:text-body-m text-primary focus-visible:border-cedar focus-visible:outline-none"
          />
        </div>
      ) : null}
      <p className="text-caption-m md:text-caption text-tertiary">{consent}</p>
      {error ? (
        <p
          id={`${formId}-error`}
          className="text-caption-m md:text-caption text-fail"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'pending'}
        className="self-start bg-ink px-6 py-4 text-caption uppercase tracking-eyebrow text-inverse disabled:opacity-60"
      >
        {status === 'pending' ? 'Sending' : submitLabel}
      </button>
    </form>
  );
}

function CaptureField({
  id,
  label,
  type,
  autoComplete,
  required,
  ariaDescribedBy,
  ariaInvalid,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  required: boolean;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-specimen uppercase tracking-specimen text-tertiary"
      >
        {label}
        {required ? '' : ', optional'}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || undefined}
        className="border-b border-hairline bg-transparent py-2 text-body-m-m md:text-body-m text-primary focus-visible:border-cedar focus-visible:outline-none"
      />
    </div>
  );
}
