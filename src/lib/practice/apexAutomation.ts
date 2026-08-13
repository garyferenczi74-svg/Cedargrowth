// APEX automation (CG Prompt 09D Section 11). APEX runs on schedule and on event,
// within the bars from Prompt 09, recording every decision to WARRANT per 09B.
// Anomaly flags are flags, not judgments: each raises to the operations manager
// with the evidence and no conclusion attached. Pure types and logic; the
// dispatch and the WARRANT writes live in the automation runtime when the
// backend is provisioned.

export type ApexEvent =
  | 'DOCUMENT_PUBLISHED' // compute drift and reassign, reason auto-populated
  | 'PERSON_HIRED' // assign the curriculum
  | 'ROLE_CHANGED' // assign the curriculum
  | 'ENGAGEMENT_STARTED' // assign the engagement curriculum
  | 'CREDENTIAL_SUPERSEDED'; // reassign and update the equipment board

export type ApexSchedule =
  | 'DAILY_OVERDUE' // overdue check and escalation
  | 'DAILY_EXPIRY_HORIZON'
  | 'WEEKLY_AUDIT' // training audit to the console
  | 'MONTHLY_ASSESSOR_CURRENCY'; // assessor currency check

export type ApexAnomaly =
  | 'FAST_KNOWLEDGE_CHECK' // completed faster than plausible
  | 'PLAYBACK_INSUFFICIENT' // marked complete with a trail that does not support it
  | 'MODULE_FAILURE_PATTERN'; // failures on one module suggesting the module, not the people

// The bars. APEX may not do any of these. An attempt is a blocked action that
// records in WARRANT. This mirrors the Prompt 09 bars, extended for 09D.
export const APEX_BARS = [
  'CERTIFY_COMPETENCY',
  'SIGN_PRACTICAL',
  'PUBLISH_ASSESSMENT_ITEM',
  'ALTER_RECORD',
  'WAIVE_REQUIREMENT',
  'EXTEND_DEADLINE',
  'LOCK_ACCOUNT',
  'CHARACTERIZE_PERSON',
] as const;

export type ApexBar = (typeof APEX_BARS)[number];

export function isApexBar(action: string): action is ApexBar {
  return (APEX_BARS as readonly string[]).includes(action);
}

// The result of APEX reaching for a barred action: blocked, and recorded to
// WARRANT. Never silently discarded.
export type BlockedApexAction = { blocked: true; recordToWarrant: true; action: ApexBar; reason: string };

export function blockApexAction(action: ApexBar): BlockedApexAction {
  return {
    blocked: true,
    recordToWarrant: true,
    action,
    reason: `APEX is barred from ${action.toLowerCase().replace(/_/g, ' ')}`,
  };
}

// An anomaly flag carries evidence and no conclusion. It raises to the operations
// manager, who decides. The conclusion is deliberately null.
export type AnomalyFlag = { kind: ApexAnomaly; evidence: string; conclusion: null };

export function raiseAnomaly(kind: ApexAnomaly, evidence: string): AnomalyFlag {
  return { kind, evidence, conclusion: null };
}
