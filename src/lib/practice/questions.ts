// Questions and discussion (CG Prompt 09C Section 7). Every module carries a
// question thread bound to a specific document version. The constraints keep it
// from becoming a second source of procedure: only a manager or assessor answer
// can be marked as the answer, peer replies render distinct under a non-guidance
// label, answered threads flag for review when their document version
// supersedes, and an answer that adds to procedure raises a finding to the
// operations manager rather than standing as a fix. Pure types and logic.

import type { Role } from './types';

export type Question = {
  id: string;
  moduleId: string;
  sectionRef: string | null; // which step, for the comprehension digest
  documentNumber: string | null; // the version it was asked against
  documentVersion: string | null;
  askedByPersonId: string;
  askedAt: string;
  body: string;
  answeredReplyId: string | null; // set only to a manager or assessor reply
  flaggedForReviewOnSupersede: boolean;
};

export type ReplyKind = 'AUTHORITATIVE' | 'PEER';

export type Reply = {
  id: string;
  questionId: string;
  authorPersonId: string;
  authorRole: Role;
  at: string;
  body: string;
  kind: ReplyKind;
  // The one control on the answer form. Selecting it raises an SOP revision
  // finding to the operations manager.
  addsInformation: boolean;
};

// The label under every peer reply. Peer replies sit in the secondary text
// treatment; this states plainly that they are not procedural guidance.
export const PEER_LABEL = 'Peer comment, not procedural guidance';

// A reply is authoritative only when its author is a manager or assessor.
export function replyKindFor(role: Role): ReplyKind {
  return role === 'OPERATIONS_MANAGER' || role === 'ASSESSOR' ? 'AUTHORITATIVE' : 'PEER';
}

// Rule 1: only a manager or assessor answer can be marked as the answer. No
// upvoting, no accepted-answer-by-consensus, no peer answer promotion.
export function canMarkAsAnswer(reply: Reply): boolean {
  return (
    reply.kind === 'AUTHORITATIVE' &&
    (reply.authorRole === 'OPERATIONS_MANAGER' || reply.authorRole === 'ASSESSOR')
  );
}

// Rule 2: when a document version supersedes, every answered thread asked
// against that version is flagged for review, because an answer correct under
// v2.0 may be wrong under v3.0.
export function flagAnsweredOnSupersede(
  questions: Question[],
  docNumber: string,
  version: string,
): Question[] {
  return questions.map((q) =>
    q.answeredReplyId && q.documentNumber === docNumber && q.documentVersion === version
      ? { ...q, flaggedForReviewOnSupersede: true }
      : q,
  );
}

// Rule 3: an answer that adds information not in the SOP is a signal, not a fix.
// A finding is raised to the operations manager proposing an SOP revision, which
// turns the discussion into an input to document control.
export type SopRevisionFinding = {
  id: string;
  questionId: string;
  replyId: string;
  moduleId: string;
  documentNumber: string | null;
  documentVersion: string | null;
  raisedAt: string;
  status: 'OPEN' | 'RESOLVED';
};

export function raiseSopRevisionFinding(
  question: Question,
  reply: Reply,
  raisedAt: string,
  id: string,
): SopRevisionFinding | null {
  if (!reply.addsInformation) return null;
  return {
    id,
    questionId: question.id,
    replyId: reply.id,
    moduleId: question.moduleId,
    documentNumber: question.documentNumber,
    documentVersion: question.documentVersion,
    raisedAt,
    status: 'OPEN',
  };
}

// Comprehension digest: repeated questions on the same module or section surface
// to the manager. Five on one step of the press SOP means the module, the SOP,
// or the step is unclear, and any of the three is worth knowing.
export type DigestEntry = { moduleId: string; sectionRef: string | null; count: number };

export function questionDigest(questions: Question[], threshold = 5): DigestEntry[] {
  const counts = new Map<string, DigestEntry>();
  for (const q of questions) {
    const key = `${q.moduleId}|${q.sectionRef ?? ''}`;
    const entry = counts.get(key) ?? { moduleId: q.moduleId, sectionRef: q.sectionRef, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }
  return Array.from(counts.values()).filter((e) => e.count >= threshold);
}
