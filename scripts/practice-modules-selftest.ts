// Self-test for the 09C module core. Pure-logic checks, no backend. Run with:
//   node --experimental-strip-types scripts/practice-modules-selftest.ts
// tsconfig excludes scripts/, so this does not enter the app typecheck.

import type { DocumentVersion } from '../src/lib/practice/types.ts';
import type { Module, ModuleCompletion } from '../src/lib/practice/modules.ts';
import {
  moduleIsAssignable,
  moduleIsOutOfDate,
  videoBlockComplete,
  completionHasPlaybackEvidence,
} from '../src/lib/practice/modules.ts';
import { reconcileOfflineCompletion } from '../src/lib/practice/video.ts';
import {
  computeStanding,
  credentialStatus,
  facilityCurrency,
  countsTowardRecognition,
  exportContainsRecognition,
  type Credential,
} from '../src/lib/practice/recognition.ts';
import { canMarkAsAnswer, replyKindFor, raiseSopRevisionFinding, type Question, type Reply } from '../src/lib/practice/questions.ts';
import { SEED_MODULES } from '../src/lib/practice/moduleSeed.ts';

let failed = 0;
function check(name: string, cond: boolean) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
  if (!cond) failed += 1;
}

const versions: DocumentVersion[] = [
  { id: 'v-cur', documentId: 'd', version: '2.0', status: 'CURRENT', effectiveDate: null, approvedByName: null, approvalDate: null, supersededByVersionId: null, contentRef: null },
  { id: 'v-old', documentId: 'd', version: '1.0', status: 'SUPERSEDED', effectiveDate: null, approvedByName: null, approvalDate: null, supersededByVersionId: 'v-cur', contentRef: null },
];

const base: Omit<Module, 'id' | 'teaches' | 'status'> = {
  title: 't', version: '1.0', effectiveDate: null, approvedByName: 'A Human', approvalDate: null,
  durationMinutes: null, durationReason: null, blocks: [], assessmentRef: null, prerequisites: [], roles: [], expiryPeriodDays: null, source: 'INTERNAL',
};
const teachingCurrent: Module = { ...base, id: 'm1', status: 'CURRENT', teaches: { kind: 'DOCUMENT', documentId: 'd', documentNumber: 'D', versionId: 'v-cur', version: '2.0' } };
const teachingOld: Module = { ...base, id: 'm2', status: 'CURRENT', teaches: { kind: 'DOCUMENT', documentId: 'd', documentNumber: 'D', versionId: 'v-old', version: '1.0' } };

check('module teaching a superseded version is out of date', moduleIsOutOfDate(teachingOld, versions));
check('module teaching a superseded version cannot be assigned', !moduleIsAssignable(teachingOld, versions).ok);
check('module teaching the current version can be assigned', moduleIsAssignable(teachingCurrent, versions).ok);
check('a DRAFT module cannot be assigned', !moduleIsAssignable({ ...teachingCurrent, status: 'DRAFT' }, versions).ok);

const videoBlock = { type: 'VIDEO' as const, id: 'b', videoRef: 'r', completionPercent: 95 };
check('video completes at threshold watched', videoBlockComplete(videoBlock, [{ at: 't', positionPercent: 100, watchedPercent: 96 }]));
check('seeking to the end without watching does not complete', !videoBlockComplete(videoBlock, [{ at: 't', positionPercent: 100, watchedPercent: 20 }]));
const videoModule: Module = { ...teachingCurrent, blocks: [videoBlock] };
const noTrail: ModuleCompletion = { id: 'c', moduleId: 'm1', moduleVersion: '1.0', personId: 'p', teachesDocumentNumber: 'D', teachesVersion: '2.0', completedAt: '2026-01-01T00:00:00Z', syncedAt: null, playbackTrail: [], integrityFlag: null, source: 'INTERNAL' };
check('completion without playback evidence on a video module fails', !completionHasPlaybackEvidence(videoModule, noTrail));

