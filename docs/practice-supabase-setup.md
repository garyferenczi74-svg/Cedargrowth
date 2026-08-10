# Practice: Supabase setup (owner action)

Practice (CG Prompt 09) is a records system and needs a real database. Per the
standing rule, the build ships the schema, RLS, and adapter as code and SQL; the
owner applies them and configures Auth. Nothing in Practice is live until these
steps are done. The public marketing site builds and deploys with none of this
present, and Practice reports itself unavailable until it is.

## 1. Apply the schema and RLS

Run `supabase/migrations/0001_practice_foundation.sql` (Supabase SQL editor or
`supabase db push`). It creates the six Practice tables, the append-only audit
table, the role helper functions, and enables row level security with default
deny. There are no insert, update, or delete policies for client roles by
design: every write goes through a server route holding the secret key.

## 2. Turn on Auth and MFA

This is a posture change from the current setup (server secret key only, no anon
access). Practice needs real user accounts:

- Enable email and password sign-in.
- Enable MFA (TOTP) and require it for Practice roles.
- Do not enable anonymous sign-ins.

Each employee gets a Supabase Auth user, and a `practice_person` row whose
`auth_user_id` points at it, with their role. Create the operations manager and
owner rows first.

## 3. Environment variables

Set these where Practice runs (server env, not committed):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (server only; never reaches the browser)
- The publishable/anon key for the auth client (client sign-in), server-scoped
  via the SSR cookie flow.
- `PRACTICE_ENABLED=true`. Set this LAST, only after the migration is applied and
  Auth and MFA are configured. It is a dedicated flag on purpose: the marketing
  site already sets the Supabase URL and secret key for other endpoints, so
  Practice must not treat their mere presence as being provisioned.

`isPracticeConfigured()` requires `PRACTICE_ENABLED=true` and the Supabase env.
Until it is set, the public site is unaffected and Practice renders its
unavailable state.

## 4. Verify RLS (report both results)

Prompt 09 requires testing with an anonymous client and an authenticated
non-privileged client before calling it done.

- Anonymous client: every Practice table returns zero rows. Expected: no access
  to anything.
- Authenticated employee (non-privileged): can read their own `practice_person`
  row, their own acknowledgments and assignments, and the document library
  (documents and versions). Cannot read another person's records and cannot read
  the audit log. Any insert, update, or delete is rejected.

Record both outcomes. If an employee can read another person's records, or the
audit log, or write anything directly, RLS is not correct and Practice is not
ready.

## 5. Wire the Supabase adapter

`getSupabasePracticeStore()` in `src/lib/practice/store.ts` is a seam stub. Once
the above is done, implement it against the `PracticeStore` interface (reads via
the authenticated client, appends via the server secret key). The domain logic
(`documentControl.ts`, `audit.ts`) and the mock adapter already conform to it.
