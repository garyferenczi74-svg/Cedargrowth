-- CG Prompt 09H. The script is the controlled artifact, not the video: the video
-- is a rendering of an approved script bound to a document version. A document
-- revision triggers a script diff and a re-render, not a reshoot. Launch state
-- keeps a new system from showing an experienced floor as delinquent on day one.
-- Certificates are record artifacts, not awards.

-- The script. Status held as events. Generation parameters and the rendered asset
-- are recorded together. An updated asset (text swap) and a regenerated one carry
-- different provenance, recorded in generation.
create table practice_scripts (
  id            text primary key, -- CGO-SCR-###
  module_id     text references practice_modules(id),
  teaches_version_id uuid references practice_document_versions(id),
  content       jsonb not null default '[]'::jsonb, -- the sectioned script text
  language      text not null default 'en',
  approved_by_name text, -- a named human; APEX cannot approve
  approval_date date,
  generation    jsonb, -- provider, avatar, template, generated_at, provider asset id, update-vs-regenerate
  asset_ref     text, -- storage reference in the private training-media bucket
  created_at    timestamptz not null default now(),
  created_by    uuid
);
create table practice_script_state_events (
  id            bigint generated always as identity primary key,
  script_id     text not null references practice_scripts(id),
  new_state     text not null check (new_state in ('DRAFT','IN_REVIEW','APPROVED','SUPERSEDED')),
  effective_at  timestamptz not null,
  actor         uuid,
  reason        text,
  corrects_id   bigint references practice_script_state_events(id),
  created_at    timestamptz not null default now()
);

-- Facility launch state, a single row. While on, standing reads BASELINING rather
-- than BEHIND for pre-launch gaps. Turning it off is deliberate, logged, and
-- cannot be reversed: turned_off_at set once and the app refuses to clear it.
create table practice_launch_state (
  id            boolean primary key default true check (id), -- single row, always true
  launched_on   date,
  baseline_active boolean not null default true,
  turned_off_at timestamptz,
  turned_off_by uuid,
  created_at    timestamptz not null default now()
);

-- Certificates. A certifying curriculum produces one on completion. It is a
-- record in the house treatment, no decoration. It supersedes with its documents.
create table practice_certificates (
  id            uuid primary key default gen_random_uuid(),
  person_id     uuid not null references practice_persons(id),
  curriculum_id text not null references practice_curricula(id),
  covered_version_ids jsonb not null, -- the document versions covered
  completion_date date not null,
  expiry_date   date,
  approved_by_name text not null,
  created_at    timestamptz not null default now()
);
create table practice_certificate_state_events (
  id            bigint generated always as identity primary key,
  certificate_id uuid not null references practice_certificates(id),
  new_state     text not null check (new_state in ('CURRENT','SUPERSEDED','EXPIRED')),
  effective_at  timestamptz not null,
  actor         uuid,
  reason        text,
  corrects_id   bigint references practice_certificate_state_events(id),
  created_at    timestamptz not null default now()
);
