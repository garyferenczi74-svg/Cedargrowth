-- PRACTICE foundation (CG Prompt 09). Apply with the Supabase SQL editor or CLI.
-- Owner applies this; the build does not provision the live project.
--
-- Design: append-only records, default-deny RLS. Clients (anon and authenticated
-- non-privileged) get read access only, and only to what they are entitled to.
-- There are NO insert, update, or delete policies for client roles: every write
-- goes through a server route holding the secret key, which is how append-only
-- is enforced from the client side. A correction is a new row, never an edit.
--
-- Zero em dashes and zero en dashes in this file, per project rule.

-- Schema -------------------------------------------------------------------

create table if not exists practice_person (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  name text,
  email text,
  role text not null check (role in ('EMPLOYEE', 'ASSESSOR', 'OPERATIONS_MANAGER', 'OWNER')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists practice_document (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  title text,
  category text,
  requires_ack boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists practice_document_version (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references practice_document (id),
  version text not null,
  status text not null check (status in ('DRAFT', 'IN_REVIEW', 'CURRENT', 'SUPERSEDED', 'WITHDRAWN')),
  effective_date date,
  approved_by_name text,
  approval_date date,
  superseded_by_version_id uuid references practice_document_version (id),
  content_ref text,
  created_at timestamptz not null default now(),
  unique (document_id, version)
);

-- At most one CURRENT version per document.
create unique index if not exists practice_one_current_per_document
  on practice_document_version (document_id)
  where status = 'CURRENT';

create table if not exists practice_acknowledgment (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references practice_person (id),
  document_id uuid not null references practice_document (id),
  document_number text not null,
  version_id uuid not null references practice_document_version (id),
  version text not null,
  acknowledged_at timestamptz not null default now(),
  statement text not null,
  corrects_id uuid references practice_acknowledgment (id),
  created_at timestamptz not null default now()
);

create table if not exists practice_assignment (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references practice_person (id),
  document_id uuid not null references practice_document (id),
  document_number text not null,
  target_version_id uuid references practice_document_version (id),
  reason text not null check (reason in ('NEW_HIRE', 'ROLE_CHANGE', 'SOP_REVISED', 'ANNUAL_REFRESHER')),
  reason_detail text,
  assigned_by_name text not null,
  assigned_at timestamptz not null default now(),
  due_date date,
  status text not null default 'OUTSTANDING'
    check (status in ('OUTSTANDING', 'COMPLETED', 'NOT_COMPLETED_SEPARATED')),
  created_at timestamptz not null default now()
);

create table if not exists practice_audit (
  seq bigint primary key,
  at timestamptz not null,
  kind text not null,
  actor text,
  summary text not null,
  source text,
  prev_hash text not null,
  hash text not null unique
);

-- Role helpers (security definer so policies can read the caller's person row) -

create or replace function practice_current_person_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select id from practice_person where auth_user_id = auth.uid() limit 1;
$$;

create or replace function practice_is_manager()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from practice_person
    where auth_user_id = auth.uid()
      and role in ('OPERATIONS_MANAGER', 'OWNER')
      and active
  );
$$;

-- Row level security: enable everywhere, default deny (no policy = no access) --

alter table practice_person enable row level security;
alter table practice_document enable row level security;
alter table practice_document_version enable row level security;
alter table practice_acknowledgment enable row level security;
alter table practice_assignment enable row level security;
alter table practice_audit enable row level security;

-- SELECT policies for authenticated clients only. anon gets nothing.

-- A person reads their own row; a manager reads everyone.
create policy practice_person_read on practice_person
  for select to authenticated
  using (auth_user_id = auth.uid() or practice_is_manager());

-- The library is readable by any signed in staff member. The application layer
-- shows the superseded banner; RLS allows the read so the banner can render.
create policy practice_document_read on practice_document
  for select to authenticated
  using (true);

create policy practice_version_read on practice_document_version
  for select to authenticated
  using (true);

-- A person reads their own acknowledgments; a manager reads all.
create policy practice_ack_read on practice_acknowledgment
  for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());

-- A person reads their own assignments; a manager reads all.
create policy practice_assignment_read on practice_assignment
  for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());

-- Only managers read the audit log.
create policy practice_audit_read on practice_audit
  for select to authenticated
  using (practice_is_manager());

-- No INSERT, UPDATE, or DELETE policies for anon or authenticated. All writes go
-- through a server route holding the secret key (service role bypasses RLS).
-- This is how append-only is enforced against the client: clients cannot write,
-- and the server never exposes an update or delete for a record.
