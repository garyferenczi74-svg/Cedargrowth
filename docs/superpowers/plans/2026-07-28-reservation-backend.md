# Reservation Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the `/reserve` request form to a real backend so a submission is persisted to Supabase and triggers an internal alert plus a customer confirmation email, replacing the current local-state-only submit.

**Architecture:** A Next.js Route Handler at `POST /api/reserve` validates the payload, inserts a row into a Supabase `reservations` table using the public anon key against an insert-only RLS policy (no service-role secret), then sends two best-effort Resend emails. The database row is the source of truth; email failures never fail the request. `ReserveClient` changes its submit handler to POST and handle pending/error states.

**Tech Stack:** Next.js 14.2.35 (App Router), TypeScript (strict), Tailwind v3, `@supabase/supabase-js`, `resend`, npm.

## Global Constraints

- Next.js 14.2.35, App Router, React 18.3.1, TypeScript strict. Path alias `@/*` -> `./src/*`.
- Package manager is npm. `vercel.json` pins framework nextjs; never set outputDirectory.
- NEVER run `npm run build` in the working copy (poisons `.next`). Type-check with `npx tsc --noEmit`. `npx next lint` is allowed.
- No em dashes or en dashes anywhere (code, comments, copy). ASCII hyphen only.
- No service-role key is stored anywhere. Insert uses the anon (publishable) key + RLS insert policy.
- Customer-facing copy uses house voice and never names compounds or internal specifics.
- No test framework exists in this repo and we are not adding one. Verification is `npx tsc --noEmit`, Supabase MCP queries, and `curl` against the deployment.
- Supabase project ref: `gncuknpulgzqnpxtxtry`. Env values live only in Vercel; never commit real values.

## File Structure

- Create `src/lib/supabase.ts` - server-side Supabase client factory (returns null if env missing).
- Create `src/lib/email.ts` - Resend wrapper: `sendReservationAlert`, `sendCustomerConfirmation`, shared types and helpers. Both best-effort.
- Create `src/app/api/reserve/route.ts` - the POST handler: validation, insert, emails.
- Create `.env.example` - documents the five env vars, values blank.
- Modify `src/components/reserve/ReserveClient.tsx` - async submit, pending/error state, honeypot input.
- Modify `package.json` - add `@supabase/supabase-js` and `resend`.
- Supabase migration `create_reservations` applied via MCP (not a repo file).

---

### Task 1: Provision the Supabase `reservations` table

**Files:**
- No repo files. Applies a migration to the live Supabase project via MCP.

**Interfaces:**
- Produces: a `public.reservations` table with columns `id, created_at, name, email, location, note, items, item_count, status` and an insert-only RLS policy for the `anon` role. Consumed by Task 4's insert.

- [ ] **Step 1: Confirm MCP can reach the project**

