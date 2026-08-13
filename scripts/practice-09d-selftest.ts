// Self-test for the 09D core. Pure-logic checks, no backend. Run with:
//   node --experimental-strip-types scripts/practice-09d-selftest.ts

import type { DocumentVersion } from '../src/lib/practice/types.ts';
import type { Credential } from '../src/lib/practice/recognition.ts';
import type { Assessment } from '../src/lib/practice/assessment.ts';
import { bankSizeWarning, scoreAttempt, shouldEscalate, assessmentOutOfDate } from '../src/lib/practice/assessment.ts';
import { canAssess, signOffAllowed, signOffComplete, type PracticalSignOff } from '../src/lib/practice/assessors.ts';
import { equipmentClearance, clearedOperators, singlePointsOfFailure, type BoardRow, type Equipment } from '../src/lib/practice/equipment.ts';
import { SEED_EQUIPMENT } from '../src/lib/practice/equipmentSeed.ts';
import { tierGatePasses } from '../src/lib/practice/engagements.ts';
import { unreachablePeople } from '../src/lib/practice/notifications.ts';
import { printFooter, canPrint } from '../src/lib/practice/printing.ts';
import { blockApexAction, raiseAnomaly } from '../src/lib/practice/apexAutomation.ts';
import { languageMismatch } from '../src/lib/practice/language.ts';

let failed = 0;
function check(name: string, cond: boolean) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
  if (!cond) failed += 1;
}

const versions: DocumentVersion[] = [
  { id: 'ver-prod-001-2', documentId: 'doc-prod-001', version: '2.0', status: 'CURRENT', effectiveDate: null, approvedByName: null, approvalDate: null, supersededByVersionId: null, contentRef: null },
  { id: 'ver-prod-002-2', documentId: 'doc-prod-002', version: '2.0', status: 'CURRENT', effectiveDate: null, approvedByName: null, approvalDate: null, supersededByVersionId: null, contentRef: null },
  { id: 'v-old', documentId: 'doc-prod-001', version: '1.0', status: 'SUPERSEDED', effectiveDate: null, approvedByName: null, approvalDate: null, supersededByVersionId: 'ver-prod-001-2', contentRef: null },
];

const asm: Assessment = {
  id: 'CGO-ASM-001', type: 'KNOWLEDGE',
  teaches: { documentId: 'doc-prod-001', documentNumber: 'CGO-SOP-PROD-001', versionId: 'ver-prod-001-2', version: '2.0' },
  moduleId: 'CGO-MOD-005', passThresholdPercent: 80, attemptsAllowed: 3, remediationModuleId: 'CGO-MOD-005',
  status: 'CURRENT', approvedByName: 'A Human', approvalDate: null, language: 'en',
  bank: Array.from({ length: 8 }, (_, i) => ({ id: `q${i}`, section: `s${i % 2}`, question: 'q', options: ['a', 'b'], correctIndex: 0, rationale: 'r' })),
  itemsPresented: 5, checklist: [],
};

check('bank below 3x presented warns', bankSizeWarning({ ...asm, bank: asm.bank.slice(0, 8), itemsPresented: 5 }) !== null);
check('bank at or above 3x presented does not warn', bankSizeWarning({ ...asm, itemsPresented: 2 }) === null);

const presented = asm.bank.slice(0, 5);
const perfect = scoreAttempt(asm, presented, [0, 0, 0, 0, 0]);
check('a perfect attempt passes at 100 percent', perfect.percent === 100 && perfect.passed);
const partial = scoreAttempt(asm, presented, [0, 1, 1, 1, 1]);
check('below threshold does not pass and names missed sections', !partial.passed && partial.missedSections.length === 4);
check('escalation triggers only at the attempt limit', !shouldEscalate(asm, 2) && shouldEscalate(asm, 3));
check('assessment on a superseded version is out of date', assessmentOutOfDate({ ...asm, teaches: { documentId: 'doc-prod-001', documentNumber: 'D', versionId: 'v-old', version: '1.0' } }, versions));

