// Assessment (CG Prompt 09D). Three types, and the distinction between them is
// the whole point. KNOWLEDGE and SCENARIO are administered and scored by the
// platform; they test recall and judgment against procedure. PRACTICAL is a
// named assessor watching a person perform and signing; the platform records, it
// does not assess. The platform never certifies competency. No time pressure of
// any kind: no timer, no countdown, no time-to-complete recorded. Pure types and
// logic, no DOM, no store.

import type { DocStatus, DocumentVersion } from './types';

export type AssessmentType = 'KNOWLEDGE' | 'SCENARIO' | 'PRACTICAL';
export type AssessmentStatus = DocStatus;

// A knowledge or scenario item. The rationale is shown after answering. section
// names the document section it tests.
export type AssessmentItem = {
  id: string;
  section: string | null;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
};

// A practical assessment carries an observation checklist rather than questions.
export type ChecklistStep = { id: string; step: string };

export type Assessment = {
  id: string; // CGO-ASM-###
  type: AssessmentType;
  teaches: { documentId: string; documentNumber: string; versionId: string; version: string } | null;
  moduleId: string | null; // module it attaches to, or null for NONE
  passThresholdPercent: number | null; // null = NOT APPLICABLE (practical)
  attemptsAllowed: number | null; // null = UNLIMITED
  remediationModuleId: string | null; // module to reassign on failure, or null
  status: AssessmentStatus;
  approvedByName: string | null; // a named human, never an agent
  approvalDate: string | null;
  language: string; // ships 'en'; the schema accommodates more without a migration
  bank: AssessmentItem[]; // knowledge and scenario draw randomly from a bank
  itemsPresented: number; // how many are presented per attempt
  checklist: ChecklistStep[]; // practical only
};

export const ASSESSMENT_CONFIG = {
  // Proposed defaults. Configured, not constants; the real numbers are the
  // owner's to set.
  defaultPassThresholdPercent: 80,
  defaultAttemptsAllowed: 3,
  // A bank smaller than this multiple of the items presented warns on
  // publication, so memorizing answers costs more than learning the material.
  bankMultipleRequired: 3,
};

// A bank below three times the presented count raises a warning on publication.
export function bankSizeWarning(a: Assessment): string | null {
  if (a.type === 'PRACTICAL') return null;
  const min = a.itemsPresented * ASSESSMENT_CONFIG.bankMultipleRequired;
  if (a.bank.length < min) {
    return `bank of ${a.bank.length} is below ${min}, three times the ${a.itemsPresented} presented`;
  }
  return null;
}

// An assessment item binds to a document version and goes out of date in the
// same drift computation as modules.
export function assessmentOutOfDate(a: Assessment, versions: DocumentVersion[]): boolean {
  if (!a.teaches) return false;
  const v = versions.find((x) => x.id === a.teaches!.versionId);
  return v ? v.status === 'SUPERSEDED' || v.status === 'WITHDRAWN' : true;
}

// Score a knowledge or scenario attempt. No time is recorded. Returns the
// percentage, pass state, and the sections missed, so failure can name what to
// revisit without any commentary on the person.
export function scoreAttempt(
  a: Assessment,
  presented: AssessmentItem[],
  answers: number[],
): { percent: number; passed: boolean; missedSections: string[] } {
  const correct = presented.reduce((n, item, i) => n + (answers[i] === item.correctIndex ? 1 : 0), 0);
  const percent = presented.length ? Math.round((correct / presented.length) * 100) : 0;
  const passed = a.passThresholdPercent !== null && percent >= a.passThresholdPercent;
  const missedSections = presented
    .filter((item, i) => answers[i] !== item.correctIndex)
    .map((item) => item.section ?? 'UNKNOWN');
  return { percent, passed, missedSections };
}

// Repeated failure is a human matter. After the attempt limit, the item
// escalates to the operations manager and APEX takes no further automated
// action: it does not lock the account, flag the person, or write anything
// characterizing them.
export function shouldEscalate(a: Assessment, failedAttempts: number): boolean {
  return a.attemptsAllowed !== null && failedAttempts >= a.attemptsAllowed;
}
