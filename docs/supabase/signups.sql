create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  intent text not null check (intent in ('newsletter','dna_kit','find_dispensary','wholesale')),
  email text not null,
  name text,
  location text,
  business text,
  note text,
  source text
);
alter table public.signups enable row level security;
-- No public policies: inserts run server-side with the secret key, which bypasses RLS.
-- Deny-by-default for anon/authenticated is intentional and mirrors the reservations table.
