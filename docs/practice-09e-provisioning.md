# Practice backend provisioning (CG Prompt 09E)

This is the runbook for standing up the Practice Supabase backend. I author the
migrations; you apply and configure. Nothing here is applied by me, per the
standing rule that the Supabase project is yours to change. 09E's own rule says
the same: migrations are files in the repo, applied through the CLI, nothing
configured by clicking in the dashboard where a migration can do it instead.

## What is authored so far (installment 1)

The load-bearing, impossible-to-retrofit part:

- `0100_practice_state_and_identity.sql` The append-only state-event pattern, and
  the identity tables (persons, roles, person roles, person lifecycle,
  employments, engagements). No mutable status column anywhere.
- `0101_practice_document_control.sql` Documents, versions with status held as
  events, acknowledgments recording display language, sections for excerpt pulls.
- `0102_practice_audit_chain.sql` The insert-only audit log, hash chained, with
  `practice_verify_chain()`.
- `0103_practice_rls_core.sql` RLS default deny, role read from a table through
  SECURITY DEFINER helpers, and the employee-case policies.

The never-applied `0001` and `0002` shells were removed; they used mutable status
columns that this pattern supersedes.

## Still to author (installments 2 and up), same pattern

Training (modules, versions, blocks, curricula, assignments, completions),
Assessment (assessments, items, banks, attempts, practical assessments, the
assessor credential write policy, credentials), Equipment (units, commissioning
events, cleared-operators view), Retention (policies, holds, tombstones),
Oversight (warrant_decisions, reviews, samples), Support (questions, answers,
notifications, deliveries). Do not apply the set until these land, or the backend
is partial. Say the word and I author them next.

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
