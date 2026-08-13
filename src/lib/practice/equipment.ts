// Equipment, the pre-use gate, the qualification board, and single point of
// failure (CG Prompt 09D Sections 4, 5, 6). Nobody operates equipment before
// training and practical assessment are complete, and this makes that a computed
// gate rather than a policy. Clearance is computed from current credentials; a
// superseded procedure clears nobody. Pure types and logic.

import type { DocumentVersion } from './types';
import type { Credential } from './recognition';

// A credential counts here when the document version it was granted against is
// current. This matches credentialStatus for the case these call sites use
// (independent expiry is handled separately in the recognition layer).
function credentialCurrent(cred: Credential, versions: DocumentVersion[]): boolean {
  const v = versions.find((x) => x.id === cred.versionId);
  return Boolean(v) && v!.status === 'CURRENT';
}

export type CommissioningState = 'NOT_COMMISSIONED' | 'COMMISSIONING' | 'COMMISSIONED';

export type Equipment = {
  id: string; // CGO-EQ-###
  name: string;
  governingDocumentId: string;
  governingDocumentNumber: string;
  governingVersionId: string | null;
  governingVersion: string | null;
  commissioning: CommissioningState;
  // An open commissioning verification note blocks clearance, the live KWAD case.
  verificationNoteOpen: boolean;
};

// Operators cleared to run a unit: people holding a current credential against
// its governing SOP.
export function clearedOperators(
  eq: Equipment,
  credentials: Credential[],
  versions: DocumentVersion[],
): string[] {
  return credentials
    .filter(
      (c) => c.documentId === eq.governingDocumentId && credentialCurrent(c, versions),
    )
    .map((c) => c.personId);
}

export type ClearanceStatus = 'CLEARED FOR OPERATION' | 'NOT CLEARED FOR OPERATION';

// Clearance requires commissioning complete, a governing SOP at CURRENT with no
// open verification note, and at least one operator with a current credential.
// Anything else reads NOT CLEARED with the specific reason.
export function equipmentClearance(
  eq: Equipment,
  credentials: Credential[],
  versions: DocumentVersion[],
): { status: ClearanceStatus; reason: string | null } {
  const reasons: string[] = [];
  if (eq.commissioning !== 'COMMISSIONED') reasons.push('not commissioned');
  const gv = versions.find((v) => v.id === eq.governingVersionId);
  if (!gv || gv.status !== 'CURRENT') reasons.push('governing SOP not at a current version');
  if (eq.verificationNoteOpen) reasons.push('open commissioning verification note');
  if (clearedOperators(eq, credentials, versions).length === 0) {
    reasons.push('no operator holds a current credential');
  }
  if (reasons.length === 0) return { status: 'CLEARED FOR OPERATION', reason: null };
  return { status: 'NOT CLEARED FOR OPERATION', reason: reasons.join('; ') };
}

// The qualification board: for each procedure or piece of equipment, who is
// cleared right now. A superseded procedure clears nobody.
export type BoardRow = {
  key: string;
  label: string;
  kind: 'PROCEDURE' | 'EQUIPMENT';
  clearedPersonIds: string[];
};

// Clearance on a procedure: everyone holding a current credential against it.
export function procedureBoardRow(
  documentId: string,
  documentNumber: string,
  credentials: Credential[],
  versions: DocumentVersion[],
): BoardRow {
  const cleared = credentials
    .filter((c) => c.documentId === documentId && credentialCurrent(c, versions))
    .map((c) => c.personId);
  return { key: documentId, label: documentNumber, kind: 'PROCEDURE', clearedPersonIds: cleared };
}

export function equipmentBoardRow(
  eq: Equipment,
  credentials: Credential[],
  versions: DocumentVersion[],
): BoardRow {
  // Equipment clears operators only when the unit itself is cleared for
  // operation; otherwise the row is empty even if someone holds the credential.
  const clearedUnit = equipmentClearance(eq, credentials, versions).status === 'CLEARED FOR OPERATION';
  return {
    key: eq.id,
    label: eq.name,
    kind: 'EQUIPMENT',
    clearedPersonIds: clearedUnit ? clearedOperators(eq, credentials, versions) : [],
  };
}

// Single point of failure: every procedure and piece of equipment with fewer
// than two current cleared operators. A business fact, not an incident, so no
// urgency treatment attaches to it.
export const SPOF_THRESHOLD = 2;
export function singlePointsOfFailure(rows: BoardRow[]): BoardRow[] {
  return rows.filter((r) => r.clearedPersonIds.length < SPOF_THRESHOLD);
}
