-- CG Prompt 09E, document control. Documents and versions, with version status
-- held as append-only events so the training matrix can answer which version was
-- current on a past date. Acknowledgments bind to a specific version and record
-- the language the document was displayed in, which is the field that makes the
-- record defensible rather than hollow.

create table practice_documents (
  id          uuid primary key default gen_random_uuid(),
  number      text unique not null, -- e.g. CGO-SOP-PROC-002
  title       text,
  category    text,
  requires_ack boolean not null default true,
  language    text not null default 'en',
  created_at  timestamptz not null default now(),
  created_by  uuid
);

-- A version. It carries no mutable status column; status is derived from
-- practice_document_version_state_events.
create table practice_document_versions (
  id          uuid primary key default gen_random_uuid(),
  document_id uuid not null references practice_documents(id),
  version     text not null, -- e.g. 2.0
  effective_date date,
  approved_by_name text, -- a named human, never an agent
  approval_date date,
  superseded_by uuid references practice_document_versions(id),
  language    text not null default 'en',
  created_at  timestamptz not null default now(),
  created_by  uuid,
  unique (document_id, version)
);

create table practice_document_version_state_events (
  id          bigint generated always as identity primary key,
  version_id  uuid not null references practice_document_versions(id),
  new_state   text not null check (new_state in ('DRAFT','IN_REVIEW','CURRENT','SUPERSEDED','WITHDRAWN')),
  effective_at timestamptz not null,
  actor       uuid,
  reason      text,
  corrects_id bigint references practice_document_version_state_events(id),
  created_at  timestamptz not null default now()
);

-- Current status per version, and the one-CURRENT-per-document rule enforced as a
-- partial unique index on the events would be wrong (events are many), so the
-- rule is enforced in application logic at publish time and verified by report.
create view practice_document_version_current_state as
  select distinct on (version_id) version_id, new_state, effective_at
  from practice_document_version_state_events
  order by version_id, effective_at desc, id desc;

-- Sections, for the document excerpt block pull. The excerpt names the section;
-- the text is pulled live from here, never copied into a module.
create table practice_document_sections (
  id          uuid primary key default gen_random_uuid(),
  version_id  uuid not null references practice_document_versions(id),
  ordinal     integer not null,
  heading     text,
  body        text,
  created_at  timestamptz not null default now()
);

-- Acknowledgments are append only. A correction is a new row citing the one it
-- corrects. display_language records the language the document was shown in.
-- source distinguishes a record created in the system from a paper record
-- imported per 09H: the normal flow can only produce SYSTEM, and a PAPER row can
-- only arrive through the logged manager import, never the normal flow.
create table practice_acknowledgments (
  id            uuid primary key default gen_random_uuid(),
  person_id     uuid not null references practice_persons(id),
  version_id    uuid not null references practice_document_versions(id),
  statement     text not null,
  display_language text not null default 'en',
  source        text not null default 'SYSTEM' check (source in ('SYSTEM','PAPER')),
  physical_ref  text, -- the physical record location, for a PAPER import
  acknowledged_at timestamptz not null default now(),
  corrects_id   uuid references practice_acknowledgments(id),
  created_at    timestamptz not null default now()
);
