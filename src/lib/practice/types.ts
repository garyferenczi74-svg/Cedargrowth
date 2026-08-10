// PRACTICE, the employee floor (CG Prompt 09). Domain types.
//
// This is a RECORDS system, not a training portal. Every consequence follows
// from that: training and acknowledgment records are append-only (no edit, no
// delete, no backdate, in the interface or the store); a correction is a new
// record citing the one it corrects; nothing is fabricated, and missing values
// render UNKNOWN. Acknowledgments bind to a document VERSION, never to a
// document, because version drift is the whole point of the system.

export const UNKNOWN = 'UNKNOWN' as const;

// Roles are data, not code. Adding a fifth role must not touch a component.
export type Role = 'EMPLOYEE' | 'ASSESSOR' | 'OPERATIONS_MANAGER' | 'OWNER';

export const ROLES: { key: Role; label: string; can: string }[] = [
  { key: 'EMPLOYEE', label: 'EMPLOYEE', can: 'Own training, own records, SOP library read' },
  { key: 'ASSESSOR', label: 'ASSESSOR', can: 'Employee, plus recording practical assessments' },
  {
    key: 'OPERATIONS_MANAGER',
    label: 'OPERATIONS MANAGER',
    can: 'Full review, assignment, document control, reporting',
  },
  { key: 'OWNER', label: 'OWNER', can: 'All of the above, plus role administration' },
];

// The route each role lands on after sign-in.
export const ROLE_HOME: Record<Role, string> = {
  EMPLOYEE: '/practice/floor',
  ASSESSOR: '/practice/floor',
  OPERATIONS_MANAGER: '/practice/console',
  OWNER: '/practice/console',
};

// Document control. Status is a fixed vocabulary.
export type DocStatus = 'DRAFT' | 'IN_REVIEW' | 'CURRENT' | 'SUPERSEDED' | 'WITHDRAWN';

export const DOC_STATUS_LABEL: Record<DocStatus, string> = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN REVIEW',
  CURRENT: 'CURRENT',
  SUPERSEDED: 'SUPERSEDED',
  WITHDRAWN: 'WITHDRAWN',
};

// A controlled document is an identity (its number and title). Its versions are
// separate records; exactly one may be CURRENT at a time.
export type ControlledDocument = {
  id: string;
  number: string; // e.g. CGO-SOP-PROC-002
  title: string | null; // UNKNOWN until supplied
  category: string | null;
  requiresAck: boolean;
};

// A version is the unit everything binds to. Never deleted; superseded instead.
export type DocumentVersion = {
  id: string;
  documentId: string;
  version: string; // e.g. 2.0
  status: DocStatus;
  effectiveDate: string | null; // ISO, or null -> UNKNOWN
  approvedByName: string | null; // a named human, never an agent
  approvalDate: string | null;
  supersededByVersionId: string | null;
  contentRef: string | null; // pointer to the reading treatment source, never inline fabrication
};

// An acknowledgment is bound to a specific VERSION and is append-only.
export type Acknowledgment = {
  id: string;
  personId: string;
  documentId: string;
  documentNumber: string;
  versionId: string;
  version: string;
  timestamp: string; // ISO, recorded by the system, never entered
  statement: string; // the exact text acknowledged
  correctsId: string | null; // a correction cites the record it corrects
};

// Why an assignment exists. Required on every assignment: it is the audit trail
// and the answer to "why am I redoing this."
export type AssignmentReason =
  | 'NEW_HIRE'
  | 'ROLE_CHANGE'
  | 'SOP_REVISED'
  | 'ANNUAL_REFRESHER';

export const ASSIGNMENT_REASON_LABEL: Record<AssignmentReason, string> = {
  NEW_HIRE: 'New hire',
  ROLE_CHANGE: 'Role change',
  SOP_REVISED: 'SOP revised',
  ANNUAL_REFRESHER: 'Annual refresher',
};

export type AssignmentStatus =
  | 'OUTSTANDING'
  | 'COMPLETED'
  | 'NOT_COMPLETED_SEPARATED';

export type Assignment = {
  id: string;
  personId: string;
  documentId: string;
  documentNumber: string;
  // The specific version this assignment targets (re-ack of a new CURRENT).
  targetVersionId: string | null;
  reason: AssignmentReason;
  reasonDetail: string | null; // e.g. "to v2.0", filled for SOP_REVISED
  assignedByName: string;
  assignedAt: string;
  dueDate: string | null;
  status: AssignmentStatus;
};

// A person is a stable identity. Employment periods and lifecycle land in 09A;
// this build carries only the fields the foundation needs.
export type Person = {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  active: boolean;
};

// A drift entry: a person whose most recent acknowledgment of a document is
// against a version that is no longer CURRENT.
export type DriftEntry = {
  personId: string;
  personName: string | null;
  documentId: string;
  documentNumber: string;
  acknowledgedVersion: string; // the stale version they last acked
  currentVersion: string; // what CURRENT is now
  since: string; // ISO, when the current version became effective / was published
};

// The append-only, hash-chained audit entry. Same structure as Kelvin's stated
// design: each entry carries a hash of its predecessor.
export type AuditKind =
  | 'SIGN_IN_ATTEMPT'
  | 'DOCUMENT_OPEN'
  | 'ACKNOWLEDGMENT'
  | 'ASSIGNMENT'
  | 'STATUS_CHANGE'
  | 'VERSION_PUBLICATION'
  | 'ROLE_CHANGE'
  | 'EXPORT'
  | 'LOCKOUT';

export type AuditEntry = {
  seq: number;
  at: string; // ISO
  kind: AuditKind;
  actor: string | null; // email or name, or null for anonymous attempt
  summary: string;
  source: string | null; // source address for sign-in / open events
  prevHash: string;
  hash: string;
};