Run the MCP tool `list_tables` (or `list_migrations`) against project `gncuknpulgzqnpxtxtry`.
Expected: a successful response listing existing tables/migrations.
If it returns an auth/permission error, STOP and ask Gary for a Supabase PAT for this project (the CedarGrowth project may be a separate org, like Continuum's). Do not proceed until reachable.

- [ ] **Step 2: Apply the migration**

Use MCP `apply_migration` with name `create_reservations` and this SQL:

```sql
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  location text not null,
  note text,
  items jsonb not null,
  item_count int not null,
  status text not null default 'new'
);

alter table public.reservations enable row level security;

create policy reservations_anon_insert
  on public.reservations
  for insert
  to anon
  with check (true);
```

- [ ] **Step 3: Verify the table and policy exist**

Run MCP `execute_sql`:
```sql
select column_name, data_type from information_schema.columns
where table_schema = 'public' and table_name = 'reservations' order by ordinal_position;
```
Expected: nine rows matching the schema above.

Run MCP `execute_sql`:
```sql
select polname from pg_policies where tablename = 'reservations';
```
Expected: one row, `reservations_anon_insert`.

- [ ] **Step 4: Verify RLS blocks anon reads**

Run MCP `get_advisors` (security) and confirm no new "RLS disabled" finding for `reservations`. The table has an insert policy only, so anon SELECT returns zero rows, which is intended.

---

### Task 2: Add dependencies, env template, and the Supabase client factory

**Files:**
- Modify: `package.json` (dependencies)
- Create: `.env.example`
- Create: `src/lib/supabase.ts`

**Interfaces:**
- Produces: `getSupabaseServerClient(): SupabaseClient | null` - returns a client, or null when `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset. Consumed by Task 4.

- [ ] **Step 1: Add dependencies**

Run: `npm install @supabase/supabase-js resend`
Expected: both added to `package.json` dependencies and `package-lock.json` updated, install succeeds.

- [ ] **Step 2: Create `.env.example`**

```
# Supabase (public, safe to expose in the browser bundle)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Resend (server only)
RESEND_API_KEY=
RESERVATION_ALERT_TO=
RESERVATION_ALERT_FROM=
```

- [ ] **Step 3: Create `src/lib/supabase.ts`**

```ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side client for the reservations insert. Returns null when env is
// not configured so the route can fail clearly instead of throwing at import.
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.example src/lib/supabase.ts
git commit -m "Add supabase client factory and reservation env template"
```

---

### Task 3: Email wrapper (Resend)

**Files:**
- Create: `src/lib/email.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `type ReservationEmailData = { name: string; email: string; location: string; note: string; items: { slug: string; name: string; spec: string; qty: number }[]; itemCount: number }`
  - `sendReservationAlert(data: ReservationEmailData): Promise<void>` - best effort, never throws.
  - `sendCustomerConfirmation(data: ReservationEmailData): Promise<void>` - best effort, never throws.
  Both consumed by Task 4.

- [ ] **Step 1: Create `src/lib/email.ts`**

```ts
import { Resend } from 'resend';

export type ReservationItem = {
  slug: string;
  name: string;
  spec: string;
  qty: number;
};

export type ReservationEmailData = {
  name: string;
  email: string;
  location: string;
  note: string;
  items: ReservationItem[];
  itemCount: number;
};

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemsTable(items: ReservationItem[]): string {
  const rows = items
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.name)}</td><td>${escapeHtml(i.spec)}</td><td>${i.qty}</td></tr>`,
    )
    .join('');
  return `<table cellpadding="6" style="border-collapse:collapse"><thead><tr><th align="left">Product</th><th align="left">Spec</th><th align="left">Qty</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// Internal alert to the CedarGrowth inbox. Skips cleanly if env is missing.
export async function sendReservationAlert(data: ReservationEmailData): Promise<void> {
  const resend = getResend();
  const to = process.env.RESERVATION_ALERT_TO;
  const from = process.env.RESERVATION_ALERT_FROM;
  if (!resend || !to || !from) {
    console.warn('Reservation alert skipped, email env not configured');
    return;
  }
  try {
    await resend.emails.send({
      from,
      to,
      subject: `New reservation request, ${data.name}`,
      html:
        `<p>New reservation request.</p>` +
        `<p>Name: ${escapeHtml(data.name)}<br>` +
        `Email: ${escapeHtml(data.email)}<br>` +
        `Location: ${escapeHtml(data.location)}<br>` +
        `Items reserved: ${data.itemCount}</p>` +
        (data.note ? `<p>Note: ${escapeHtml(data.note)}</p>` : '') +
        itemsTable(data.items),
    });
  } catch (err) {
    console.error('Reservation alert email failed', err);
  }
}

// Confirmation to the customer. House voice, no compound names, no payment claim.
export async function sendCustomerConfirmation(data: ReservationEmailData): Promise<void> {
  const resend = getResend();
  const from = process.env.RESERVATION_ALERT_FROM;
  if (!resend || !from) {
    console.warn('Customer confirmation skipped, email env not configured');
    return;
  }
  try {
    await resend.emails.send({
      from,
      to: data.email,
      subject: 'Your CedarGrowth reservation request',
      html:
        `<p>Thank you, ${escapeHtml(data.name)}.</p>` +
        `<p>We received your reservation request. This is a request, not a sale. ` +
        `A CedarGrowth coordinator confirms availability and routes it to the nearest ` +
        `dispensary that carries CedarGrowth. No payment was taken.</p>` +
        itemsTable(data.items),
    });
  } catch (err) {
    console.error('Customer confirmation email failed', err);
  }
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/email.ts
git commit -m "Add Resend email wrapper for reservations"
```

---

### Task 4: The `POST /api/reserve` route handler

**Files:**
- Create: `src/app/api/reserve/route.ts`

**Interfaces:**
- Consumes: `getSupabaseServerClient` (Task 2); `sendReservationAlert`, `sendCustomerConfirmation`, `ReservationEmailData` (Task 3).
- Produces: `POST /api/reserve`. Request body `{ name, email, location, note?, items: {slug,name,spec,qty}[], company? }`. Responses: `200 {ok:true}`, `400 {error}`, `500 {error}`. Consumed by Task 5.

