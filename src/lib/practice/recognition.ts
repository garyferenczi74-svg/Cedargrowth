// The recognition layer (CG Prompt 09C Amendment One). It rewards currency, not
// velocity: being up to date on the controlled documents your role requires, a
// binary capped state with no race and no ranking. It is presentation over the
// record, never a record of its own. It writes nothing, it is excluded from
// every compliance export, and it grants no credit from a flagged completion.
//
// THE FIREWALL. This module exports no write function and defines no persisted
// table. There is deliberately no field, anywhere, for time to complete. If the
// schema has no column for it, it cannot leak into a report later.

import type { DocumentVersion } from './types';
import type { ModuleCompletion } from './modules';

export const RECOGNITION_CONFIG = {
  // How far ahead of a due date or expiry standing shifts from CURRENT.
  // Configured, not a constant.
  approachingWindowDays: 30,
  // Whether a practical assessment goes stale on its own after a period even
  // when the procedure has not changed. Annual is the common answer in
  // equipment-heavy facilities. Configured, pending the assessor.
  credentialIndependentExpiryDays: 365,
};

// The layer never writes. This constant is here to be asserted by tests and read
// by reviewers, not to gate anything: there is simply no write path.
export const RECOGNITION_WRITES = false as const;

// Exactly three standing states. Not a score, not a level, not points.
export type Standing = 'CURRENT' | 'APPROACHING' | 'BEHIND';

export type StandingInput = {
  overdueCount: number; // items past due
  supersededAckCount: number; // acknowledgments against a superseded version
  nearestDueOrExpiryDays: number | null; // days to the nearest horizon, or null if none
};

export function computeStanding(input: StandingInput): Standing {
  if (input.overdueCount > 0 || input.supersededAckCount > 0) return 'BEHIND';
  if (
    input.nearestDueOrExpiryDays !== null &&
    input.nearestDueOrExpiryDays <= RECOGNITION_CONFIG.approachingWindowDays
  ) {
    return 'APPROACHING';
  }
  return 'CURRENT';
}

// A credential corresponds to a real qualification: a named assessor signed off a
// practical assessment on a procedure. It is not a badge.
export type CredentialStatus = 'CURRENT' | 'SUPERSEDED' | 'EXPIRED';

export type Credential = {
  id: string;
  personId: string;
  procedureTitle: string;
  documentId: string;
  versionId: string;
  version: string;
  assessedByName: string; // a named assessor; APEX cannot grant one
  grantedAt: string; // ISO
};

// A credential supersedes with its document, and it may also go stale on its own
// after the configured independent period. Superseded wins when both apply,
// because the procedure itself changed.
export function credentialStatus(
  cred: Credential,
  versions: DocumentVersion[],
  ageDays: number | null,
): CredentialStatus {
  const v = versions.find((x) => x.id === cred.versionId);
  if (v && (v.status === 'SUPERSEDED' || v.status === 'WITHDRAWN')) return 'SUPERSEDED';
  if (ageDays !== null && ageDays >= RECOGNITION_CONFIG.credentialIndependentExpiryDays) return 'EXPIRED';
  return 'CURRENT';
}

// Facility currency: one shared figure, no individual positions inside it. It
// moves when anyone closes a gap, so the incentive points at helping rather than
// at outpacing.
export function facilityCurrency(standings: Standing[]): {
  percent: number | null;
  currentCount: number;
  total: number;
} {
  const total = standings.length;
  if (total === 0) return { percent: null, currentCount: 0, total: 0 };
  const currentCount = standings.filter((s) => s === 'CURRENT').length;
  return { percent: Math.round((currentCount / total) * 100), currentCount, total };
}

// A completion carrying an integrity flag contributes nothing to any recognition
// state. This is the one hard bar from the amendment.
export function countsTowardRecognition(c: ModuleCompletion): boolean {
  return c.integrityFlag === null;
}

// Question recognition, the inversion. A count of questions a person asked that
// produced an answer, and separately the count that raised an SOP revision
// finding. The second is the valuable one.
export type QuestionRecognition = { asked: number; ledToSopRevision: number };

// The employee panel: exactly four lines, computed, nothing celebratory.
export type EmployeePanel = {
  standing: Standing;
  credentialsCurrent: number;
  facilityCurrencyPercent: number | null;
  zeroGapDays: number | null;
  questions: QuestionRecognition;
};

// The export firewall. Recognition is never in a compliance record to begin
// with; this asserts that a set of export rows carries none of its fields, so a
// test can prove an export of training records contains no recognition data.
const RECOGNITION_FIELDS = [
  'standing',
  'credentialsCurrent',
  'facilityCurrencyPercent',
  'zeroGapDays',
  'questionsAsked',
  'ledToSopRevision',
  'timeToComplete',
];

export function exportContainsRecognition(rows: Record<string, unknown>[]): boolean {
  return rows.some((row) => RECOGNITION_FIELDS.some((f) => f in row));
}
