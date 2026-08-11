-- CG Prompt 09E, the audit chain at the database layer. audit_log is insert only:
-- UPDATE and DELETE are revoked from every role, including the service role. Each
-- row carries a hash of its predecessor, so any edit, deletion, or reorder breaks
-- the chain. verify_chain() walks it and returns the first break or confirms
-- integrity. A broken chain is a P0 per the security doctrine, so schedule this.

create table practice_audit_log (
  id          bigint generated always as identity primary key,
  kind        text not null,
  actor       uuid,
  summary     text not null,
  target      text,
  source_addr text, -- the source address on a sign-in attempt
  prev_hash   text, -- the hash of the previous row, null for the first
  row_hash    text not null, -- sha256 of the canonical form of this row plus prev_hash
  created_at  timestamptz not null default now()
);

-- Compute a row hash from the canonical fields joined with a pipe delimiter, the
-- same delimiter the client-side chain uses. Never a NUL byte.
create or replace function practice_audit_row_hash(
  p_prev_hash text, p_kind text, p_actor uuid, p_summary text, p_target text, p_created timestamptz
) returns text language sql immutable as $$
  select encode(
    digest(
      coalesce(p_prev_hash,'') || '|' || p_kind || '|' || coalesce(p_actor::text,'') || '|'
        || p_summary || '|' || coalesce(p_target,'') || '|' || p_created::text,
      'sha256'
    ), 'hex')
$$;

-- On insert, chain to the latest row and compute this row hash. The trigger sets
-- prev_hash and row_hash so the client cannot forge them.
create or replace function practice_audit_before_insert() returns trigger language plpgsql as $$
declare last_hash text;
begin
  select row_hash into last_hash from practice_audit_log order by id desc limit 1;
  new.prev_hash := last_hash;
  new.row_hash := practice_audit_row_hash(last_hash, new.kind, new.actor, new.summary, new.target, new.created_at);
  return new;
end $$;

create trigger practice_audit_chain_trg
  before insert on practice_audit_log
  for each row execute function practice_audit_before_insert();

-- Walk the chain. Returns the id of the first row whose stored hash does not match
-- a recomputation, or null when the chain is intact.
create or replace function practice_verify_chain() returns bigint language plpgsql stable as $$
declare r record; expected text; prev text := null;
begin
  for r in select * from practice_audit_log order by id asc loop
    expected := practice_audit_row_hash(prev, r.kind, r.actor, r.summary, r.target, r.created_at);
    if r.row_hash is distinct from expected or r.prev_hash is distinct from prev then
      return r.id;
    end if;
    prev := r.row_hash;
  end loop;
  return null;
end $$;

-- Insert only, for every role. No update, no delete, ever.
revoke update, delete on practice_audit_log from public;
-- The following also revoke from the privileged roles; run as a superuser during
-- provisioning. The service role must not be able to rewrite history either.
do $$
begin
  execute 'revoke update, delete on practice_audit_log from authenticated';
  execute 'revoke update, delete on practice_audit_log from anon';
  execute 'revoke update, delete on practice_audit_log from service_role';
exception when others then
  raise notice 'grant roles not all present in this environment; revoke the update and delete grants manually for every role that exists';
end $$;
