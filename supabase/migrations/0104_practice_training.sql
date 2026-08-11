-- CG Prompt 09E training, with the 09H additions (block video kind, certifying
-- curricula, cohorts). Module and assignment status held as append-only events.

create table practice_modules (
  id            text primary key, -- CGO-MOD-###
  title         text,
  teaches_version_id uuid references practice_document_versions(id),
  teaches_pending_note text,
  source        text not null check (source in ('INTERNAL','EXTERNAL_PACKAGE')),
  language      text not null default 'en',
  created_at    timestamptz not null default now(),
  created_by    uuid
);

create table practice_module_versions (
  id            uuid primary key default gen_random_uuid(),
  module_id     text not null references practice_modules(id),
  version       text not null,
  effective_date date,
  approved_by_name text,
  approval_date date,
  duration_minutes integer,
  duration_reason text,
  expiry_period_days integer,
  superseded_by uuid references practice_module_versions(id),
  created_at    timestamptz not null default now(),
  created_by    uuid,
  unique (module_id, version)
);

create table practice_module_version_state_events (
  id            bigint generated always as identity primary key,
  module_version_id uuid not null references practice_module_versions(id),
  new_state     text not null check (new_state in ('DRAFT','IN_REVIEW','CURRENT','SUPERSEDED','WITHDRAWN')),
  effective_at  timestamptz not null,
  actor         uuid,
  reason        text,
  corrects_id   bigint references practice_module_version_state_events(id),
  created_at    timestamptz not null default now()
);

-- Blocks, ordered. A VIDEO block is SYNTHETIC or FOOTAGE (09H): an equipment
-- module needs at least one FOOTAGE block, enforced in the publish flow.
create table practice_module_blocks (
  id            uuid primary key default gen_random_uuid(),
  module_version_id uuid not null references practice_module_versions(id),
  ordinal       integer not null,
  type          text not null check (type in ('TEXT','DOCUMENT_EXCERPT','VIDEO','IMAGE','CHECKPOINT','ACKNOWLEDGMENT')),
  video_kind    text check (video_kind in ('SYNTHETIC','FOOTAGE')),
  payload       jsonb not null default '{}'::jsonb
);

create table practice_curricula (
  id            text primary key, -- CGO-CUR-### or the baseline curriculum
  name          text,
  certifying    boolean not null default false,
  created_at    timestamptz not null default now(),
  created_by    uuid
);
create table practice_curriculum_modules (
  curriculum_id text not null references practice_curricula(id),
  module_id     text not null references practice_modules(id),
  ordinal       integer not null,
  primary key (curriculum_id, module_id)
);

-- Cohorts (09H): a named intake with a target floor-ready date.
create table practice_cohorts (
  id            text primary key, -- CGO-COH-###
  name          text not null,
  start_date    date,
  curriculum_id text references practice_curricula(id),
  target_date   date,
  created_at    timestamptz not null default now(),
  created_by    uuid
);
create table practice_cohort_members (
  cohort_id     text not null references practice_cohorts(id),
  person_id     uuid not null references practice_persons(id),
  primary key (cohort_id, person_id)
);

-- Assignments carry a trigger and a due date; their state is append only.
create table practice_assignments (
  id            uuid primary key default gen_random_uuid(),
  person_id     uuid not null references practice_persons(id),
  target_module_id text references practice_modules(id),
  target_version_id uuid references practice_document_versions(id),
  reason        text not null check (reason in ('NEW_HIRE','ROLE_CHANGE','SOP_REVISED','ANNUAL_REFRESHER','ENGAGEMENT','COHORT','BASELINE')),
  reason_detail text,
  trigger       text,
  due_date      date,
  assigned_by_name text not null,
  created_at    timestamptz not null default now()
);
create table practice_assignment_state_events (
  id            bigint generated always as identity primary key,
  assignment_id uuid not null references practice_assignments(id),
  new_state     text not null check (new_state in ('OUTSTANDING','COMPLETED','NOT_COMPLETED_SEPARATED')),
  effective_at  timestamptz not null,
  actor         uuid,
  reason        text,
  corrects_id   bigint references practice_assignment_state_events(id),
  created_at    timestamptz not null default now()
);

-- Completions are evidence. completed_at is the true completion time; synced_at
-- records when an offline record reached the server.
create table practice_completions (
  id            uuid primary key default gen_random_uuid(),
  module_id     text not null references practice_modules(id),
  module_version text not null,
  person_id     uuid not null references practice_persons(id),
  completed_at  timestamptz not null,
  synced_at     timestamptz,
  playback_trail jsonb not null default '[]'::jsonb,
  integrity_flag text,
  source        text not null check (source in ('INTERNAL','EXTERNAL_PACKAGE')),
  created_at    timestamptz not null default now()
);
