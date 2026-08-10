# KELVIN WARRANT wing (CG Prompt 09B): backend hand-off

WARRANT is the eighth wing in KELVIN. It records and reviews the autonomous
decisions the agents make, with APEX as its first tenant. The wing ships live
now, rendered entirely client side from static data:

- APEX renders in the roster (Agents grid), the live feed agent chips, and the
  filter row, because those read the static `AGENTS` array in `store.ts`.
- The WARRANT sidebar entry and its six views (Overview, Decisions, Blocked,
  Review, Drift, Authority) render from `wings/warrant.ts`.
- The Authority view shows the full rule set: APEX permits and the six APEX bars
  from Prompt 09, read only.

Nothing about the decision ledger is fabricated. `DECISIONS` in `warrant.ts` is
empty, so every computed figure renders `UNKNOWN` rather than a zero that would
read as a real measurement. Two things need a provisioned backend before the
wing carries real data. Neither is applied here, per the standing rule that I do
not change Supabase or Vercel project settings. Apply when ready.

## 1. The APEX live feed events (optional, cosmetic)

The KELVIN live feed reads from the `kelvin_events` table, not from the static
`SEED_EVENTS` in `store.ts`. The four APEX seed events are in `SEED_EVENTS` as
the canonical source, but they will not appear in the live feed or in the APEX
card event list until they exist in `kelvin_events`. If the `kelvin_events`
table is provisioned, insert them:

```sql
insert into kelvin_events (id, agent, time, type, summary, sub, wing) values
  (13, 'APEX', '07:15', 'DRIFT',      'CGO-SOP-PROC-002 revised to v2.0', 'Nine acknowledgments now against a superseded version.', 'warrant'),
  (14, 'APEX', '07:16', 'ASSIGNMENT', 'Re-acknowledgment assigned to nine', 'Reason: SOP revised to v2.0. Due in seven days.', 'warrant'),
  (15, 'APEX', '09:00', 'AUDIT',      'Daily training audit filed', 'Four items overdue. One certification expires in eleven days.', 'warrant'),
  (16, 'APEX', '11:30', 'ALERT',      'Assessment completed in 41 seconds', 'Below plausible completion time. Flagged for review.', 'warrant')
on conflict (id) do nothing;
```

If `kelvin_events` is not provisioned, the whole Command feed is already empty in
production and this is moot until it is.

## 2. The decision ledger (deferred, for the write path)

When APEX begins emitting real decision records, they persist to a
`warrant_decisions` table. The record shape is fixed by `WarrantDecision` in
`warrant.ts`. Every field is required, and the store must reject any decision
that fails `validateDecision` (missing authority, inputs, alternatives,
reversibility, or impact). A rejected decision is not stored as a partial row: it
becomes a recommendation requiring human action, and a blocked attempt is
recorded with the same five fields as an executed one.

DDL, append only, no update or delete path granted to any client role:

```sql
create table if not exists warrant_decisions (
  id                text primary key,
  agent             text not null,
  timestamp         timestamptz not null,
  klass             text not null check (klass in ('ASSIGN','REASSIGN','REMIND','ESCALATE','FLAG','EXPIRE','DRAFT','SCHEDULE','BLOCK','EXPORT')),
  outcome           text not null check (outcome in ('EXECUTED','BLOCKED','DEFERRED TO HUMAN')),
  authority         text not null,
  inputs            jsonb not null,
  alternatives      text not null,
  reversibility     text not null check (reversibility in ('REVERSIBLE','REVERSIBLE WITH EFFORT','IRREVERSIBLE')),
  reversible_by     text not null,
  reversible_until  text not null,
  impact_count      integer not null,
  impact_ids        jsonb not null,
  confidence        numeric,
  review_state      text not null default 'Unreviewed' check (review_state in ('Unreviewed','Sampled','Reviewed')),
  reviewed_by       text,
  reviewed_on       text,
  blocked_by_rule   text,
  corrects          text references warrant_decisions(id),
  created_at        timestamptz not null default now()
);

-- Append only. No client update or delete. Enforce at the grant and policy layer
-- exactly as the Practice records tables do (see 0001_practice_foundation.sql).
alter table warrant_decisions enable row level security;
```

Weekly review signatures, the drawn sample seed and size, and drift explanations
are separate append only records to design alongside this when the review flow is
built. WARRANT never surfaces the private Practice content underneath a decision:
it records that APEX reassigned training to seven named people and why, not what
those people answered or reflected.

## Configured values (move without a code change once a settings surface exists)

Held in `WARRANT_CONFIG` in `warrant.ts`:

- High impact: more than 5 people, or IRREVERSIBLE. Both configured.
- Repeated block ALERT: 3 blocks against one rule within 7 days.
- Weekly review sample: 20 routine decisions.
- Drift trailing baseline: 30 days.

## Decision classes with no counterfactual method defined

The Overview counterfactual panel computes from data or renders UNKNOWN, method
stated. Methods are defined for REASSIGN, ESCALATE, and FLAG. The remaining seven
classes have no method defined and are surfaced as such: ASSIGN, REMIND, EXPIRE,
DRAFT, SCHEDULE, BLOCK, EXPORT.
