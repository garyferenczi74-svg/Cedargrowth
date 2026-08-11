-- CG Prompt 09E equipment, retention (09A), and oversight (09B). Commissioning
-- and equipment status derive from events. Cleared operators are derived from
-- current credentials, never stored.

create table practice_equipment (
  id            text primary key, -- CGO-EQ-###
  name          text not null,
  governing_version_id uuid references practice_document_versions(id),
  verification_note_open boolean not null default false,
  created_at    timestamptz not null default now(),
  created_by    uuid
);
create table practice_equipment_state_events (
  id            bigint generated always as identity primary key,
  equipment_id  text not null references practice_equipment(id),
  new_state     text not null check (new_state in ('NOT_COMMISSIONED','COMMISSIONING','COMMISSIONED')),
  effective_at  timestamptz not null,
  actor         uuid,
  reason        text,
  corrects_id   bigint references practice_equipment_state_events(id),
  created_at    timestamptz not null default now()
);

-- Retention (09A). Policies anchor on creation or separation; holds pause
-- disposal; a tombstone records a disposal without retaining the content.
create table practice_retention_policies (
  id            uuid primary key default gen_random_uuid(),
  record_class  text not null,
  anchor        text not null check (anchor in ('CREATION','SEPARATION')),
  period_days   integer,
  created_at    timestamptz not null default now()
);
create table practice_retention_holds (
  id            uuid primary key default gen_random_uuid(),
  subject_ref   text not null,
  reason        text not null,
  placed_at     timestamptz not null default now(),
  released_at   timestamptz
);
create table practice_disposal_tombstones (
  id            uuid primary key default gen_random_uuid(),
  subject_ref   text not null,
  record_class  text not null,
  disposed_at   timestamptz not null default now(),
  disposed_by   uuid,
  basis         text
);

-- Oversight (09B). Decision records carry the five warrant fields, every field
-- required. Reviews and the drawn sample carry their seed and size.
create table practice_warrant_decisions (
  id            text primary key,
  agent         text not null,
  decided_at    timestamptz not null,
  klass         text not null,
  outcome       text not null check (outcome in ('EXECUTED','BLOCKED','DEFERRED_TO_HUMAN')),
  authority     text not null,
  inputs        jsonb not null,
  alternatives  text not null,
  reversibility text not null,
  impact_count  integer not null,
  impact_ids    jsonb not null,
  confidence    numeric,
  blocked_by_rule text,
  corrects      text references practice_warrant_decisions(id),
  created_at    timestamptz not null default now()
);
create table practice_warrant_reviews (
  id            uuid primary key default gen_random_uuid(),
  week_of       date not null,
  sample_seed   text not null,
  sample_size   integer not null,
  signed_by     text,
  signed_at     timestamptz,
  created_at    timestamptz not null default now()
);
create table practice_warrant_samples (
  review_id     uuid not null references practice_warrant_reviews(id),
  decision_id   text not null references practice_warrant_decisions(id),
  verdict       text check (verdict in ('SOUND','QUESTIONABLE','WRONG')),
  note          text,
  primary key (review_id, decision_id)
);
