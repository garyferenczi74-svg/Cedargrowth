// The launch module list (CG Prompt 09C Part Five). These are module
// definitions, which is configuration, not fabricated training: no completions,
// no playback records, no approvals are seeded. Every module is DRAFT because no
// human has approved one yet, so none is assignable, and every module has empty
// blocks because a human writes the content. Two modules teach documents whose
// number is not recorded, so they are PENDING and blocked. MOD-006 teaches the
// KWAD SOP, which carries an open commissioning question, so it is built and
// held in DRAFT until the SOP settles.

import type { Module, ModuleSource, Teaches } from './modules';

const teachesDoc = (
  documentId: string,
  documentNumber: string,
  versionId: string,
  version: string,
): Teaches => ({ kind: 'DOCUMENT', documentId, documentNumber, versionId, version });

const TEACHES_NONE: Teaches = { kind: 'NONE' };
const teachesPending = (note: string): Teaches => ({ kind: 'PENDING', note });

const mod = (
  id: string,
  title: string,
  teaches: Teaches,
  source: ModuleSource = 'INTERNAL',
): Module => ({
  id,
  title,
  teaches,
  status: 'DRAFT',
  version: '0.1',
  effectiveDate: null,
  approvedByName: null,
  approvalDate: null,
  durationMinutes: null,
  durationReason: null,
  blocks: [],
  assessmentRef: null, // assessments are built in 09D; every module reports none here
  prerequisites: [],
  roles: [],
  expiryPeriodDays: null,
  source,
});

export const SEED_MODULES: Module[] = [
  mod('CGO-MOD-001', 'Site and safety induction', TEACHES_NONE),
  mod('CGO-MOD-002', 'Fresh frozen intake', teachesDoc('doc-proc-001', 'CGO-SOP-PROC-001', 'ver-proc-001-3', '3.0')),
  mod('CGO-MOD-003', 'Cured sugar trim intake', teachesDoc('doc-proc-002', 'CGO-SOP-PROC-002', 'ver-proc-002-2', '2.0')),
  mod('CGO-MOD-004', 'Pre-purchase examination and testing', teachesPending('document number not yet recorded')),
  mod('CGO-MOD-005', 'Blackbird pre-roll operation', teachesDoc('doc-prod-001', 'CGO-SOP-PROD-001', 'ver-prod-001-2', '2.0')),
  // Held in DRAFT: the KWAD SOP has an open commissioning question on voltage,
  // controller, and recipe capacity. Publish when the SOP settles.
  mod('CGO-MOD-006', 'KWAD press operation', teachesDoc('doc-prod-002', 'CGO-SOP-PROD-002', 'ver-prod-002-2', '2.0')),
  mod('CGO-MOD-007', 'CFM-1800 filling and infusion', teachesDoc('doc-prod-003', 'CGO-SOP-PROD-003', 'ver-prod-003-3', '3.0')),
  mod('CGO-MOD-008', 'Metrc handling and reporting', teachesPending('document number not yet recorded')),
  mod('CGO-MOD-009', 'Generic occupational safety', TEACHES_NONE, 'EXTERNAL_PACKAGE'),
];
