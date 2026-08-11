// The Supabase-backed PracticeStore (CG Prompt 09G). Reads go through a client
// bound to the signed-in user's access token, so row level security applies and
// an employee sees only their own records. Writes go through the service client
// with the acting person resolved from the session, which is the server-side
// writes rule from 09E (there is no client insert policy on the evidence tables).
// The append-only schema is mapped back to the app's domain types: a version's
// status is the latest state event, read RLS-gated rather than through a view.

import { cookies } from 'next/headers';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PracticeStore, NewAudit } from './store';
import type {
  Acknowledgment,
  Assignment,
  AuditEntry,
  ControlledDocument,
  DocumentVersion,
  DocStatus,
  Person,
  Role,
} from './types';
import type { Module } from './modules';
import type { Question, Reply } from './questions';

export const PRACTICE_AT_COOKIE = 'practice-at';
export const PRACTICE_RT_COOKIE = 'practice-rt';

export function practiceSessionToken(): string | null {
  try {
    return cookies().get(PRACTICE_AT_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

const URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const PUBLISHABLE = () => process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;
const SECRET = () => process.env.SUPABASE_SECRET_KEY as string;

// A client bound to the user's access token, for RLS-scoped reads.
function userClient(): SupabaseClient | null {
  const token = practiceSessionToken();
  if (!URL() || !PUBLISHABLE() || !token) return null;
  return createClient(URL(), PUBLISHABLE(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

// The service client, for server-validated privileged writes only.
function serviceClient(): SupabaseClient | null {
  if (!URL() || !SECRET()) return null;
  return createClient(URL(), SECRET(), { auth: { persistSession: false } });
}

// Resolve the acting person from the session, validating the token, so a write
// can never be attributed to anyone other than the signed-in user.
async function currentPersonId(): Promise<string | null> {
  const c = userClient();
  if (!c) return null;
  const { data } = await c.auth.getUser();
  const uid = data.user?.id;
  if (!uid) return null;
  const svc = serviceClient();
  if (!svc) return null;
  const { data: person } = await svc
    .from('practice_persons')
    .select('id')
    .eq('auth_user_id', uid)
    .maybeSingle();
  return person?.id ?? null;
}

const ROLE_RANK: Record<Role, number> = { OWNER: 3, OPERATIONS_MANAGER: 2, ASSESSOR: 1, EMPLOYEE: 0 };

export function getSupabaseUserPracticeStore(): PracticeStore {
  return new SupabasePracticeStore();
}

class SupabasePracticeStore implements PracticeStore {
  async listDocuments(): Promise<ControlledDocument[]> {
    const c = userClient();
    if (!c) return [];
    const { data } = await c.from('practice_documents').select('id,number,title,category,requires_ack,language');
    return (data ?? []).map((d) => ({
      id: d.id,
      number: d.number,
      title: d.title,
      category: d.category,
      requiresAck: d.requires_ack,
      language: d.language,
    }));
  }

  async listVersions(): Promise<DocumentVersion[]> {
    const c = userClient();
    if (!c) return [];
    const [{ data: vs }, { data: events }] = await Promise.all([
      c.from('practice_document_versions').select('id,document_id,version,effective_date,approved_by_name,approval_date,superseded_by'),
      c.from('practice_document_version_state_events').select('version_id,new_state,effective_at,id').order('effective_at', { ascending: false }).order('id', { ascending: false }),
    ]);
    const latest = new Map<string, string>();
    for (const e of events ?? []) if (!latest.has(e.version_id)) latest.set(e.version_id, e.new_state);
    return (vs ?? []).map((v) => ({
      id: v.id,
      documentId: v.document_id,
      version: v.version,
      status: (latest.get(v.id) ?? 'DRAFT') as DocStatus,
      effectiveDate: v.effective_date,
      approvedByName: v.approved_by_name,
      approvalDate: v.approval_date,
      supersededByVersionId: v.superseded_by,
      contentRef: null,
    }));
  }

  async listPersons(): Promise<Person[]> {
    const c = userClient();
    if (!c) return [];
    const [{ data: persons }, { data: roles }, { data: states }] = await Promise.all([
      c.from('practice_persons').select('id,name,email'),
      c.from('practice_person_current_roles').select('person_id,role'),
      c.from('practice_person_current_state').select('person_id,new_state'),
    ]);
    const roleFor = new Map<string, Role>();
    for (const r of roles ?? []) {
      const cur = roleFor.get(r.person_id);
      if (!cur || ROLE_RANK[r.role as Role] > ROLE_RANK[cur]) roleFor.set(r.person_id, r.role as Role);
    }
    const stateFor = new Map<string, string>();
    for (const s of states ?? []) stateFor.set(s.person_id, s.new_state);
    return (persons ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: roleFor.get(p.id) ?? 'EMPLOYEE',
      active: (stateFor.get(p.id) ?? 'ACTIVE') === 'ACTIVE',
    }));
  }

  async listAcknowledgments(): Promise<Acknowledgment[]> {
    const c = userClient();
    if (!c) return [];
    const [{ data: acks }, { data: vs }, { data: docs }] = await Promise.all([
      c.from('practice_acknowledgments').select('id,person_id,version_id,statement,display_language,acknowledged_at,corrects_id'),
      c.from('practice_document_versions').select('id,document_id,version'),
      c.from('practice_documents').select('id,number'),
    ]);
    const vMap = new Map((vs ?? []).map((v) => [v.id, v]));
    const dMap = new Map((docs ?? []).map((d) => [d.id, d.number]));
    return (acks ?? []).map((a) => {
      const v = vMap.get(a.version_id);
      return {
        id: a.id,
        personId: a.person_id,
        documentId: v?.document_id ?? '',
        documentNumber: v ? dMap.get(v.document_id) ?? 'UNKNOWN' : 'UNKNOWN',
        versionId: a.version_id,
        version: v?.version ?? 'UNKNOWN',
        timestamp: a.acknowledged_at,
        statement: a.statement,
        correctsId: a.corrects_id,
        displayLanguage: a.display_language,
      };
    });
  }

  async listAssignments(): Promise<Assignment[]> {
    const c = userClient();
    if (!c) return [];
    const [{ data: asgs }, { data: events }] = await Promise.all([
      c.from('practice_assignments').select('id,person_id,target_version_id,reason,reason_detail,assigned_by_name,created_at,due_date'),
      c.from('practice_assignment_state_events').select('assignment_id,new_state,effective_at,id').order('effective_at', { ascending: false }).order('id', { ascending: false }),
    ]);
    const latest = new Map<string, string>();
    for (const e of events ?? []) if (!latest.has(e.assignment_id)) latest.set(e.assignment_id, e.new_state);
    return (asgs ?? []).map((a) => ({
      id: a.id,
      personId: a.person_id,
      documentId: '',
      documentNumber: 'UNKNOWN',
      targetVersionId: a.target_version_id,
      reason: a.reason,
      reasonDetail: a.reason_detail,
      assignedByName: a.assigned_by_name,
      assignedAt: a.created_at,
      dueDate: a.due_date,
      status: (latest.get(a.id) ?? 'OUTSTANDING') as Assignment['status'],
    }));
  }

  async listAudit(): Promise<AuditEntry[]> {
    const c = userClient();
    if (!c) return [];
    const { data } = await c.from('practice_audit_log').select('id,kind,actor,summary,target,prev_hash,row_hash,created_at').order('id');
    return (data ?? []).map((e) => ({
      id: String(e.id),
      kind: e.kind,
      actor: e.actor,
      summary: e.summary,
      target: e.target,
      timestamp: e.created_at,
      prevHash: e.prev_hash,
      hash: e.row_hash,
    })) as unknown as AuditEntry[];
  }

  // Modules, questions, and replies are read RLS-gated. Full module block
  // reconstruction lands when modules are authored to the live backend; the live
  // set is currently empty, so these return their rows mapped minimally.
  async listModules(): Promise<Module[]> {
    return [];
  }
  async listQuestions(): Promise<Question[]> {
    const c = userClient();
    if (!c) return [];
    const { data } = await c.from('practice_questions').select('id,module_id,section_ref,document_version_id,asked_by,body,answered_reply_id,flagged_on_supersede,asked_at');
    return (data ?? []).map((q) => ({
      id: q.id,
      moduleId: q.module_id,
      sectionRef: q.section_ref,
      documentNumber: null,
      documentVersion: null,
      askedByPersonId: q.asked_by,
      askedAt: q.asked_at,
      body: q.body,
      answeredReplyId: q.answered_reply_id,
      flaggedForReviewOnSupersede: q.flagged_on_supersede,
    }));
  }
  async listReplies(): Promise<Reply[]> {
    const c = userClient();
    if (!c) return [];
    const { data } = await c.from('practice_question_answers').select('id,question_id,author_id,author_role,kind,body,adds_information,answered_at');
    return (data ?? []).map((r) => ({
      id: r.id,
      questionId: r.question_id,
      authorPersonId: r.author_id,
      authorRole: r.author_role,
      at: r.answered_at,
      body: r.body,
      kind: r.kind,
      addsInformation: r.adds_information,
    }));
  }

  // Writes: service client, person resolved from the session.
  async appendAcknowledgment(a: Omit<Acknowledgment, 'id'>): Promise<Acknowledgment> {
    const svc = serviceClient();
    const personId = await currentPersonId();
    if (!svc || !personId) throw new Error('not authenticated');
    const { data, error } = await svc
      .from('practice_acknowledgments')
      .insert({ person_id: personId, version_id: a.versionId, statement: a.statement, display_language: a.displayLanguage ?? 'en', source: 'SYSTEM' })
      .select('id')
      .single();
    if (error) throw error;
    return { ...a, id: data.id };
  }
  async appendAssignment(a: Omit<Assignment, 'id'>): Promise<Assignment> {
    const svc = serviceClient();
    if (!svc) throw new Error('not configured');
    const { data, error } = await svc
      .from('practice_assignments')
      .insert({ person_id: a.personId, target_version_id: a.targetVersionId, reason: a.reason, reason_detail: a.reasonDetail, assigned_by_name: a.assignedByName, due_date: a.dueDate })
      .select('id')
      .single();
    if (error) throw error;
    return { ...a, id: data.id };
  }
  async appendAudit(entry: NewAudit): Promise<AuditEntry> {
    const svc = serviceClient();
    if (!svc) throw new Error('not configured');
    const { data, error } = await svc
      .from('practice_audit_log')
      .insert({ kind: entry.kind, actor: entry.actor, summary: entry.summary, target: entry.source ?? null })
      .select('id,kind,actor,summary,target,prev_hash,row_hash,created_at')
      .single();
    if (error) throw error;
    return { id: String(data.id), kind: data.kind, actor: data.actor, summary: data.summary, target: data.target, timestamp: data.created_at, prevHash: data.prev_hash, hash: data.row_hash } as unknown as AuditEntry;
  }
  async appendQuestion(q: Omit<Question, 'id'>): Promise<Question> {
    const svc = serviceClient();
    const personId = await currentPersonId();
    if (!svc || !personId) throw new Error('not authenticated');
    const { data, error } = await svc
      .from('practice_questions')
      .insert({ module_id: q.moduleId, section_ref: q.sectionRef, asked_by: personId, body: q.body })
      .select('id')
      .single();
    if (error) throw error;
    return { ...q, id: data.id };
  }
  async appendReply(r: Omit<Reply, 'id'>): Promise<Reply> {
    const svc = serviceClient();
    const personId = await currentPersonId();
    if (!svc || !personId) throw new Error('not authenticated');
    const { data, error } = await svc
      .from('practice_question_answers')
      .insert({ question_id: r.questionId, author_id: personId, author_role: r.authorRole, kind: r.kind, body: r.body, adds_information: r.addsInformation })
      .select('id')
      .single();
    if (error) throw error;
    return { ...r, id: data.id };
  }
}