- [ ] **Step 1: Create `src/app/api/reserve/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import {
  sendReservationAlert,
  sendCustomerConfirmation,
  type ReservationEmailData,
  type ReservationItem,
} from '@/lib/email';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON');
  }
  const b = (body ?? {}) as Record<string, unknown>;

  // Honeypot. Real users never fill this hidden field. Fake success, no save.
  if (typeof b.company === 'string' && b.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  const location = typeof b.location === 'string' ? b.location.trim() : '';
  const note = typeof b.note === 'string' ? b.note.trim() : '';
  const rawItems = Array.isArray(b.items) ? b.items : null;

  if (!name || name.length > 200) return badRequest('Name is required');
  if (!email || !EMAIL_RE.test(email)) return badRequest('A valid email is required');
  if (!location || location.length > 200) return badRequest('Location is required');
  if (note.length > 2000) return badRequest('Note is too long');
  if (!rawItems || rawItems.length === 0 || rawItems.length > 50) {
    return badRequest('At least one reserved item is required');
  }

  const items: ReservationItem[] = [];
  for (const raw of rawItems) {
    const it = (raw ?? {}) as Record<string, unknown>;
    if (
      typeof it.slug !== 'string' ||
      typeof it.name !== 'string' ||
      typeof it.spec !== 'string' ||
      !Number.isInteger(it.qty) ||
      (it.qty as number) < 1
    ) {
      return badRequest('Invalid item in reservation');
    }
    items.push({ slug: it.slug, name: it.name, spec: it.spec, qty: it.qty as number });
  }
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const { error } = await supabase.from('reservations').insert({
    name,
    email,
    location,
    note: note || null,
    items,
    item_count: itemCount,
  });
  if (error) {
    console.error('Reservation insert failed', error);
    return NextResponse.json({ error: 'Could not save reservation' }, { status: 500 });
  }

  const emailData: ReservationEmailData = {
    name,
    email,
    location,
    note,
    items,
    itemCount,
  };
  await sendReservationAlert(emailData);
  await sendCustomerConfirmation(emailData);

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/reserve/route.ts
git commit -m "Add POST /api/reserve route handler"
```

- [ ] **Step 4: Deferred verification note**

Full endpoint verification (curl) happens in Task 6 against the deployment, because the
200 path needs Supabase env set in Vercel. The 400 and honeypot paths return before
touching Supabase and can be curled even before env is configured.

---

### Task 5: Wire `ReserveClient` submit to the endpoint

**Files:**
- Modify: `src/components/reserve/ReserveClient.tsx`

**Interfaces:**
- Consumes: `POST /api/reserve` (Task 4). Uses the `items` array already provided by `useReservation()` (each item has `slug`, `name`, `spec`, `qty`).
- Produces: no new exports. User-facing behavior change only.

- [ ] **Step 1: Add pending and error state**

At the top of `ReserveClient`, next to the existing `const [submitted, setSubmitted] = useState(false);`, add:

```tsx
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
```

- [ ] **Step 2: Replace the form `onSubmit`**

Find the form:
```tsx
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="flex flex-col gap-6"
        >
```
Replace the `onSubmit` handler with:
```tsx
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (pending) return;
            setError(null);
            setPending(true);
            const form = e.currentTarget;
            const value = (id: string) =>
              (form.elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement | null)
                ?.value ?? '';
            const payload = {
              name: value('res-name'),
              email: value('res-email'),
              location: value('res-postal'),
              note: value('res-note'),
              company: value('company'),
              items: items.map((i) => ({
                slug: i.slug,
                name: i.name,
                spec: i.spec,
                qty: i.qty,
              })),
            };
            try {
              const res = await fetch('/api/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as { error?: string };
                setError(data.error || 'Something went wrong. Please try again.');
                setPending(false);
                return;
              }
              setSubmitted(true);
            } catch {
              setError('Could not reach the server. Please try again.');
              setPending(false);
            }
          }}
          className="flex flex-col gap-6"
        >
```

- [ ] **Step 3: Add the honeypot input**

Immediately after the opening `<form ...>` tag (before the first `<Field ... />`), add:

```tsx
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
```

- [ ] **Step 4: Show the error and a pending submit label**

