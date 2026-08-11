-- CG Prompt 09E and 09D assessment. Knowledge and scenario items scored by the
-- platform; practical assessments recorded, never scored. Assessor authority is
-- per procedure, enforced in the RLS write policy (0110), not in application code.
-- No timer, no time-to-complete column anywhere.

create table practice_assessments (
  id            text primary key, -- CGO-ASM-###
  type          text not null check (type in ('KNOWLEDGE','SCENARIO','PRACTICAL')),
  teaches_version_id uuid references practice_document_versions(id),
  module_id     text references practice_modules(id),
  pass_threshold_percent integer, -- null = not applicable (practical)
  attempts_allowed integer, -- null = unlimited
  remediation_module_id text references practice_modules(id),
  language      text not null default 'en',
  items_presented integer not null default 0,
  created_at    timestamptz not null default now(),
  created_by    uuid
);
create table practice_assessment_state_events (
  id            bigint generated always as identity primary key,
  assessment_id text not null references practice_assessments(id),
  new_state     text not null check (new_state in ('DRAFT','IN_REVIEW','CURRENT','SUPERSEDED')),
  effective_at  timestamptz not null,
  actor         uuid,
  approved_by_name text,
  reason        text,
  corrects_id   bigint references practice_assessment_state_events(id),
  created_at    timestamptz not null default now()
);

-- The item bank. A bank below three times the presented count warns on publish.
create table practice_assessment_items (
  id            uuid primary key default gen_random_uuid(),
  assessment_id text not null references practice_assessments(id),
  section       text,
  question      text not null,
  options       jsonb not null,
  correct_index integer not null,
  rationale     text not null,
  created_at    timestamptz not null default now()
);

-- Attempts. No time recorded.
create table practice_attempts (
  id            uuid primary key default gen_random_uuid(),
  assessment_id text not null references practice_assessments(id),
  person_id     uuid not null references practice_persons(id),
  percent       integer,
  passed        boolean,
  completed_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create table practice_attempt_responses (
  id            uuid primary key default gen_random_uuid(),
  attempt_id    uuid not null references practice_attempts(id),
  item_id       uuid not null references practice_assessment_items(id),
  chosen_index  integer,
  correct       boolean
);

-- Practical assessment and its checklist result. The sign-off is rejected in the
-- write policy from anyone whose credential on the procedure is not current.
create table practice_practical_assessments (
  id            uuid primary key default gen_random_uuid(),
  assessor_person_id uuid not null references practice_persons(id),
  assessor_credential_id uuid,
  person_id     uuid not null references practice_persons(id),
  document_version_id uuid not null references practice_document_versions(id),
  assessed_on   date not null,
  created_at    timestamptz not null default now()
);
create table practice_practical_checklist_results (
  id            uuid primary key default gen_random_uuid(),
  practical_id  uuid not null references practice_practical_assessments(id),
  step          text not null,
  observed      boolean not null,
  note          text
);

-- Credentials. Granted only by a named assessor. Status held as events; a
-- credential supersedes with its document version. provenance records where the
-- first qualification came from, external for new equipment.
create table practice_credentials (
  id            uuid primary key default gen_random_uuid(),
  person_id     uuid not null references practice_persons(id),
  procedure_title text not null,
  document_version_id uuid not null references practice_document_versions(id),
  assessed_by_name text not null,
  provenance_kind text check (provenance_kind in ('INTERNAL_CREDENTIAL','VENDOR_TRAINING','EXTERNAL_COURSE','CONTRACTOR_ASSESSMENT')),
  provenance_reference text,
  granted_at    timestamptz not null,
  created_at    timestamptz not null default now()
);
create table practice_credential_state_events (
  id            bigint generated always as identity primary key,
  credential_id uuid not null references practice_credentials(id),
  new_state     text not null check (new_state in ('CURRENT','SUPERSEDED','EXPIRED')),
  effective_at  timestamptz not null,
  actor         uuid,
  reason        text,
  corrects_id   bigint references practice_credential_state_events(id),
  created_at    timestamptz not null default now()
);
