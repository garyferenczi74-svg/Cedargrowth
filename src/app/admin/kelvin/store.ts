// KELVIN Command wing data model and seeds. Pure data and types, no DOM. The
// console holds the mutable pieces (events, review) in React state and reads the
// static pieces from here. When a real backend arrives, only this module and the
// per wing stores change.

export type EventType =
  | 'ALERT'
  | 'GATE'
  | 'BUILD'
  | 'KNOWLEDGE'
  | 'TUNING'
  | 'DRAFT'
  | 'AUDIT'
  | 'DECISION';

export type KEvent = {
  id: number;
  agent: string;
  time: string;
  type: EventType;
  summary: string;
  sub: string;
  wing?: string;
};

export type Agent = {
  id: string;
  fn: string;
  status: 'ACTIVE' | 'HOLDING';
  task: string;
  errors: number;
  recs: string[];
};

export type ReviewItem = {
  id: string;
  from: string;
  title: string;
  body: string;
  status: 'open' | 'approved' | 'rejected' | 'sentback';
  note?: string;
};

export type WingDef = {
  id: string;
  label: string;
  accent: string;
  sections?: [string, string][];
  routes?: string[];
};

export const EVENT_TYPES: EventType[] = [
  'ALERT',
  'GATE',
  'BUILD',
  'KNOWLEDGE',
  'TUNING',
  'DRAFT',
  'AUDIT',
  'DECISION',
];

export const WINGS: WingDef[] = [
  {
    id: 'command',
    label: 'Command',
    accent: '--k-command',
    sections: [
      ['live-feed', 'Live Feed'],
      ['agents', 'Agents'],
      ['review', 'Review'],
      ['queue', 'Queue'],
      ['steering', 'Steering'],
      ['evolution', 'Evolution'],
      ['knowledge', 'Knowledge'],
    ],
  },
  { id: 'production', label: 'Production', accent: '--k-production', routes: ['dashboard', 'orders', 'stock', 'runs', 'accounts', 'sales', 'skus', 'alerts', 'trace'] },
  { id: 'evidence', label: 'Evidence', accent: '--k-evidence', routes: ['batches', 'coa-intake', 'publishing', 'terpenes', 'laboratories', 'archive'] },
  { id: 'genomics', label: 'Genomics', accent: '--k-genomics', routes: ['kits', 'fulfillment', 'lab-status', 'consent', 'delivery', 'metrics'] },
  { id: 'security', label: 'Security', accent: '--k-security', routes: ['monitors', 'findings', 'incidents', 'rules', 'waivers', 'audit', 'precheck', 'vendors'] },
  { id: 'editorial', label: 'Editorial', accent: '--k-editorial', routes: ['overview', 'research', 'drafts', 'clearance', 'approval', 'schedule', 'published'] },
];

export const AGENTS: Agent[] = [
  { id: 'MERIDIAN', fn: 'Orchestration, routing, daily audit', status: 'ACTIVE', task: 'Filed the 09:00 audit. Routing three items to owner review.', errors: 0, recs: [] },
  { id: 'FOUNDRY', fn: 'Engineering and tooling', status: 'ACTIVE', task: 'Verified token sync against the design source. Repo health green.', errors: 0, recs: ['Pin the font subset before the portal ports into the repo.'] },
  { id: 'CODEX', fn: 'Knowledge and canon custody', status: 'ACTIVE', task: 'Staged terpene index v2. Awaiting owner approval.', errors: 0, recs: ['Terpene index v2 needs one more citation on limonene.'] },
  { id: 'LITMUS', fn: 'Quality assurance, first gate', status: 'ACTIVE', task: 'Cleared rc-004 through the first gate. Passed to SENTINEL.', errors: 0, recs: [] },
  { id: 'VERNIER', fn: 'Release management and tuning', status: 'ACTIVE', task: 'Filed a contrast tuning proposal. rc-003 holding at the release gate.', errors: 0, recs: ['Raise tertiary text to AA at body sizes.'] },
  { id: 'SENTINEL', fn: 'Security, compliance, clearance', status: 'HOLDING', task: 'Held a preview build. Age gate rendered after content on one route. P0.', errors: 1, recs: ['Do not promote the held build until the gate order is corrected.'] },
  { id: 'APERTURE', fn: 'Content and editorial', status: 'ACTIVE', task: 'Holding the cold cure research note for an originality check.', errors: 0, recs: [] },
];

