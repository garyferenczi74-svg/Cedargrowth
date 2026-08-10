// Self-test for the Practice correctness core: version-drift computation and the
// tamper-evident audit chain. Run: node --experimental-strip-types scripts/practice-selftest.ts
// No fabricated production data; these are synthetic fixtures for the test only.

import type {
  Acknowledgment,
  ControlledDocument,
  DocumentVersion,
  Person,
} from '../src/lib/practice/types.ts';
import {
  computeDrift,
  countAffectedByPublish,
  currentVersion,
} from '../src/lib/practice/documentControl.ts';
import { nextEntry, verifyChain } from '../src/lib/practice/audit.ts';

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures += 1;
    console.error('FAIL:', msg);
  } else {
    console.log('ok:', msg);
  }
}

// Fixtures: one document, v1.0 superseded, v2.0 current.
const doc: ControlledDocument = { id: 'd1', number: 'CGO-SOP-PROC-002', title: null, category: null, requiresAck: true };
const v1: DocumentVersion = { id: 'v1', documentId: 'd1', version: '1.0', status: 'SUPERSEDED', effectiveDate: '2026-01-01', approvedByName: null, approvalDate: null, supersededByVersionId: 'v2', contentRef: null };
const v2: DocumentVersion = { id: 'v2', documentId: 'd1', version: '2.0', status: 'CURRENT', effectiveDate: '2026-06-01', approvedByName: null, approvalDate: null, supersededByVersionId: null, contentRef: null };
const persons: Person[] = [
  { id: 'pA', name: 'A', email: null, role: 'EMPLOYEE', active: true },
  { id: 'pB', name: 'B', email: null, role: 'EMPLOYEE', active: true },
];
const acks: Acknowledgment[] = [
  { id: 'a1', personId: 'pA', documentId: 'd1', documentNumber: doc.number, versionId: 'v1', version: '1.0', timestamp: '2026-02-01T00:00:00Z', statement: 'x', correctsId: null },
  { id: 'a2', personId: 'pB', documentId: 'd1', documentNumber: doc.number, versionId: 'v2', version: '2.0', timestamp: '2026-06-02T00:00:00Z', statement: 'x', correctsId: null },
];

assert(currentVersion('d1', [v1, v2])?.id === 'v2', 'currentVersion returns the single CURRENT');

const drift = computeDrift(persons, [doc], [v1, v2], acks);
assert(drift.length === 1 && drift[0].personId === 'pA', 'drift flags only the person on the stale version');
assert(drift[0].acknowledgedVersion === '1.0' && drift[0].currentVersion === '2.0', 'drift reports stale and current versions');

assert(countAffectedByPublish('d1', 'v2', persons, acks) === 1, 'publish-affected count is the number put out of date');

// Audit chain: build, verify, tamper, detect.
const e1 = await nextEntry(null, { kind: 'ACKNOWLEDGMENT', actor: 'A', summary: 'acked PROC-002 v1.0' });
const e2 = await nextEntry(e1, { kind: 'VERSION_PUBLICATION', actor: 'mgr', summary: 'published PROC-002 v2.0' });
const chain = [e1, e2];
const good = await verifyChain(chain);
assert(good.ok === true, 'clean chain verifies');

const tampered = [ { ...e1, summary: 'acked PROC-002 v2.0 (altered)' }, e2 ];
const bad = await verifyChain(tampered);
assert(bad.ok === false, 'tampered chain fails verification');

if (failures > 0) {
  console.error(`\n${failures} failure(s).`);
  process.exit(1);
}
console.log('\nAll Practice core self-tests passed.');
