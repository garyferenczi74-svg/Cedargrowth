import Link from 'next/link';
import type { DocStatus, DocumentVersion, ControlledDocument } from '@/lib/practice/types';
import { DOC_STATUS_LABEL } from '@/lib/practice/types';

// Status chip: 2px radius, mono, uppercase, 1px border, no fill. The only place
// radius is non-zero. Color carries meaning but the text always states it.
const STATUS_CLASS: Record<DocStatus, string> = {
  DRAFT: 'text-tertiary border-hairline',
  IN_REVIEW: 'text-tertiary border-hairline',
  CURRENT: 'text-pass border-pass',
  SUPERSEDED: 'text-attention border-attention',
  WITHDRAWN: 'text-fail border-fail',
};

export function StatusChip({ status }: { status: DocStatus }) {
  return (
    <span
      className={`inline-block rounded-[2px] border px-2 py-0.5 font-mono text-specimen uppercase tracking-specimen ${STATUS_CLASS[status]}`}
    >
      {DOC_STATUS_LABEL[status]}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">{label}</span>
      <span className="font-mono text-data text-primary">{value ?? 'UNKNOWN'}</span>
    </div>
  );
}

// The control block header on every document view.
export function ControlBlock({
  document,
  version,
}: {
  document: ControlledDocument;
  version: DocumentVersion;
}) {
  return (
    <div className="flex flex-col gap-6 border border-hairline bg-clinical p-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-data uppercase tracking-specimen text-primary">
          {document.number}
        </span>
        <span className="font-display text-heading-s text-primary">
          {document.title ?? 'UNKNOWN'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Field label="Version" value={version.version} />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-specimen uppercase tracking-specimen text-tertiary">
            Status
          </span>
          <span>
            <StatusChip status={version.status} />
          </span>
        </div>
        <Field label="Effective" value={version.effectiveDate} />
        <Field
          label="Approved by"
          value={
            version.approvedByName
              ? `${version.approvedByName}${version.approvalDate ? `, ${version.approvalDate}` : ''}`
              : null
          }
        />
      </div>
    </div>
  );
}

// The superseded banner. Not dismissible. Rendered above the document on every
// screen size, on the attention signal, with a link to the superseding version.
export function SupersededBanner({ supersedingNumber }: { supersedingNumber: string | null }) {
  return (
    <div
      role="alert"
      className="border border-attention bg-attention/10 p-4 text-attention"
    >
      <p className="text-body-m-m md:text-body-m">
        This version is superseded. It is retained for record purposes and must not be used to
        perform work.
        {supersedingNumber ? (
          <>
            {' '}
            The current version is{' '}
            <Link href={`/practice/procedures/${encodeURIComponent(supersedingNumber)}`} className="underline">
              {supersedingNumber}
            </Link>
            .
          </>
        ) : null}
      </p>
    </div>
  );
}