export const SEED_EVENTS: KEvent[] = [
  { id: 1, agent: 'MERIDIAN', time: '09:00', type: 'AUDIT', summary: 'Daily audit filed', sub: 'Seven agents reporting. Zero escapes in 30 days.' },
  { id: 2, agent: 'SENTINEL', time: '14:22', type: 'ALERT', summary: 'Age gate synthetic failed on preview build', sub: 'Gate rendered after content on one route. P0. Build held.', wing: 'security' },
  { id: 3, agent: 'LITMUS', time: '13:58', type: 'GATE', summary: 'rc-004 cleared first gate', sub: 'Three lint hits resolved. Passed to SENTINEL.' },
  { id: 4, agent: 'CODEX', time: '11:40', type: 'KNOWLEDGE', summary: 'Terpene index v2 staged', sub: 'Fourteen entries, nine citations. Awaiting owner approval.' },
  { id: 5, agent: 'VERNIER', time: '15:10', type: 'TUNING', summary: 'Proposal filed: tertiary text contrast', sub: 'Raise the gate to AA at body sizes. Affects six components.' },
  { id: 6, agent: 'FOUNDRY', time: '12:05', type: 'BUILD', summary: 'Token sync verified', sub: 'Forty one semantic variables matched against the design source.' },
  { id: 7, agent: 'APERTURE', time: '16:30', type: 'DRAFT', summary: 'Research note held', sub: 'Cold cure piece awaiting SENTINEL originality check.' },
  { id: 8, agent: 'MERIDIAN', time: '08:12', type: 'DECISION', summary: 'Overnight queue triaged', sub: 'Two release candidates and one draft carried into the day.' },
  { id: 9, agent: 'CODEX', time: '10:20', type: 'KNOWLEDGE', summary: 'Claims guardrails synced to canon', sub: 'Wellness policy language matched against the current federal posture.' },
  { id: 10, agent: 'LITMUS', time: '11:02', type: 'GATE', summary: 'rc-003 returned to VERNIER', sub: 'First gate clean. Held at the release gate for the tuning decision.' },
  { id: 11, agent: 'FOUNDRY', time: '13:15', type: 'BUILD', summary: 'Preview build minted for rc-004', sub: 'Immutable URL issued. Handed to LITMUS for the first gate.' },
  { id: 12, agent: 'SENTINEL', time: '15:40', type: 'AUDIT', summary: 'Clearance log reconciled', sub: 'Every clearance in the last cycle traced to a named gate.' },
];

export const SEED_REVIEW: ReviewItem[] = [
  { id: 'rv-1', from: 'VERNIER . TUNING', title: 'Raise tertiary text contrast to AA', body: 'Tertiary ink fails AA at body sizes on the parchment chrome. Proposal raises it and restates the token. Affects six components. No layout change.', status: 'open' },
  { id: 'rv-2', from: 'SENTINEL . CLEARANCE', title: 'Endorsement of rc-004 for release', body: 'rc-004 passed the first gate and the security review with zero findings. SENTINEL endorses. Owner approval opens the release gate.', status: 'open' },
  { id: 'rv-3', from: 'CODEX . KNOWLEDGE', title: 'Approve terpene index v2 for canon', body: 'Fourteen entries, nine citations, one citation still thin on limonene. Approval versions the canon and publishes to the transparency source.', status: 'open' },
];

export function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const TICK_SUMMARIES: Record<EventType, string[]> = {
  ALERT: ['Synthetic probe flagged a slow route', 'Rate limit threshold approached on a public form'],
  GATE: ['Candidate cleared the first gate', 'Second gate opened for review'],
  BUILD: ['Preview build minted', 'Token sync re verified'],
  KNOWLEDGE: ['Citation added to a canon entry', 'Canon version staged for approval'],
  TUNING: ['Contrast sample measured on parchment', 'Focus ring offset verified'],
  DRAFT: ['Research note advanced to clearance', 'Draft returned for one revision'],
  AUDIT: ['Clearance log reconciled', 'Routing table checked against the roster'],
  DECISION: ['Queue item carried forward', 'Reference line rebalanced the day'],
};

export function mintEvent(nextId: number, agentFilter: string | null, typeFilter: EventType | null): KEvent {
  const agent = agentFilter || AGENTS[Math.floor(Math.random() * AGENTS.length)].id;
  const type = typeFilter || EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const pool = TICK_SUMMARIES[type];
  return {
    id: nextId,
    agent,
    time: nowTime(),
    type,
    summary: pool[Math.floor(Math.random() * pool.length)],
    sub: 'Minted by the live ticker for review continuity.',
    wing: type === 'ALERT' ? 'security' : undefined,
  };
}