const curCred: Credential = { id: 'c1', personId: 'p1', procedureTitle: 'Blackbird', documentId: 'doc-prod-001', versionId: 'ver-prod-001-2', version: '2.0', assessedByName: 'X', grantedAt: '2026-01-01' };
const oldCred: Credential = { ...curCred, id: 'c2', versionId: 'v-old', version: '1.0' };
check('an assessor with a current credential can assess', canAssess([curCred], 'doc-prod-001', versions));
check('an assessor whose credential superseded cannot assess', !canAssess([oldCred], 'doc-prod-001', versions));
check('the store rejects a sign-off from a lapsed assessor', !signOffAllowed([oldCred], 'doc-prod-001', versions).ok);

const signOff: PracticalSignOff = { id: 's1', assessorName: 'X', assessorCredentialId: 'c1', personId: 'p2', documentId: 'doc-prod-001', documentNumber: 'D', version: '2.0', date: 'd', results: [{ stepId: 'st1', observed: false, note: null }] };
check('a not-observed step without a note is incomplete', !signOffComplete(signOff));
check('a not-observed step with a note is complete', signOffComplete({ ...signOff, results: [{ stepId: 'st1', observed: false, note: 'stopped early' }] }));

// Equipment. The KWAD seed reads NOT CLEARED with its reason, and no operator is
// cleared because no credential exists.
const kwad = SEED_EQUIPMENT.find((e) => e.id === 'CGO-EQ-002')!;
const kwadClear = equipmentClearance(kwad, [], versions);
check('the KWAD is not cleared for operation', kwadClear.status === 'NOT CLEARED FOR OPERATION');
check('the KWAD reason names the verification note', kwadClear.reason!.includes('verification note'));

const cleared: Equipment = { id: 'CGO-EQ-001', name: 'Blackbird', governingDocumentId: 'doc-prod-001', governingDocumentNumber: 'CGO-SOP-PROD-001', governingVersionId: 'ver-prod-001-2', governingVersion: '2.0', commissioning: 'COMMISSIONED', verificationNoteOpen: false };
check('a fully commissioned unit with a current operator is cleared', equipmentClearance(cleared, [curCred], versions).status === 'CLEARED FOR OPERATION');
check('cleared operators counts current credentials only', clearedOperators(cleared, [curCred, oldCred], versions).length === 1);

const rows: BoardRow[] = [{ key: 'd', label: 'D', kind: 'PROCEDURE', clearedPersonIds: ['p1'] }, { key: 'e', label: 'E', kind: 'EQUIPMENT', clearedPersonIds: ['p1', 'p2'] }];
check('single point of failure catches under two cleared', singlePointsOfFailure(rows).length === 1);

check('tier gate passes only when reached in order', tierGatePasses('TIER_2_PRODUCT_HANDLING', 'TIER_1_FACILITY_ACCESS') && !tierGatePasses('TIER_1_FACILITY_ACCESS', 'TIER_3_EQUIPMENT_OPERATION'));

check('a person with no reachable channel is unreachable', unreachablePeople([{ personId: 'p1', notificationClass: 'ASSIGNMENT', channel: null }]).length === 1);
check('a person with a channel is reachable', unreachablePeople([{ personId: 'p1', notificationClass: 'ASSIGNMENT', channel: null }, { personId: 'p1', notificationClass: 'REMINDER', channel: 'SMS' }]).length === 0);

check('the print footer states copies are uncontrolled', printFooter('CGO-SOP-PROD-002', '2.0', '2026-08-11').includes('UNCONTROLLED'));
check('a superseded version cannot be printed', !canPrint('SUPERSEDED').ok);
check('a current version can be printed', canPrint('CURRENT').ok);

const blocked = blockApexAction('SIGN_PRACTICAL');
check('a barred APEX action is blocked and records to WARRANT', blocked.blocked && blocked.recordToWarrant);
check('an anomaly flag carries no conclusion', raiseAnomaly('FAST_KNOWLEDGE_CHECK', 'completed in 41 seconds').conclusion === null);

check('a language the content does not exist in is a mismatch', languageMismatch('es', ['en']));
check('a language the content exists in is not a mismatch', !languageMismatch('en', ['en']));

console.log(`\n${failed === 0 ? 'ALL PASS' : failed + ' FAILED'}`);
if (failed > 0) process.exit(1);
