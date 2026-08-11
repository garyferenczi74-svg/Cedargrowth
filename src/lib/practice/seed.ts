// The only seeded records: the controlled documents the prompt actually states,
// with everything unstated left UNKNOWN. This is document-control state, not
// fabricated training: version numbers and statuses are given (PROC-002 went
// v1.0 to v2.0; PROC-001 is at v3.0), while effective dates and approvers are
// UNKNOWN until supplied. No people, no acknowledgments, no completions are
// seeded, so nothing here looks like a real employee completing real training.
//
// The Pre-Purchase Material Examination and Third-Party Testing SOP (v2.0) is
// deliberately absent: its document number has not been supplied, and a
// controlled document without a number is not a controlled document.

import type { ControlledDocument, DocumentVersion } from './types';

export const SEED_DOCUMENTS: ControlledDocument[] = [
  { id: 'doc-proc-001', number: 'CGO-SOP-PROC-001', title: null, category: 'PROCESS', requiresAck: true },
  {
    id: 'doc-proc-002',
    number: 'CGO-SOP-PROC-002',
    title: 'Cured sugar trim intake',
    category: 'PROCESS',
    requiresAck: true,
  },
  // Production SOPs the training modules bind to (09C). Version numbers are the
  // stated ones; titles, effective dates, and approvers are UNKNOWN until
  // supplied. PROD-002 (KWAD press) carries an open commissioning question, so
  // its module is held in DRAFT (see moduleSeed).
  { id: 'doc-prod-001', number: 'CGO-SOP-PROD-001', title: null, category: 'PRODUCTION', requiresAck: true },
  { id: 'doc-prod-002', number: 'CGO-SOP-PROD-002', title: null, category: 'PRODUCTION', requiresAck: true },
  { id: 'doc-prod-003', number: 'CGO-SOP-PROD-003', title: null, category: 'PRODUCTION', requiresAck: true },
];

export const SEED_VERSIONS: DocumentVersion[] = [
  {
    id: 'ver-proc-001-3',
    documentId: 'doc-proc-001',
    version: '3.0',
    status: 'CURRENT',
    effectiveDate: null,
    approvedByName: null,
    approvalDate: null,
    supersededByVersionId: null,
    contentRef: null,
  },
  {
    id: 'ver-proc-002-1',
    documentId: 'doc-proc-002',
    version: '1.0',
    status: 'SUPERSEDED',
    effectiveDate: null,
    approvedByName: null,
    approvalDate: null,
    supersededByVersionId: 'ver-proc-002-2',
    contentRef: null,
  },
  {
    id: 'ver-proc-002-2',
    documentId: 'doc-proc-002',
    version: '2.0',
    status: 'CURRENT',
    effectiveDate: null,
    approvedByName: null,
    approvalDate: null,
    supersededByVersionId: null,
    contentRef: null,
  },
  {
    id: 'ver-prod-001-2',
    documentId: 'doc-prod-001',
    version: '2.0',
    status: 'CURRENT',
    effectiveDate: null,
    approvedByName: null,
    approvalDate: null,
    supersededByVersionId: null,
    contentRef: null,
  },
  {
    id: 'ver-prod-002-2',
    documentId: 'doc-prod-002',
    version: '2.0',
    status: 'CURRENT',
    effectiveDate: null,
    approvedByName: null,
    approvalDate: null,
    supersededByVersionId: null,
    contentRef: null,
  },
  {
    id: 'ver-prod-003-3',
    documentId: 'doc-prod-003',
    version: '3.0',
    status: 'CURRENT',
    effectiveDate: null,
    approvedByName: null,
    approvalDate: null,
    supersededByVersionId: null,
    contentRef: null,
  },
];
