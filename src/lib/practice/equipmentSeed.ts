// The three production units (CG Prompt 09D Section 4). Equipment records are
// configuration, not fabricated qualification: no credentials, operators, or
// commissioning completions are invented. Commissioning is NOT_COMMISSIONED for
// all three until a completion is recorded, and no person holds a credential
// yet, so all three read NOT CLEARED FOR OPERATION with the reason stated. The
// KWAD additionally carries an open commissioning verification note.

import type { Equipment } from './equipment';

export const SEED_EQUIPMENT: Equipment[] = [
  {
    id: 'CGO-EQ-001',
    name: 'Blackbird pre-roll line',
    governingDocumentId: 'doc-prod-001',
    governingDocumentNumber: 'CGO-SOP-PROD-001',
    governingVersionId: 'ver-prod-001-2',
    governingVersion: '2.0',
    commissioning: 'NOT_COMMISSIONED',
    verificationNoteOpen: false,
  },
  {
    id: 'CGO-EQ-002',
    name: 'KWAD press',
    governingDocumentId: 'doc-prod-002',
    governingDocumentNumber: 'CGO-SOP-PROD-002',
    governingVersionId: 'ver-prod-002-2',
    governingVersion: '2.0',
    commissioning: 'NOT_COMMISSIONED',
    // The unresolved commissioning verification note on the KWAD SOP.
    verificationNoteOpen: true,
  },
  {
    id: 'CGO-EQ-003',
    name: 'CFM-1800 filling and infusion',
    governingDocumentId: 'doc-prod-003',
    governingDocumentNumber: 'CGO-SOP-PROD-003',
    governingVersionId: 'ver-prod-003-3',
    governingVersion: '3.0',
    commissioning: 'NOT_COMMISSIONED',
    verificationNoteOpen: false,
  },
];
