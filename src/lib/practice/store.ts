// The provider seam. Practice talks to a PracticeStore, never to a database
// directly, so the Supabase adapter and an in-memory mock are interchangeable
// (the same discipline as a TraceProvider). Append-only is enforced at the
// interface: there are append* methods and read methods, and no update or delete
// for training or acknowledgment records anywhere. A correction is a new append.
//
// The Supabase adapter is a seam stub in this build: the schema and RLS ship as
// migration SQL (supabase/migrations) for the owner to apply, and Auth and MFA
// are dashboard configuration. Until Supabase env is present the public site
// builds and deploys normally and Practice reports itself unavailable.

import type {
  Acknowledgment,
  Assignment,
  AuditEntry,
  ControlledDocument,
  DocumentVersion,
  Person,
} from './types';
import type { Module } from './modules';
import type { Question, Reply } from './questions';
import { nextEntry } from './audit';
import { SEED_DOCUMENTS, SEED_VERSIONS } from './seed';
import { SEED_MODULES } from './moduleSeed';

export type NewAudit = {
  kind: AuditEntry['kind'];
  actor: string | null;
  summary: string;
  source?: string | null;
};

export interface PracticeStore {
  // Reads
  listDocuments(): Promise<ControlledDocument[]>;
  listVersions(): Promise<DocumentVersion[]>;
  listPersons(): Promise<Person[]>;
  listAcknowledgments(): Promise<Acknowledgment[]>;
  listAssignments(): Promise<Assignment[]>;
  listAudit(): Promise<AuditEntry[]>;
  listModules(): Promise<Module[]>;
  listQuestions(): Promise<Question[]>;
  listReplies(): Promise<Reply[]>;
  // Appends (the only writes; no update, no delete)
  appendAcknowledgment(a: Omit<Acknowledgment, 'id'>): Promise<Acknowledgment>;
  appendAssignment(a: Omit<Assignment, 'id'>): Promise<Assignment>;
  appendAudit(entry: NewAudit): Promise<AuditEntry>;
  appendQuestion(q: Omit<Question, 'id'>): Promise<Question>;
  appendReply(r: Omit<Reply, 'id'>): Promise<Reply>;
}

// In-memory mock. Seeded EMPTY: no fabricated employees, completions, dates, or
// versions. Used for local development and tests. Not a production backend.
export class MockPracticeStore implements PracticeStore {
  private documents: ControlledDocument[] = [];
  private versions: DocumentVersion[] = [];
  private persons: Person[] = [];
  private acknowledgments: Acknowledgment[] = [];
  private assignments: Assignment[] = [];
  private audit: AuditEntry[] = [];
  private modules: Module[] = [];
  private questions: Question[] = [];
  private replies: Reply[] = [];
  private counter = 0;

  private id(prefix: string): string {
    this.counter += 1;
    return `${prefix}_${this.counter}`;
  }

  // Test/dev seeding of controlled documents only. Never seeds people or acks.
  seedDocuments(documents: ControlledDocument[], versions: DocumentVersion[]) {
    this.documents = documents.slice();
    this.versions = versions.slice();
  }
  seedPersons(persons: Person[]) {
    this.persons = persons.slice();
  }
  // Module definitions are configuration, not fabricated training: no
  // completions or approvals are seeded, only the module list.
  seedModules(modules: Module[]) {
    this.modules = modules.slice();
  }

  async listDocuments() {
    return this.documents.slice();
  }
  async listVersions() {
    return this.versions.slice();
  }
  async listPersons() {
    return this.persons.slice();
  }
  async listAcknowledgments() {
    return this.acknowledgments.slice();
  }
  async listAssignments() {
    return this.assignments.slice();
  }
  async listAudit() {
    return this.audit.slice();
  }
  async listModules() {
    return this.modules.slice();
  }
  async listQuestions() {
    return this.questions.slice();
  }
  async listReplies() {
    return this.replies.slice();
  }

  async appendAcknowledgment(a: Omit<Acknowledgment, 'id'>) {
    const rec: Acknowledgment = { ...a, id: this.id('ack') };
    this.acknowledgments.push(rec);
    return rec;
  }

  async appendAssignment(a: Omit<Assignment, 'id'>) {
    const rec: Assignment = { ...a, id: this.id('asg') };
    this.assignments.push(rec);
    return rec;
  }

  async appendAudit(entry: NewAudit) {
    const prev = this.audit.length ? this.audit[this.audit.length - 1] : null;
    const rec = await nextEntry(prev, entry);
    this.audit.push(rec);
    return rec;
  }

  async appendQuestion(q: Omit<Question, 'id'>) {
    const rec: Question = { ...q, id: this.id('qn') };
    this.questions.push(rec);
    return rec;
  }

  async appendReply(r: Omit<Reply, 'id'>) {
    const rec: Reply = { ...r, id: this.id('rp') };
    this.replies.push(rec);
    return rec;
  }
}

// Whether Practice is provisioned and enabled. This is deliberately a dedicated
// flag, not the shared Supabase env: the marketing site already sets
// NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY for the capture and reserve
// endpoints, so gating on those would show a sign-in for a system that has no
// tables or Auth yet. The owner sets PRACTICE_ENABLED=true only after applying
// the migration and configuring Auth and MFA (see docs/practice-supabase-setup).
// Until then Practice reports itself unavailable and the public site is
// unaffected.
export function isPracticeConfigured(): boolean {
  return (
    process.env.PRACTICE_ENABLED === 'true' &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY)
  );
}

// The Supabase-backed store is provisioned once the owner applies the migration
// SQL and configures Auth and MFA. Until then, callers must gate on
// isPracticeConfigured() and render the unavailable state.
export function getSupabasePracticeStore(): PracticeStore {
  throw new Error(
    'Practice Supabase store is not provisioned. Apply supabase/migrations and configure Auth and MFA first.',
  );
}

// Access mode for the Practice screens.
//  live    : provisioned (PRACTICE_ENABLED plus Supabase env). Uses Supabase.
//  preview : PRACTICE_PREVIEW=true. Renders the structure against the empty mock
//            (seeded only with the known controlled documents) so the interface
//            can be reviewed without provisioning. No auth, no real records.
//  off     : neither. Screens redirect to the /practice unavailable door.
export type PracticeMode = 'live' | 'preview' | 'off';

export function practiceMode(): PracticeMode {
  if (isPracticeConfigured()) return 'live';
  if (process.env.PRACTICE_PREVIEW === 'true') return 'preview';
  return 'off';
}

// Returns the store for the current mode. In preview it is a fresh mock seeded
// with the known documents only. In live it is the Supabase adapter (a seam stub
// until provisioned). Callers must have checked practiceMode() !== 'off' first.
export function getPracticeStore(): PracticeStore {
  if (isPracticeConfigured()) return getSupabasePracticeStore();
  const mock = new MockPracticeStore();
  mock.seedDocuments(SEED_DOCUMENTS, SEED_VERSIONS);
  mock.seedModules(SEED_MODULES);
  return mock;
}
