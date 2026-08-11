-- Practice training modules (CG Prompt 09C). Follows 0001_practice_foundation.
-- Not applied here. Apply when the Practice backend is provisioned, alongside the
-- 0001 auth, roles, and RLS setup. Everything that is evidence is append only:
-- no client update, no client delete, enforced at the grant and policy layer the
-- same way 0001 handles acknowledgments.
--
-- The recognition layer (Amendment One) has NO table by design. It is
-- presentation computed from the training record and is excluded from every
-- export. There is deliberately no column anywhere for time to complete.

-- A module and its versions. Status mirrors document status.
create table if not exists practice_modules (
  id                text primary key,        -- CGO-MOD-###
  title             text,
  teaches_kind      text not null check (teaches_kind in ('DOCUMENT','NONE','PENDING')),
  teaches_doc_id    text references practice_documents(id),
  teaches_version_id text references practice_document_versions(id),
  teaches_pending_note text,
  source            text not null check (source in ('INTERNAL','EXTERNAL_PACKAGE')),
  created_at        timestamptz not null default now()
);

create table if not exists practice_module_versions (
  id                text primary key,
  module_id         text not null references practice_modules(id),
  version           text not null,
  status            text not null check (status in ('DRAFT','IN_REVIEW','CURRENT','SUPERSEDED','WITHDRAWN')),
  effective_date    date,
  approved_by_name  text,                     -- a named human; never an agent
  approval_date     date,
  duration_minutes  integer,
  duration_reason   text,                     -- required when duration exceeds the threshold
  expiry_period_days integer,                 -- null = NONE
  superseded_by     text references practice_module_versions(id),
  created_at        timestamptz not null default now()
);
-- One CURRENT version per module, the same constraint documents carry.
create unique index if not exists practice_module_one_current
  on practice_module_versions (module_id) where status = 'CURRENT';

create table if not exists practice_module_blocks (
  id                text primary key,
  module_version_id text not null references practice_module_versions(id),
  ordinal           integer not null,
  type              text not null check (type in ('TEXT','DOCUMENT_EXCERPT','VIDEO','IMAGE','CHECKPOINT','ACKNOWLEDGMENT')),
  -- A DOCUMENT_EXCERPT stores only the section pointer; the text is pulled live
  -- from the document record, never copied here.
  payload           jsonb not null default '{}'::jsonb
);

-- Completion is evidence. Append only. completed_at is the true completion time;
-- synced_at records when an offline record reached the server. integrity_flag
-- marks a completion the checks found implausible.
create table if not exists practice_module_completions (
  id                text primary key,
  module_id         text not null references practice_modules(id),
  module_version    text not null,
  person_id         text not null references practice_persons(id),
  teaches_doc_number text,
  teaches_version   text,
  completed_at      timestamptz not null,
  synced_at         timestamptz,
  playback_trail    jsonb not null default '[]'::jsonb,
  integrity_flag    text,
  source            text not null check (source in ('INTERNAL','EXTERNAL_PACKAGE')),
  created_at        timestamptz not null default now()
);

-- Questions bind to the document version they were asked against.
create table if not exists practice_questions (
  id                text primary key,
  module_id         text not null references practice_modules(id),
  section_ref       text,
  document_number   text,
  document_version  text,
  asked_by          text not null references practice_persons(id),
  asked_at          timestamptz not null,
  body              text not null,
  answered_reply_id text,                     -- set only to a manager or assessor reply
  flagged_on_supersede boolean not null default false
);

create table if not exists practice_question_replies (
  id                text primary key,
  question_id       text not null references practice_questions(id),
  author_id         text not null references practice_persons(id),
  author_role       text not null,
  at                timestamptz not null,
  body              text not null,
  kind              text not null check (kind in ('AUTHORITATIVE','PEER')),
  adds_information  boolean not null default false
);

-- The adds-information control raises a finding to the operations manager.
create table if not exists practice_sop_revision_findings (
  id                text primary key,
  question_id       text not null references practice_questions(id),
  reply_id          text not null references practice_question_replies(id),
  module_id         text not null references practice_modules(id),
  document_number   text,
  document_version  text,
  raised_at         timestamptz not null,
  status            text not null default 'OPEN' check (status in ('OPEN','RESOLVED'))
);

-- A credential is granted only by a named assessor. It supersedes with its
-- document version. APEX cannot grant one; the attempt records in WARRANT.
create table if not exists practice_credentials (
  id                text primary key,
  person_id         text not null references practice_persons(id),
  procedure_title   text not null,
  document_id       text not null references practice_documents(id),
  version_id        text not null references practice_document_versions(id),
  version           text not null,
  assessed_by_name  text not null,
  granted_at        timestamptz not null
);

-- Enable RLS on every table. Policies mirror 0001: read-only client access
-- scoped by role, no client insert/update/delete on evidence tables (writes go
-- through the server). Author the policies alongside the 0001 policy set.
alter table practice_modules enable row level security;
alter table practice_module_versions enable row level security;
alter table practice_module_blocks enable row level security;
alter table practice_module_completions enable row level security;
alter table practice_questions enable row level security;
alter table practice_question_replies enable row level security;
alter table practice_sop_revision_findings enable row level security;
alter table practice_credentials enable row level security;

-- No practice_recognition table exists, and none should be added. Recognition is
-- computed from the tables above and is excluded from every compliance export.
