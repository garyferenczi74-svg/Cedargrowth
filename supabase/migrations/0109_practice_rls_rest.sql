-- CG Prompt 09E, row level security for the training, assessment, equipment,
-- retention, oversight, support, and 09H tables. RLS on every table (default
-- deny). Employees read their own records and current content; managers read
-- all; the assessor practical write permission is enforced here, not in code.

-- Current-state views used by policies.
create view practice_module_version_current_state as
  select distinct on (module_version_id) module_version_id, new_state, effective_at
  from practice_module_version_state_events
  order by module_version_id, effective_at desc, id desc;

create view practice_credential_current_state as
  select distinct on (credential_id) credential_id, new_state, effective_at
  from practice_credential_state_events
  order by credential_id, effective_at desc, id desc;

-- Does the current person hold a current credential on the document this version
-- belongs to. Used by the practical sign-off write policy.
create or replace function practice_holds_current_credential(p_version_id uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from practice_credentials c
    join practice_document_versions cv on cv.id = c.document_version_id
    join practice_document_versions tv on tv.id = p_version_id
    where c.person_id = practice_current_person_id()
      and cv.document_id = tv.document_id
      and coalesce((select new_state from practice_credential_current_state s where s.credential_id = c.id), 'CURRENT') = 'CURRENT'
  )
$$;

-- Enable RLS everywhere.
alter table practice_modules enable row level security;
alter table practice_module_versions enable row level security;
alter table practice_module_version_state_events enable row level security;
alter table practice_module_blocks enable row level security;
alter table practice_curricula enable row level security;
alter table practice_curriculum_modules enable row level security;
alter table practice_cohorts enable row level security;
alter table practice_cohort_members enable row level security;
alter table practice_assignments enable row level security;
alter table practice_assignment_state_events enable row level security;
alter table practice_completions enable row level security;
alter table practice_assessments enable row level security;
alter table practice_assessment_state_events enable row level security;
alter table practice_assessment_items enable row level security;
alter table practice_attempts enable row level security;
alter table practice_attempt_responses enable row level security;
alter table practice_practical_assessments enable row level security;
alter table practice_practical_checklist_results enable row level security;
alter table practice_credentials enable row level security;
alter table practice_credential_state_events enable row level security;
alter table practice_equipment enable row level security;
alter table practice_equipment_state_events enable row level security;
alter table practice_retention_policies enable row level security;
alter table practice_retention_holds enable row level security;
alter table practice_disposal_tombstones enable row level security;
alter table practice_warrant_decisions enable row level security;
alter table practice_warrant_reviews enable row level security;
alter table practice_warrant_samples enable row level security;
alter table practice_questions enable row level security;
alter table practice_question_answers enable row level security;
alter table practice_notification_preferences enable row level security;
alter table practice_notification_deliveries enable row level security;
alter table practice_scripts enable row level security;
alter table practice_script_state_events enable row level security;
alter table practice_launch_state enable row level security;
alter table practice_certificates enable row level security;
alter table practice_certificate_state_events enable row level security;

-- Content readable by any authenticated user: modules at a CURRENT version, the
-- curriculum and cohort structure, equipment, the launch state.
create policy modules_read on practice_modules for select to authenticated using (true);
create policy module_versions_read on practice_module_versions for select to authenticated
  using (
    practice_is_manager()
    or (select new_state from practice_module_version_current_state s where s.module_version_id = id) = 'CURRENT'
  );
create policy module_version_state_read on practice_module_version_state_events for select to authenticated using (true);
create policy module_blocks_read on practice_module_blocks for select to authenticated using (true);
create policy curricula_read on practice_curricula for select to authenticated using (true);
create policy curriculum_modules_read on practice_curriculum_modules for select to authenticated using (true);
create policy equipment_read on practice_equipment for select to authenticated using (true);
create policy equipment_state_read on practice_equipment_state_events for select to authenticated using (true);
create policy launch_read on practice_launch_state for select to authenticated using (true);
create policy scripts_read on practice_scripts for select to authenticated using (practice_is_manager());
create policy script_state_read on practice_script_state_events for select to authenticated using (practice_is_manager());

