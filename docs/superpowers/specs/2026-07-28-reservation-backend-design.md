# Reservation Request Backend, Design

Date: 2026-07-28
Status: Approved (pending spec review)
Scope: Wire the CedarGrowth `/reserve` request form to a real backend so a submitted
reservation is persisted and triggers email notifications, instead of only flipping local UI state.

## Problem

`src/components/reserve/ReserveClient.tsx` currently handles submit with
`e.preventDefault(); setSubmitted(true)`. The request goes nowhere: nothing is stored,
nothing is sent. The on-screen confirmation ("A CedarGrowth coordinator confirms
availability and routes it...") implies action that does not happen, so a real customer
reservation is silently lost.

## Goal

On submit, persist the reservation to Supabase and send two emails (internal alert to the
CedarGrowth inbox, confirmation to the customer), then show the existing confirmation
screen. The database row is the source of truth; email is best effort.

## Non-goals

- No payment or checkout (the site is explicitly "reserve, do not buy").
- No admin UI to browse reservations (reviewed in the Supabase dashboard for v1).
- No authentication or customer accounts.
- No status workflow beyond a default `status = 'new'`.

## Architecture

```
ReserveClient (client)
  --> POST /api/reserve            (Next.js Route Handler, server)
        1. validate payload
        2. insert row into Supabase `reservations` (anon key + RLS insert policy)
        3. send Resend alert email  -> RESERVATION_ALERT_TO   (internal, best effort)
        4. send Resend confirmation -> customer email          (best effort)
        5. return 200
```

- **Mechanism:** a Route Handler at `src/app/api/reserve/route.ts` (POST). Chosen over a
  Server Action because the form already submits in an `onSubmit` handler, making a
  `fetch()` the smallest change, and the endpoint is directly testable with `curl`.
- **Least privilege:** the insert uses the public anon (publishable) key against a table
  whose RLS allows only INSERT for the `anon` role. No service-role secret is stored.
  The Resend key is the only true secret and never leaves the server.

## Components / files

New:
- `src/app/api/reserve/route.ts` - the POST handler: validation, insert, two emails.
- `src/lib/supabase.ts` - a tiny server-side Supabase client factory reading env vars.
- `src/lib/email.ts` - Resend wrapper with `sendReservationAlert()` and
  `sendCustomerConfirmation()`; both best-effort (catch + log, never throw to caller).
- Supabase migration creating the `reservations` table + RLS policy (applied via MCP).

Changed:
- `src/components/reserve/ReserveClient.tsx` - submit handler becomes async: POST to
  `/api/reserve`, add `error` and `pending` state, keep the existing `submitted` success
  screen. Add a hidden honeypot input. No visual redesign.
- `package.json` - add `@supabase/supabase-js` and `resend`.

## Data model, Supabase `reservations`

| column      | type                        | notes                                  |
|-------------|-----------------------------|----------------------------------------|
| id          | uuid pk default gen_random_uuid() |                                  |
| created_at  | timestamptz default now()   |                                        |
| name        | text not null               |                                        |
| email       | text not null               | customer email                         |
| location    | text not null               | postal code or city                    |
| note        | text                        | optional                               |
| items       | jsonb not null              | array of `{ slug, name, spec, qty }`   |
| item_count  | int not null                | sum of qty, for quick scanning         |
| status      | text not null default 'new' |                                        |

RLS: enabled. One policy `reservations_anon_insert` - `FOR INSERT TO anon WITH CHECK (true)`.
No SELECT/UPDATE/DELETE policies for anon (dashboard/service-role reads only).

## Request contract

`POST /api/reserve`, JSON body:
```json
{
  "name": "string",
  "email": "string",
  "location": "string",
  "note": "string (optional)",
  "items": [{ "slug": "string", "name": "string", "spec": "string", "qty": 1 }],
  "company": "string (honeypot, must be empty)"
}
```

Server validation (all failures return `400` with `{ error }`, nothing saved):
- `name`, `email`, `location` present and non-empty; lengths capped (name/location <= 200,
  note <= 2000).
- `email` matches a basic email regex.
- `items` is a non-empty array; each item has a string `slug`/`name`/`spec` and integer
  `qty >= 1`; item array capped (<= 50).
- `company` honeypot is empty; if filled, respond `200` with a fake success (silently drop,
  do not save) to avoid signalling the bot.

## Error handling

- Validation error -> `400`, nothing saved.
- Supabase insert error -> `500 { error: 'Could not save reservation' }`, no emails sent.
- Insert OK, email(s) fail -> still `200`. Email is best effort; the failure is logged
  server-side. A mail outage never loses a reservation.
- Missing env: if Supabase env vars are absent the route returns `500` (it cannot function);
  if `RESEND_API_KEY` or `RESERVATION_ALERT_TO` is absent, the email step is skipped and
  logged, and the insert + `200` still succeed. This lets the feature ship before the
  recipient address and Resend account are finalized.

## Emails (Resend)

Both plain, simple HTML, sent from `RESERVATION_ALERT_FROM` (use `onboarding@resend.dev`
until the CedarGrowth domain is verified in Resend).

- **Internal alert** -> `RESERVATION_ALERT_TO`: subject `New reservation request, {name}`;
  body lists contact fields + an items table (name, spec, qty) + item_count.
- **Customer confirmation** -> the customer's entered email: subject
  `Your CedarGrowth reservation request`; body reiterates the on-screen copy tone
  ("this is a request, not a sale; a coordinator confirms availability and routes it to the
  nearest dispensary; no payment was taken"). No dashes, house voice.

## Config (env vars, set in Vercel; none committed)

| var                          | scope   | notes                                         |
|------------------------------|---------|-----------------------------------------------|
| NEXT_PUBLIC_SUPABASE_URL     | public  | project gncuknpulgzqnpxtxtry                   |
| NEXT_PUBLIC_SUPABASE_ANON_KEY| public  | publishable key                                |
| RESEND_API_KEY               | secret  | server only                                    |
| RESERVATION_ALERT_TO         | secret  | internal recipient, Gary adds later            |
| RESERVATION_ALERT_FROM       | secret  | verified sender or onboarding@resend.dev       |

Add a `.env.example` documenting these (values blank). Real values live only in Vercel.

## Testing / verification

The project has no test framework, and we do not run `npm build` in the working copy.
Verification is manual against the Vercel preview deploy:
1. `curl -X POST .../api/reserve` with a valid payload -> `200`; confirm a row appears in
   the Supabase `reservations` table.
2. `curl` with a missing field / bad email / empty items -> `400`, no row.
3. `curl` with the honeypot filled -> `200`, no row.
4. Once `RESERVATION_ALERT_TO` + Resend are set, submit through the UI and confirm both
   emails arrive.

## Rollout notes

- The feature deploys inert until the env vars are set in Vercel (insert needs Supabase
  env; emails need Resend env). Setting them is a config step, not a code change.
- This extends a parallel session's reservation feature already on `main`; changes are
  additive except the `ReserveClient` submit handler.
