-- CG Prompt 09E, installment 1 of the Practice backend. This set supersedes the
-- never-applied 0001 and 0002 shells, which used mutable status columns. Apply
-- the whole 09E set in order; do not mix it with the removed files.
--
-- THE APPEND-ONLY STATE PATTERN, which is the point of this prompt.
--
-- Point-in-time reporting is a schema problem, not a query problem. A status
-- column updated in place cannot answer what the status was on a past date,
-- because the previous value no longer exists. So no subject carries a mutable
-- status column. State lives in an append-only <subject>_state_events table:
-- one row per state change, carrying the new state, an effective timestamp, the
-- actor, a reason, and a reference to the event it corrects.
--
--   current state  = the latest event per subject
--   state as of D  = the latest event per subject with effective_at <= D
--
-- Same query, different bound. Nothing carries updated_at, because nothing
-- updates. Every table carries created_at and the actor who created the row.
--
-- The state tables revoke UPDATE and DELETE from application roles so the append
-- only rule is enforced by the database, not by convention. A correction is a
-- new event citing the one it corrects.

create extension if not exists pgcrypto;

-- Roles, read by RLS. Role is never taken from a client influenceable claim.
create table practice_roles (
  key         text primary key check (key in ('EMPLOYEE','ASSESSOR','OPERATIONS_MANAGER','OWNER')),
  label       text not null
);
insert into practice_roles (key, label) values
  ('EMPLOYEE','Employee'),
  ('ASSESSOR','Assessor'),
  ('OPERATIONS_MANAGER','Operations manager'),
  ('OWNER','Owner');

-- A person is a stable identity. auth_user_id links to Supabase Auth. No name is
-- required here; synthetic test fixtures are labelled as such and never resemble
-- a real person.
create table practice_persons (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique,
  name          text,
  email         text,
  language_preference text not null default 'en',
  created_at    timestamptz not null default now(),
  created_by    uuid
);

-- Role assignment over time, append only. A person's current roles are the
-- latest grant or revoke per role.
create table practice_person_role_events (
  id          bigint generated always as identity primary key,
  person_id   uuid not null references practice_persons(id),
  role        text not null references practice_roles(key),
  granted     boolean not null,
  effective_at timestamptz not null,
  actor       uuid,
  reason      text,
  corrects_id bigint references practice_person_role_events(id),
  created_at  timestamptz not null default now()
);

-- Person lifecycle (09A), append only.
create table practice_person_state_events (
  id          bigint generated always as identity primary key,
  person_id   uuid not null references practice_persons(id),
  new_state   text not null check (new_state in ('PENDING','ACTIVE','ON_LEAVE','SUSPENDED','INACTIVE','DISPOSED')),
  effective_at timestamptz not null,
  actor       uuid,
  reason      text,
  corrects_id bigint references practice_person_state_events(id),
  created_at  timestamptz not null default now()
);

-- Employment and engagement are separate relationships to the facility. Their
-- own state (started, ended) is append only.
create table practice_employments (
  id          uuid primary key default gen_random_uuid(),
  person_id   uuid not null references practice_persons(id),
  created_at  timestamptz not null default now(),
  created_by  uuid
);
create table practice_employment_state_events (
  id          bigint generated always as identity primary key,
  employment_id uuid not null references practice_employments(id),
  new_state   text not null check (new_state in ('ACTIVE','ENDED')),
  effective_at timestamptz not null,
  actor       uuid,
  reason      text,
  corrects_id bigint references practice_employment_state_events(id),
  created_at  timestamptz not null default now()
);

-- Contractors, visitors, and agency workers, per 09D. Not employees with a flag.
create table practice_engagements (
  id          uuid primary key default gen_random_uuid(),
  person_id   uuid not null references practice_persons(id),
  kind        text not null check (kind in ('CONTRACTOR','VISITOR','AGENCY')),
  company     text,
  purpose     text,
  starts_on   date,
  ends_on     date,
  sponsor_person_id uuid references practice_persons(id),
  created_at  timestamptz not null default now(),
  created_by  uuid
);

-- Current-state views. The as-of variant is the same query with an added
-- predicate effective_at <= the chosen date, which 09F uses for point-in-time.
create view practice_person_current_state as
  select distinct on (person_id) person_id, new_state, effective_at
  from practice_person_state_events
  order by person_id, effective_at desc, id desc;

create view practice_person_current_roles as
  select person_id, role
  from (
    select distinct on (person_id, role) person_id, role, granted
    from practice_person_role_events
    order by person_id, role, effective_at desc, id desc
  ) latest
  where granted;