const offline = { ...noTrail, completedAt: '2026-01-01T09:00:00Z' };
const synced = reconcileOfflineCompletion(offline, '2026-01-01T17:00:00Z');
check('offline sync preserves the true completion timestamp', synced.completedAt === '2026-01-01T09:00:00Z' && synced.syncedAt === '2026-01-01T17:00:00Z');

check('standing is BEHIND with an overdue item', computeStanding({ overdueCount: 1, supersededAckCount: 0, nearestDueOrExpiryDays: null }) === 'BEHIND');
check('standing is BEHIND with a superseded acknowledgment', computeStanding({ overdueCount: 0, supersededAckCount: 1, nearestDueOrExpiryDays: null }) === 'BEHIND');
check('standing is APPROACHING within the window', computeStanding({ overdueCount: 0, supersededAckCount: 0, nearestDueOrExpiryDays: 10 }) === 'APPROACHING');
check('standing is CURRENT otherwise', computeStanding({ overdueCount: 0, supersededAckCount: 0, nearestDueOrExpiryDays: 90 }) === 'CURRENT');

const cred: Credential = { id: 'cr', personId: 'p', procedureTitle: 'KWAD press', documentId: 'd', versionId: 'v-old', version: '1.0', assessedByName: 'An Assessor', grantedAt: '2026-01-01' };
check('a credential supersedes with its document', credentialStatus(cred, versions, 10) === 'SUPERSEDED');
check('a credential expires on its own after the period', credentialStatus({ ...cred, versionId: 'v-cur', version: '2.0' }, versions, 400) === 'EXPIRED');

check('facility currency is one shared figure', facilityCurrency(['CURRENT', 'CURRENT', 'BEHIND']).percent === 67);
check('a flagged completion earns no recognition', !countsTowardRecognition({ ...noTrail, integrityFlag: 'IMPLAUSIBLE_TIME' }));
check('a clean completion counts toward recognition', countsTowardRecognition(noTrail));
check('an export with no recognition fields is clean', !exportContainsRecognition([{ personId: 'p', module: 'm', version: '2.0' }]));
check('an export carrying a recognition field is caught', exportContainsRecognition([{ personId: 'p', standing: 'CURRENT' }]));

const q: Question = { id: 'q', moduleId: 'm1', sectionRef: null, documentNumber: 'D', documentVersion: '2.0', askedByPersonId: 'p', askedAt: 't', body: '?', answeredReplyId: null, flaggedForReviewOnSupersede: false };
const managerReply: Reply = { id: 'r1', questionId: 'q', authorPersonId: 'mgr', authorRole: 'OPERATIONS_MANAGER', at: 't', body: 'a', kind: replyKindFor('OPERATIONS_MANAGER'), addsInformation: false };
const peerReply: Reply = { id: 'r2', questionId: 'q', authorPersonId: 'peer', authorRole: 'EMPLOYEE', at: 't', body: 'me too', kind: replyKindFor('EMPLOYEE'), addsInformation: false };
check('a manager reply can be marked as the answer', canMarkAsAnswer(managerReply));
check('a peer reply cannot be marked as the answer', !canMarkAsAnswer(peerReply));
check('adds-information raises an SOP revision finding', raiseSopRevisionFinding(q, { ...managerReply, addsInformation: true }, 't', 'f1') !== null);
check('a plain answer raises no finding', raiseSopRevisionFinding(q, managerReply, 't', 'f1') === null);

check('nine modules seeded', SEED_MODULES.length === 9);
check('MOD-004 and MOD-008 are pending a document number', SEED_MODULES.filter((m) => m.teaches.kind === 'PENDING').length === 2);
check('no seed module is CURRENT (none approved)', SEED_MODULES.every((m) => m.status === 'DRAFT'));
check('MOD-009 is external', SEED_MODULES.find((m) => m.id === 'CGO-MOD-009')?.source === 'EXTERNAL_PACKAGE');

console.log(`\n${failed === 0 ? 'ALL PASS' : failed + ' FAILED'}`);
if (failed > 0) process.exit(1);
