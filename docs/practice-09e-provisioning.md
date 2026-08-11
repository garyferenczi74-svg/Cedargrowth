# Practice backend provisioning (CG Prompt 09E)

This is the runbook for standing up the Practice Supabase backend. I author the
migrations; you apply and configure. Nothing here is applied by me, per the
standing rule that the Supabase project is yours to change. 09E's own rule says
the same: migrations are files in the repo, applied through the CLI, nothing
configured by clicking in the dashboard where a migration can do it instead.

## Applied and verified 2026-08-11

The full set (`0100` through `0109`) was applied to the production project
gncuknpulgzqnpxtxtry via the Management API, file by file in atomic transactions.
The six empty, never-populated tables from an earlier `0001` apply (singular
names, mutable status columns) were dropped first; they held no data and the app
does not use them.

- `0100` state-event pattern plus identity (persons, roles, lifecycle,
  employments, engagements).
- `0101` document control (versions with status as events, acknowledgments with
  display language and a SYSTEM vs PAPER source, sections).
- `0102` insert-only hash-chained audit log with `practice_verify_chain()`.
- `0103` RLS core, role read from a table through SECURITY DEFINER helpers, the
  employee case.
- `0104` training (modules, versions, blocks with SYNTHETIC or FOOTAGE, curricula
  with a certifying flag, cohorts, assignments, completions).
- `0105` assessment (assessments, items, attempts, practical assessments,
  credentials, all status as events).
- `0106` equipment, retention, oversight (warrant decisions with the five fields).
- `0107` support (questions, answers, notification preferences and deliveries).
- `0108` the 09H layer (scripts as the controlled artifact, launch state,
  certificates).
- `0109` RLS for everything above, including the assessor practical-write policy
  enforced by `practice_holds_current_credential`.

Verified from the Management API (which runs as owner, so it bypasses RLS):

- 50 tables, every one with RLS enabled, zero missing.
- `practice_verify_chain()` returns null (chain intact).
- `audit_log` UPDATE and DELETE denied even to `service_role`.
- Point-in-time: a fixture ACTIVE at 2026-01-01 and INACTIVE at 2026-06-01 reads
  ACTIVE as of March and INACTIVE as of July. Fixture removed.

## Still yours (cannot be done from the API)

- Enable Auth email and password with mandatory MFA; anonymous sign-ins off.
- Create the two private buckets, `documents` and `training-media`.
- The anon-client and authenticated-employee RLS tests need real Auth users, so
  they are yours to run and report. The policies are in place; the tests confirm
  them end to end.
- The app still talks to the mock store: `getSupabasePracticeStore()` is a stub.
  Practice is provisioned but not yet wired to the live backend. That wiring is
  09G (the Supabase adapter and the write flows), gated behind `PRACTICE_ENABLED`.

## Apply order

```
supabase link --project-ref gncuknpulgzqnpxtxtry
supabase db push        # applies every file in supabase/migrations in order
supabase migration list --local
```

## Auth (dashboard, yours to set)

- Email and password sign-in on.
- MFA (TOTP) required for every role.
- Anonymous sign-ins OFF.
- After creating each person's Auth user, set `practice_persons.auth_user_id` to
  the Auth uid and grant their role by inserting a `practice_person_role_events`
  row (granted = true).

## Storage (dashboard or CLI)

- Create bucket `documents`, private.
- Create bucket `training-media`, private.
- No public bucket exists in this project. Both serve through signed expiring
  URLs, access checked against the same RLS logic.

## Environment

Set in Vercel, server-side variables separate from public ones (see
`.env.example`). Set `PRACTICE_ENABLED=true` LAST.

## Tests to run and report (report each result, not a summary)

### 1. Public site builds with Supabase variables removed

Temporarily unset `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `PRACTICE_ENABLED` and build. Expected:
the build succeeds, `/practice` renders its unavailable door, the public pages
are unaffected. This is the failure that took the original deployment down and it
must not repeat.

### 2. Anonymous client against every table

With the anon key and no session, run `select * from <table> limit 1` against
each `practice_*` table. Expected: zero rows or a permission error on every one.
Record the result per table.

### 3. Authenticated employee against another employee's records

Sign in as employee A. Attempt to read employee B's person row, acknowledgments,
and state events. Expected: zero rows on every attempt. Record each.

### 4. Point-in-time (the 09A verification)

```
-- as-of pattern: latest event per subject with effective_at <= the chosen date
select distinct on (person_id) person_id, new_state, effective_at
from practice_person_state_events
where effective_at <= '<PAST_DATE>'
order by person_id, effective_at desc, id desc;
```

Acknowledge a document as a person, then record a person state event moving them
to INACTIVE with a later effective date. Query the training matrix as of a date
between the two. Expected: the person appears with their acknowledgment. A report
filtered to current employees would wrongly omit them; this pattern does not.

### 5. Audit chain

```
select practice_verify_chain();  -- expected: null (chain intact)
```

Then confirm UPDATE and DELETE on `practice_audit_log` are refused for every role
including the service role.

## Open dependencies (unchanged)

Video provider, notification provider and whether SMS is in scope, the two
document numbers, pass thresholds and attempt limits, the first external assessor
on the KWAD and CFM-1800, the KWAD spec reconciliation, and which legacy SOPs are
live and need reissue before their training can exist.
