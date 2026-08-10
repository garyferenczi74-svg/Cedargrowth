// WARRANT wing data model. Pure data and types, no DOM. WARRANT records and
// reviews autonomous decisions across every agent, with APEX as its first
// tenant. It is not a log. A log answers what happened. WARRANT answers whether
// the action should have happened, by binding every decision to the five things
// a log does not carry: the authority that permitted it, the inputs the agent
// could see, the alternatives it did not take, the reversibility, and the
// impact.
//
// This module ships with an EMPTY decision ledger. Nothing here fabricates a
// decision, a confidence value, an input, or a counterfactual. Missing values
// render UNKNOWN in the wing. A real backend fills DECISIONS through a write
// path that must call validateDecision and reject anything the gate refuses.

// The fixed decision vocabulary. Extensible as data, not code.
export type DecisionClass =
  | 'ASSIGN'
  | 'REASSIGN'
  | 'REMIND'
  | 'ESCALATE'
  | 'FLAG'
  | 'EXPIRE'
  | 'DRAFT'
  | 'SCHEDULE'
  | 'BLOCK'
  | 'EXPORT';

export const DECISION_CLASSES: DecisionClass[] = [
  'ASSIGN',
  'REASSIGN',
  'REMIND',
  'ESCALATE',
  'FLAG',
  'EXPIRE',
  'DRAFT',
  'SCHEDULE',
  'BLOCK',
  'EXPORT',
];

export type Outcome = 'EXECUTED' | 'BLOCKED' | 'DEFERRED TO HUMAN';
export type Reversibility = 'REVERSIBLE' | 'REVERSIBLE WITH EFFORT' | 'IRREVERSIBLE';
export type ReviewState = 'Unreviewed' | 'Sampled' | 'Reviewed';

// One decision record, used by every agent. Append only and immutable: there is
// no edit or delete path in the interface or in any store built on this type. A
// correction is a new record that cites the one it corrects, through corrects.
export type WarrantDecision = {
  id: string;
  agent: string;
  timestamp: string;
  klass: DecisionClass;
  outcome: Outcome;
  // The specific rule that permitted the action, by identifier, not a category.
  authority: string;
  // What the agent could see when it decided, as a structured snapshot. This is
  // what makes a decision reproducible and a mistake diagnosable.
  inputs: Record<string, string>;
  // What else was available and was not taken, and why.
  alternatives: string;
  reversibility: Reversibility;
  reversibleBy: string;
  reversibleUntil: string;
  // Count of people or records affected, and their identifiers.
  impactCount: number;
  impactIds: string[];
  // Where the agent reports a confidence, or null for UNKNOWN. Never invented.
  confidence: number | null;
  reviewState: ReviewState;
  reviewedBy: string | null;
  reviewedOn: string | null;
  // A blocked attempt names the rule that refused it. Null on an executed
  // decision.
  blockedByRule: string | null;
  corrects: string | null;
};

// The five warrant fields. A decision missing any one of them is not reviewable,
// and a system that cannot produce all five for an action should not take that
// action autonomously.
export const WARRANT_FIELDS = ['authority', 'inputs', 'alternatives', 'reversibility', 'impact'] as const;

// The store gate. A decision arriving with an empty warrant field is rejected,
// not stored as a partial record. It becomes a recommendation requiring human
// action. This is the real gate, worth more than any dashboard.
export function validateDecision(d: Partial<WarrantDecision>): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!d.authority || !d.authority.trim()) missing.push('authority');
  if (!d.inputs || Object.keys(d.inputs).length === 0) missing.push('inputs');
  if (!d.alternatives || !d.alternatives.trim()) missing.push('alternatives');
  if (!d.reversibility) missing.push('reversibility');
  // Impact is a count and its identifiers. A count of zero is allowed and
  // meaningful, so the presence check is on the count being a number, not on it
  // being truthy.
  if (typeof d.impactCount !== 'number' || !Array.isArray(d.impactIds)) missing.push('impact');
  return { ok: missing.length === 0, missing };
}

// Configured values, not constants. They can move without a code change once a
// settings surface exists.
export const WARRANT_CONFIG = {
  // High impact: affecting more than this many people, or carrying IRREVERSIBLE
  // reversibility. Both thresholds are configured.
  highImpactPeople: 5,
  highImpactIrreversible: true as const,
  // Repeated blocks against one rule raise a live feed ALERT at this count
  // within this window, in days.
  blockAlertCount: 3,
  blockAlertWindowDays: 7,
  // The weekly review sample: large enough to be defensible, small enough to be
  // read.
  weeklySampleSize: 20,
  // The trailing window drift measures against, in days.
  driftBaselineDays: 30,
};

// The rule set as data. Every rule any agent can cite as authority, what it
// permits or bars, and which agent holds it. Rules that BAR an action are shown
// alongside rules that PERMIT one, so the reader sees the full envelope.
//
// The APEX bars are the enforcement rules from Prompt 09. They render read only
// in this build. Changes route through the operations manager and counsel.
export type RuleKind = 'PERMIT' | 'BAR';
export type AuthorityRule = {
  id: string;
  agent: string;
  kind: RuleKind;
  permits: string;
  editable: boolean;
};