-- A person reads their own cohort membership; managers read all.
create policy cohorts_read on practice_cohorts for select to authenticated using (true);
create policy cohort_members_self on practice_cohort_members for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());

-- Own assignments, completions, attempts, credentials, certificates; managers all.
create policy assignments_self on practice_assignments for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy assignment_state_self on practice_assignment_state_events for select to authenticated
  using (practice_is_manager() or exists (select 1 from practice_assignments a where a.id = assignment_id and a.person_id = practice_current_person_id()));
create policy completions_self on practice_completions for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy attempts_self on practice_attempts for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy attempt_responses_self on practice_attempt_responses for select to authenticated
  using (practice_is_manager() or exists (select 1 from practice_attempts a where a.id = attempt_id and a.person_id = practice_current_person_id()));
create policy credentials_self on practice_credentials for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy credential_state_self on practice_credential_state_events for select to authenticated
  using (practice_is_manager() or exists (select 1 from practice_credentials c where c.id = credential_id and c.person_id = practice_current_person_id()));
create policy certificates_self on practice_certificates for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy certificate_state_self on practice_certificate_state_events for select to authenticated
  using (practice_is_manager() or exists (select 1 from practice_certificates c where c.id = certificate_id and c.person_id = practice_current_person_id()));

-- Assessment content: items readable to any authenticated user (needed to take
-- one); attempts and practicals are per person above.
create policy assessments_read on practice_assessments for select to authenticated using (true);
create policy assessment_state_read on practice_assessment_state_events for select to authenticated using (true);
create policy assessment_items_read on practice_assessment_items for select to authenticated using (true);

-- Practical assessments: a person reads their own or the one they assessed; a
-- manager reads all. The assessor WRITE is enforced here: the signer must be the
-- current person and hold a current credential on the procedure.
create policy practicals_self on practice_practical_assessments for select to authenticated
  using (person_id = practice_current_person_id() or assessor_person_id = practice_current_person_id() or practice_is_manager());
create policy practicals_assessor_write on practice_practical_assessments for insert to authenticated
  with check (
    assessor_person_id = practice_current_person_id()
    and practice_holds_current_credential(document_version_id)
  );
create policy practical_results_read on practice_practical_checklist_results for select to authenticated
  using (practice_is_manager() or exists (select 1 from practice_practical_assessments p where p.id = practical_id and (p.person_id = practice_current_person_id() or p.assessor_person_id = practice_current_person_id())));

-- Questions: readable to any authenticated user assigned the module; a manager or
-- assessor writes an authoritative answer, enforced here.
create policy questions_read on practice_questions for select to authenticated using (true);
create policy question_answers_read on practice_question_answers for select to authenticated using (true);
create policy question_authoritative_write on practice_question_answers for insert to authenticated
  with check (
    kind = 'PEER'
    or practice_has_role('OPERATIONS_MANAGER') or practice_has_role('ASSESSOR')
  );

-- Own notification preferences and deliveries; managers all.
create policy notif_prefs_self on practice_notification_preferences for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());
create policy notif_deliveries_self on practice_notification_deliveries for select to authenticated
  using (person_id = practice_current_person_id() or practice_is_manager());

-- Manager and owner only: retention, oversight.
create policy retention_policies_mgr on practice_retention_policies for select to authenticated using (practice_is_manager());
create policy retention_holds_mgr on practice_retention_holds for select to authenticated using (practice_is_manager());
create policy tombstones_mgr on practice_disposal_tombstones for select to authenticated using (practice_is_manager());
create policy warrant_decisions_mgr on practice_warrant_decisions for select to authenticated using (practice_is_manager());
create policy warrant_reviews_mgr on practice_warrant_reviews for select to authenticated using (practice_is_manager());
create policy warrant_samples_mgr on practice_warrant_samples for select to authenticated using (practice_is_manager());
