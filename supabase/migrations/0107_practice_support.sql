-- CG Prompt 09E support tables. Questions bind to a module and the document
-- version asked against. Only a manager or assessor answer can be the answer,
-- enforced in the write policy. Notifications record every delivery against the
-- assignment, so an overdue item can be answered with what was sent and when.

create table practice_questions (
  id            uuid primary key default gen_random_uuid(),
  module_id     text not null references practice_modules(id),
  section_ref   text,
  document_version_id uuid references practice_document_versions(id),
  asked_by      uuid not null references practice_persons(id),
  body          text not null,
  answered_reply_id uuid,
  flagged_on_supersede boolean not null default false,
  asked_at      timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create table practice_question_answers (
  id            uuid primary key default gen_random_uuid(),
  question_id   uuid not null references practice_questions(id),
  author_id     uuid not null references practice_persons(id),
  author_role   text not null,
  kind          text not null check (kind in ('AUTHORITATIVE','PEER')),
  body          text not null,
  adds_information boolean not null default false,
  answered_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- Preference per person, per notification class. A null channel means no channel
-- is reachable for that class, which the console surfaces.
create table practice_notification_preferences (
  person_id     uuid not null references practice_persons(id),
  notification_class text not null check (notification_class in ('ASSIGNMENT','REMINDER','ESCALATION','EXPIRY')),
  channel       text check (channel in ('IN_APP','EMAIL','SMS')),
  primary key (person_id, notification_class)
);
create table practice_notification_deliveries (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid references practice_assignments(id),
  person_id     uuid not null references practice_persons(id),
  channel       text not null check (channel in ('IN_APP','EMAIL','SMS')),
  notification_class text not null,
  sent_at       timestamptz not null default now()
);
