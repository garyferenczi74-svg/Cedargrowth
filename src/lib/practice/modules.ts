// Training modules (CG Prompt 09C). A module binds to a controlled document
// version, or to nothing. When the document supersedes, the module is out of
// date in the same drift computation that flags people, and a module teaching a
// superseded version cannot be assigned. Completion is evidence: append only,
// playback verified, never fabricated. Pure types and logic, no DOM, no store.

import type { DocStatus, DocumentVersion, Role } from './types';

// Module status mirrors document status deliberately: same vocabulary, same
// supersession behavior, same non-dismissible banner on a superseded module.
export type ModuleStatus = DocStatus;

export type ModuleSource = 'INTERNAL' | 'EXTERNAL_PACKAGE';

// What a module teaches. A controlled document version, or NONE (legitimate for
// generic safety content), or PENDING when the document has no number recorded
// yet, which blocks the module.
export type Teaches =
  | { kind: 'DOCUMENT'; documentId: string; documentNumber: string; versionId: string; version: string }
  | { kind: 'NONE' }
  | { kind: 'PENDING'; note: string };

export type BlockType =
  | 'TEXT'
  | 'DOCUMENT_EXCERPT'
  | 'VIDEO'
  | 'IMAGE'
  | 'CHECKPOINT'
  | 'ACKNOWLEDGMENT';

// Six content block types. A DOCUMENT_EXCERPT names the section to pull live from
// the document record; it never copies the text, which is the mechanism that
// prevents a module teaching text the SOP no longer contains.
export type ContentBlock =
  | { type: 'TEXT'; id: string; contentRef: string | null }
  | { type: 'DOCUMENT_EXCERPT'; id: string; documentNumber: string; version: string; sectionRef: string | null }
  | { type: 'VIDEO'; id: string; videoRef: string | null; completionPercent: number }
  | { type: 'IMAGE'; id: string; imageRef: string | null; alt: string; caption: string | null }
  | { type: 'CHECKPOINT'; id: string; prompt: string | null }
  | { type: 'ACKNOWLEDGMENT'; id: string };

export type Module = {
  id: string; // CGO-MOD-###
  title: string | null;
  teaches: Teaches;
  status: ModuleStatus;
  version: string;
  effectiveDate: string | null; // ISO, or null -> UNKNOWN
  approvedByName: string | null; // a named human, never an agent
  approvalDate: string | null;
  durationMinutes: number | null; // above the threshold requires a stated reason
  durationReason: string | null;
  blocks: ContentBlock[];
  assessmentRef: string | null; // optional, built in 09D
  prerequisites: string[]; // module ids that must complete first
  roles: Role[]; // default assignment by role
  expiryPeriodDays: number | null; // period after completion before reassignment, or null for NONE
  source: ModuleSource;
};

// The evidence a video block records. watchedPercent is true watched coverage,
// not the furthest position reached, so seeking forward past unwatched content
// does not inflate it.
export type PlaybackEvent = { at: string; positionPercent: number; watchedPercent: number };

// A completion is evidence. completedAt is the TRUE completion time, preserved
// across an offline sync; syncedAt records when an offline record reached the
// server. integrityFlag, when set, marks a completion the checks found
// implausible: it is a finding, and it earns no recognition.
export type ModuleCompletion = {
  id: string;
  moduleId: string;
  moduleVersion: string;
  personId: string;
  teachesDocumentNumber: string | null;
  teachesVersion: string | null;
  completedAt: string;
  syncedAt: string | null;
  playbackTrail: PlaybackEvent[];
  integrityFlag: string | null;
  source: ModuleSource;
};

export const MODULE_CONFIG = {
  // A video block completes at this percentage watched, unless the block states
  // its own. Configured, not a constant.
  defaultVideoCompletionPercent: 95,
  // Duration above this many target minutes requires a stated reason on the
  // record.
  durationReasonThresholdMinutes: 10,
};

// The status of the document version a module teaches, or NONE / PENDING.
export function taughtVersionStatus(
  m: Module,
  versions: DocumentVersion[],
): DocStatus | 'NONE' | 'PENDING' {
  const t = m.teaches;
  if (t.kind === 'NONE') return 'NONE';
  if (t.kind === 'PENDING') return 'PENDING';
  const v = versions.find((x) => x.id === t.versionId);
  return v ? v.status : 'PENDING';
}

// A module is out of date when the document version it teaches is no longer
// live. This is the drift computation applied to content rather than to people.
export function moduleIsOutOfDate(m: Module, versions: DocumentVersion[]): boolean {
  const s = taughtVersionStatus(m, versions);
  return s === 'SUPERSEDED' || s === 'WITHDRAWN';
}

export function computeModuleDrift(modules: Module[], versions: DocumentVersion[]): Module[] {
  return modules.filter((m) => moduleIsOutOfDate(m, versions));
}

// Rule 1 and the acceptance line: a module teaching a superseded document
// version cannot be assigned. Also blocked: a module whose document number is
// pending, and a module not in CURRENT status.
export function moduleIsAssignable(
  m: Module,
  versions: DocumentVersion[],
): { ok: boolean; reason: string | null } {
  if (m.status !== 'CURRENT') return { ok: false, reason: `module status is ${m.status}` };
  if (m.teaches.kind === 'PENDING') return { ok: false, reason: 'document number pending' };
  if (moduleIsOutOfDate(m, versions)) return { ok: false, reason: 'teaches a superseded document version' };
  return { ok: true, reason: null };
}

// Video completion is measured from playback, never from a Next button. A video
// block completes only when true watched coverage reaches its threshold.
export function videoBlockComplete(
  block: Extract<ContentBlock, { type: 'VIDEO' }>,
  trail: PlaybackEvent[],
): boolean {
  if (trail.length === 0) return false;
  const watched = Math.max(...trail.map((e) => e.watchedPercent));
  return watched >= block.completionPercent;
}

// A completion recorded on a module that has a video block, without any playback
// trail, is an integrity finding, not a completion.
export function completionHasPlaybackEvidence(m: Module, c: ModuleCompletion): boolean {
  const hasVideo = m.blocks.some((b) => b.type === 'VIDEO');
  if (!hasVideo) return true;
  return c.playbackTrail.length > 0;
}

// A module whose target duration exceeds the threshold must carry a stated
// reason on the record.
export function durationReasonSatisfied(m: Module): boolean {
  if (m.durationMinutes === null) return true;
  if (m.durationMinutes <= MODULE_CONFIG.durationReasonThresholdMinutes) return true;
  return Boolean(m.durationReason && m.durationReason.trim());
}

// External modules carry the same record discipline; this names them for the
// library and the floor so a technician knows whether they are being taught
// CedarGrowth procedure or general practice.
export function isExternal(m: Module): boolean {
  return m.source === 'EXTERNAL_PACKAGE';
}
