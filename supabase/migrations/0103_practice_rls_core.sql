-- CG Prompt 09E, row level security for the identity, document control, and audit
-- tables. RLS is enabled on every table, so a table with no permissive policy is
-- denied by default. Role is read from a table through SECURITY DEFINER helpers,
-- never from a client influenceable claim. The employee case is the one to get
-- exactly right: an employee reads their own records and nothing belonging to
-- another person. Later installments add the training, assessment, equipment,
-- retention, and oversight tables with their own policies in the same shape.

-- The current person, resolved from the Auth user. SECURITY DEFINER so a policy
-- can read practice_persons without recursing through its own RLS. It only ever
-- returns the row for the calling user, so it leaks nothing.
create or replace function practice_current_person_id() returns uuid
  language sql stable security definer set search_path = public as $$
  select id from practice_persons where auth_user_id = (select auth.uid()) limit 1
$$;

create or replace function practice_has_role(p_role text) returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from practice_person_current_roles r
    where r.person_id = practice_current_person_id() and r.role = p_role
  )
$$;

create or replace function practice_is_manager() returns boolean
  language sql stable security definer set search_path = public as $$
  select practice_has_role('OPERATIONS_MANAGER') or practice_has_role('OWNER')
$$;

-- Enable RLS everywhere. No table ships without it.
alter table practice_roles enable row level security;
alter table practice_persons enable row level security;
alter table practice_person_role_events enable row level security;
alter table practice_person_state_events enable row level security;
alter table practice_employments enable row level security;
alter table practice_employment_state_events enable row level security;
alter table practice_engagements enable row level security;
alter table practice_documents enable row level security;
alter table practice_document_versions enable row level security;
alter table practice_document_version_state_events enable row level security;
alter table practice_document_sections enable row level security;
alter table practice_acknowledgments enable row level security;
alter table practice_audit_log enable row level security;

-- The role list is reference data, readable by any authenticated user.
create policy roles_read on practice_roles for select to authenticated using (true);

-- A person reads their own row; a manager reads all. No client writes: person
-- records are created and changed server side.
create policy persons_self_read on practice_persons for select to authenticated
  using (id = practice_current_person_id() or practice_is_manager());

-- Own lifecycle, roles, employment, and engagement; managers read all.
create policy person_state_self on practice_person_state_events for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy person_roles_self on practice_person_role_events for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy employments_self on practice_employments for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy employment_state_self on practice_employment_state_events for select to authenticated
  using (
    practice_is_manager()
    or exists (select 1 from practice_employments e where e.id = employment_id and e.person_id = practice_current_person_id())
  );
create policy engagements_self on practice_engagements for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());

-- Documents: the controlled library is readable by any authenticated user.
create policy documents_read on practice_documents for select to authenticated using (true);

-- Versions: an employee reads CURRENT versions, and superseded versions only
-- where they hold an acknowledgment against them. A manager reads all.
create policy document_versions_read on practice_document_versions for select to authenticated
  using (
    practice_is_manager()
    or (select new_state from practice_document_version_current_state s where s.version_id = id) = 'CURRENT'
    or exists (
      select 1 from practice_acknowledgments a
      where a.version_id = id and a.person_id = practice_current_person_id()
    )
  );

-- Version state events and sections follow the version visibility.
create policy document_version_state_read on practice_document_version_state_events for select to authenticated
  using (
    practice_is_manager()
    or exists (
      select 1 from practice_document_versions v
      where v.id = version_id
        and (
          (select new_state from practice_document_version_current_state s where s.version_id = v.id) = 'CURRENT'
          or exists (select 1 from practice_acknowledgments a where a.version_id = v.id and a.person_id = practice_current_person_id())
        )
    )
  );
create policy document_sections_read on practice_document_sections for select to authenticated
  using (
    practice_is_manager()
    or (select new_state from practice_document_version_current_state s where s.version_id = version_id) = 'CURRENT'
    or exists (select 1 from practice_acknowledgments a where a.version_id = version_id and a.person_id = practice_current_person_id())
  );

-- Acknowledgments: an employee reads only their own; a manager reads all. Writes
-- are server side, so no client insert, update, or delete policy exists.
create policy acknowledgments_self on practice_acknowledgments for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());

-- The audit log is manager and owner only, and read only. Inserts are server side
-- through the chain trigger; there is no client insert policy.
create policy audit_manager_read on practice_audit_log for select to authenticated
  using (practice_is_manager());
