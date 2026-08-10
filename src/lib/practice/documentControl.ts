// Document control and version drift. Pure functions over the record set, so the
// most important logic in the system is testable without a database or a UI.
//
// The load-bearing idea: an acknowledgment binds to a VERSION. When a document
// gets a new CURRENT version, everyone whose most recent acknowledgment is
// against an older version is, as of that moment, out of date on current
// procedure. This module computes that set. If it does one thing well, this is
// the thing.

import type {
  Acknowledgment,
  ControlledDocument,
  DocumentVersion,
  DriftEntry,
  Person,
} from './types';

export function currentVersion(
  documentId: string,
  versions: DocumentVersion[],
): DocumentVersion | null {
  const current = versions.filter((v) => v.documentId === documentId && v.status === 'CURRENT');
  // Exactly one CURRENT is the invariant. If more than one, the data is broken;
  // return null rather than guess, so the caller surfaces it rather than hiding it.
  return current.length === 1 ? current[0] : null;
}

export function isSuperseded(version: DocumentVersion): boolean {
  return version.status === 'SUPERSEDED';
}

export function versionHistory(
  documentId: string,
  versions: DocumentVersion[],
): DocumentVersion[] {
  return versions
    .filter((v) => v.documentId === documentId)
    .slice()
    .sort((a, b) => (a.version < b.version ? 1 : -1));
}

// The most recent acknowledgment a person has for a document, by timestamp.
export function latestAck(
  personId: string,
  documentId: string,
  acks: Acknowledgment[],
): Acknowledgment | null {
  const mine = acks
    .filter((a) => a.personId === personId && a.documentId === documentId)
    .slice()
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return mine[0] ?? null;
}

// Everyone out of date on current procedure, across all documents. A person is
// in drift for a document if they have acknowledged it at least once and their
// most recent acknowledgment is not against the current version.
export function computeDrift(
  persons: Person[],
  documents: ControlledDocument[],
  versions: DocumentVersion[],
  acks: Acknowledgment[],
): DriftEntry[] {
  const out: DriftEntry[] = [];
  for (const doc of documents) {
    const current = currentVersion(doc.id, versions);
    if (!current) continue; // no single CURRENT: nothing to drift against
    for (const person of persons) {
      if (!person.active) continue;
      const ack = latestAck(person.id, doc.id, acks);
      if (!ack) continue; // never acknowledged: an assignment gap, not drift
      if (ack.versionId !== current.id) {
        out.push({
          personId: person.id,
          personName: person.name,
          documentId: doc.id,
          documentNumber: doc.number,
          acknowledgedVersion: ack.version,
          currentVersion: current.version,
          since: current.effectiveDate ?? current.approvalDate ?? ack.timestamp,
        });
      }
    }
  }
  return out;
}

// How many active people a new CURRENT version would put out of date: everyone
// who has acknowledged this document and whose most recent acknowledgment is not
// the version about to become current. Shown before the publish is confirmed.
export function countAffectedByPublish(
  documentId: string,
  newCurrentVersionId: string,
  persons: Person[],
  acks: Acknowledgment[],
): number {
  let n = 0;
  for (const person of persons) {
    if (!person.active) continue;
    const ack = latestAck(person.id, documentId, acks);
    if (!ack) continue;
    if (ack.versionId !== newCurrentVersionId) n += 1;
  }
  return n;
}