Replace the submit button:
```tsx
          <button
            type="submit"
            className="self-start bg-ink px-6 py-4 text-caption uppercase tracking-eyebrow text-inverse"
          >
            Prepare reservation request
          </button>
```
with:
```tsx
          {error ? (
            <p className="text-caption-m md:text-caption text-fail" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="self-start bg-ink px-6 py-4 text-caption uppercase tracking-eyebrow text-inverse disabled:opacity-60"
          >
            {pending ? 'Sending' : 'Prepare reservation request'}
          </button>
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/reserve/ReserveClient.tsx
git commit -m "Wire reservation form submit to /api/reserve"
```

---

### Task 6: End-to-end verification on the deployment

**Files:**
- None. Verification only. Requires the branch merged/pushed to `main` and env vars set in Vercel.

**Interfaces:**
- Consumes: the deployed `POST /api/reserve` and the Supabase `reservations` table.

- [ ] **Step 1: Push and confirm the deploy is green**

Push `main`. Using the stored `vcp_` token, poll `GET /v6/deployments` for the pushed SHA and confirm `readyState: READY`.

- [ ] **Step 2: Validation paths (work even before env is set)**

```bash
# Missing email -> 400
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://cedargrowth-dxxt.vercel.app/api/reserve \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","location":"Buffalo","items":[{"slug":"vape-05g","name":"0.5g Vape","spec":"0.5g","qty":1}]}'
# Expected: 400

# Empty items -> 400
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://cedargrowth-dxxt.vercel.app/api/reserve \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"a@b.com","location":"Buffalo","items":[]}'
# Expected: 400

# Honeypot filled -> 200, no row
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://cedargrowth-dxxt.vercel.app/api/reserve \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"a@b.com","location":"X","company":"spam","items":[{"slug":"x","name":"x","spec":"x","qty":1}]}'
# Expected: 200
```

- [ ] **Step 3: Success path (requires Supabase env set in Vercel)**

```bash
curl -s -w "\n%{http_code}\n" -X POST https://cedargrowth-dxxt.vercel.app/api/reserve \
  -H "Content-Type: application/json" \
  -d '{"name":"Verify Row","email":"verify@example.com","location":"Buffalo","note":"test","items":[{"slug":"vape-05g","name":"0.5g Vape","spec":"0.5g","qty":2}]}'
# Expected: 200 {"ok":true}
```
Then MCP `execute_sql`:
```sql
select name, email, location, item_count, status from public.reservations
where email = 'verify@example.com' order by created_at desc limit 1;
```
Expected: one row, `item_count = 2`, `status = 'new'`. Delete it after:
```sql
delete from public.reservations where email = 'verify@example.com';
```

- [ ] **Step 4: Email path (requires Resend env + RESERVATION_ALERT_TO set)**

Submit once through the UI at `/reserve` with a real address. Confirm the internal alert
arrives at `RESERVATION_ALERT_TO` and the confirmation arrives at the address entered.
If email env is not yet set, note this step as pending and confirm the server logs show
"skipped, email env not configured" rather than an error.

---

## Self-Review

**Spec coverage:**
- Persist to Supabase -> Task 1 (table) + Task 4 (insert). Covered.
- Insert-only RLS, anon key, no service-role secret -> Task 1 policy + Task 2 factory. Covered.
- Two emails, best effort -> Task 3 + Task 4. Covered.
- DB row is source of truth, email failure still 200 -> Task 3 (catch, no throw) + Task 4 (await after insert, always 200). Covered.
- Validation (fields, email regex, items, caps) + honeypot -> Task 4. Covered.
- Graceful missing env -> Task 2 (null client -> 500) + Task 3 (skip email + log). Covered.
- Client wiring, pending/error, honeypot input -> Task 5. Covered.
- `.env.example`, five env vars -> Task 2. Covered.
- Deps added -> Task 2. Covered.
- Manual verification (curl, MCP) -> Task 6. Covered.

**Placeholder scan:** No TBD/TODO. Every code step has real code.

**Type consistency:** `getSupabaseServerClient` (Task 2) used in Task 4. `ReservationEmailData`, `ReservationItem`, `sendReservationAlert`, `sendCustomerConfirmation` (Task 3) used in Task 4. Payload shape `{slug,name,spec,qty}` consistent across Task 4 validation, Task 5 client, and Task 3 email types. Route responses (`200 {ok:true}`, `400 {error}`, `500 {error}`) consistent between Task 4 and Task 5/6.