export const WARRANT_RULES: AuthorityRule[] = [
  // APEX permits.
  { id: 'APEX-P-ASSIGN', agent: 'APEX', kind: 'PERMIT', permits: 'Assign a controlled document to a person, a role, or everyone, with a due date and a required reason.', editable: false },
  { id: 'APEX-P-REASSIGN', agent: 'APEX', kind: 'PERMIT', permits: 'Reassign acknowledgment when a document is superseded, to everyone whose acknowledgment now sits against the superseded version.', editable: false },
  { id: 'APEX-P-REMIND', agent: 'APEX', kind: 'PERMIT', permits: 'Remind a person of an outstanding or approaching item.', editable: false },
  { id: 'APEX-P-ESCALATE', agent: 'APEX', kind: 'PERMIT', permits: 'Escalate an overdue item to the operations manager.', editable: false },
  { id: 'APEX-P-FLAG', agent: 'APEX', kind: 'PERMIT', permits: 'Flag an anomaly, such as an assessment completed below a plausible time, for human review.', editable: false },
  { id: 'APEX-P-AUDIT', agent: 'APEX', kind: 'PERMIT', permits: 'File the daily training audit and record its findings.', editable: false },
  // APEX bars, from Prompt 09. Read only in this build.
  { id: 'APEX-B-CERTIFY', agent: 'APEX', kind: 'BAR', permits: 'Never certify competency.', editable: false },
  { id: 'APEX-B-SOP', agent: 'APEX', kind: 'BAR', permits: 'Never approve or publish an SOP version.', editable: false },
  { id: 'APEX-B-RECORD', agent: 'APEX', kind: 'BAR', permits: 'Never alter or backdate a record.', editable: false },
  { id: 'APEX-B-ASSESSMENT', agent: 'APEX', kind: 'BAR', permits: 'Never write a live assessment question without human approval.', editable: false },
  { id: 'APEX-B-WAIVE', agent: 'APEX', kind: 'BAR', permits: 'Never waive a requirement or extend a deadline.', editable: false },
  { id: 'APEX-B-VIEW', agent: 'APEX', kind: 'BAR', permits: 'Never hold a view the operations manager cannot see.', editable: false },
];

// The counterfactual method per decision class: what would have happened with no
// agent acting. Computed plainly from the data, with the method stated. Where a
// method is not defined, the class carries null and the wing reports it rather
// than inventing a number. An invented counterfactual is worse than an absent
// one, because it will be quoted.
export const COUNTERFACTUAL_METHOD: Record<DecisionClass, string | null> = {
  REASSIGN:
    'Count the people who would currently be out of date on a superseded procedure had the drift not been caught.',
  ESCALATE: 'Count the overdue items that would still be unflagged.',
  FLAG: 'Count the anomalies nobody would have seen.',
  ASSIGN: null,
  REMIND: null,
  EXPIRE: null,
  DRAFT: null,
  SCHEDULE: null,
  BLOCK: null,
  EXPORT: null,
};

// The classes with no counterfactual method defined. Surfaced in the wing and in
// the delivery report.
export function classesWithoutCounterfactual(): DecisionClass[] {
  return DECISION_CLASSES.filter((c) => COUNTERFACTUAL_METHOD[c] === null);
}

// The empty ledger. Nothing is seeded. Every figure in the wing computes from
// this, so an unloaded or empty set renders UNKNOWN, never a fabricated zero
// that reads as a real measurement.
export const DECISIONS: WarrantDecision[] = [];

// Pure compute helpers. Each returns null where the data cannot answer honestly,
// which the wing renders as UNKNOWN.
export function isHighImpact(d: WarrantDecision): boolean {
  return d.impactCount > WARRANT_CONFIG.highImpactPeople || d.reversibility === 'IRREVERSIBLE';
}

export function blockedDecisions(decisions: WarrantDecision[]): WarrantDecision[] {
  return decisions.filter((d) => d.outcome === 'BLOCKED');
}

export type VolumeCell = { agent: string; klass: DecisionClass; count: number };
export function volumeByAgentClass(decisions: WarrantDecision[]): VolumeCell[] {
  const map = new Map<string, VolumeCell>();
  for (const d of decisions) {
    const key = `${d.agent}|${d.klass}`;
    const cell = map.get(key) || { agent: d.agent, klass: d.klass, count: 0 };
    cell.count += 1;
    map.set(key, cell);
  }
  return Array.from(map.values());
}

// A count of blocks per rule, for the repeated block ALERT threshold. Returns
// the rules that have crossed the configured count.
export function rulesOverBlockThreshold(decisions: WarrantDecision[]): { rule: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const d of blockedDecisions(decisions)) {
    if (!d.blockedByRule) continue;
    counts.set(d.blockedByRule, (counts.get(d.blockedByRule) || 0) + 1);
  }
  return Array.from(counts.entries())
    .filter(([, n]) => n >= WARRANT_CONFIG.blockAlertCount)
    .map(([rule, count]) => ({ rule, count }));
}
