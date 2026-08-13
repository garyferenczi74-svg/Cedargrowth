// Assessor authority (CG Prompt 09D Part One and Section 3). An assessor's
// signature is worth exactly what their own competence is worth, so authority is
// per procedure, not global: it requires holding a current credential on that
// procedure, and it lapses automatically when that credential supersedes. The
// store rejects a sign-off from anyone whose credential on that procedure is not
// current, and the attempt records in WARRANT. Provenance records where the first
// qualification came from, because for new equipment it comes from outside.

import type { DocumentVersion } from './types';
import type { Credential } from './recognition';

// A credential counts here when the document version it was granted against is
// current, matching credentialStatus for the case this file uses.
function credentialCurrent(cred: Credential, versions: DocumentVersion[]): boolean {
  const v = versions.find((x) => x.id === cred.versionId);
  return Boolean(v) && v!.status === 'CURRENT';
}

// Where an assessor's own qualification came from. For the first assessor on new
// equipment this is external, and the field exists so the chain does not start
// from nothing.
export type ProvenanceKind =
  | 'INTERNAL_CREDENTIAL'
  | 'VENDOR_TRAINING'
  | 'EXTERNAL_COURSE'
  | 'CONTRACTOR_ASSESSMENT';

export type AssessorProvenance = {
  personId: string;
  documentId: string; // the procedure the authority is for
  kind: ProvenanceKind;
  reference: string | null; // a citable reference; UNKNOWN until supplied
};

// Authority is per procedure and requires a current credential on it.
export function canAssess(
  assessorCredentials: Credential[],
  documentId: string,
  versions: DocumentVersion[],
): boolean {
  return assessorCredentials.some(
    (c) => c.documentId === documentId && credentialCurrent(c, versions),
  );
}

// The store gate: a practical sign-off is rejected from anyone whose credential
// on that procedure is not current. The attempt records in WARRANT.
export function signOffAllowed(
  assessorCredentials: Credential[],
  documentId: string,
  versions: DocumentVersion[],
): { ok: boolean; reason: string | null } {
  if (canAssess(assessorCredentials, documentId, versions)) return { ok: true, reason: null };
  return { ok: false, reason: 'assessor credential on this procedure is not current' };
}

// A practical sign-off record: assessor, person, procedure, version, date, the
// checklist result, and any notes. Append-only evidence, never fabricated.
export type PracticalSignOff = {
  id: string;
  assessorName: string;
  assessorCredentialId: string;
  personId: string;
  documentId: string;
  documentNumber: string;
  version: string;
  date: string;
  results: { stepId: string; observed: boolean; note: string | null }[];
};

// A not-observed step requires a note; a sign-off with an unnoted not-observed
// step is incomplete.
export function signOffComplete(s: PracticalSignOff): boolean {
  return s.results.every((r) => r.observed || (r.note !== null && r.note.trim() !== ''));
}

// A lapsed assessor's pending sign-offs surface for review rather than silently
// standing.
export function signOffsToReview(
  signOffs: PracticalSignOff[],
  lapsedCredentialIds: string[],
): PracticalSignOff[] {
  return signOffs.filter((s) => lapsedCredentialIds.includes(s.assessorCredentialId));
}
