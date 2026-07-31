// Security wing store. Monitors, findings, incidents, rules, waivers, the audit
// chain, release prechecks, and vendor posture. The release clearance gate lives
// here: a build clears only when every precheck passes, which is how SENTINEL
// sits between LITMUS and VERNIER on the release chain.

export type Monitor = { id: string; name: string; target: string; cadence: string; lastRun: string; state: string };
export type Finding = { id: string; sev: string; title: string; monitor: string; state: string; detail: string };
export type Incident = { id: string; title: string; sev: string; status: string; opened: string; findings: string[] };
export type Rule = { id: string; rule: string; state: string; scope: string };
export type Waiver = { id: string; subject: string; reason: string; approver: string; status: string };
export type AuditRow = { time: string; actor: string; action: string; target: string };
export type Precheck = { id: string; item: string; state: string };
export type Vendor = { id: string; name: string; type: string; posture: string; lastReview: string };

const MONITORS: Monitor[] = [
  { id: 'M-01', name: 'Age gate synthetic', target: 'Public routes', cadence: 'Every deploy', lastRun: '14:22', state: 'Failing' },
  { id: 'M-02', name: 'Reserve endpoint rate', target: 'POST /api/reserve', cadence: '5 min', lastRun: '15:40', state: 'Degraded' },
  { id: 'M-03', name: 'COA publish gate', target: 'Evidence publishing', cadence: 'On publish', lastRun: '07-29', state: 'Passing' },
  { id: 'M-04', name: 'Metrc two key auth', target: 'Production connection', cadence: 'Hourly', lastRun: 'UNKNOWN', state: 'Failing' },
  { id: 'M-05', name: 'RLS coverage', target: 'Public schema', cadence: 'Daily', lastRun: '09:00', state: 'Passing' },
  { id: 'M-06', name: 'Dependency posture', target: 'Repository', cadence: 'Daily', lastRun: '08:00', state: 'Passing' },
];
const FINDINGS: Finding[] = [
  { id: 'F-01', sev: 'P0', title: 'Age gate renders after content on one route', monitor: 'M-01', state: 'Open', detail: 'On one route the gate paints after the content it protects. Preview build held. This is the alert on the Command feed.' },
  { id: 'F-02', sev: 'P1', title: 'Reserve endpoint has no rate limit', monitor: 'M-02', state: 'Triaged', detail: 'POST /api/reserve is public and unthrottled. A WAF rate limit rule is staged in log mode, not yet enforced.' },
  { id: 'F-03', sev: 'P1', title: 'Metrc connection not authenticated', monitor: 'M-04', state: 'Open', detail: 'Two key authentication is not configured. No package, transfer, or sale transmits until both keys are set.' },
  { id: 'F-04', sev: 'P2', title: 'Tertiary text contrast below AA', monitor: 'UNKNOWN', state: 'Resolved', detail: 'Tertiary ink failed AA at body sizes. VERNIER tuning applied and re verified.' },
];
const INCIDENTS: Incident[] = [
  { id: 'I-01', title: 'Preview build held on age gate', sev: 'P0', status: 'Open', opened: '14:25', findings: ['F-01'] },
  { id: 'I-02', title: 'Public endpoint hardening', sev: 'P1', status: 'Contained', opened: '07-30', findings: ['F-02'] },
];
const RULES: Rule[] = [
  { id: 'R-01', rule: 'MFA mandatory on admin accounts', state: 'Enforced', scope: 'Kelvin auth' },
  { id: 'R-02', rule: 'WAF rate limit on POST /api/reserve', state: 'Staged', scope: 'Public API' },
  { id: 'R-03', rule: 'RLS enabled on the public schema', state: 'Enforced', scope: 'Database' },
  { id: 'R-04', rule: 'No secret key in the client bundle', state: 'Enforced', scope: 'Build' },
  { id: 'R-05', rule: 'No em dash or en dash in shipped copy', state: 'Enforced', scope: 'Content lint' },
  { id: 'R-06', rule: 'Unauthenticated Kelvin routes return 404', state: 'Enforced', scope: 'Routing' },
];
const WAIVERS: Waiver[] = [
  { id: 'W-01', subject: 'pg_net extension advisory', reason: 'Accepted for scheduled egress', approver: 'Owner', status: 'Active' },
  { id: 'W-02', subject: 'Anonymous demo RPC', reason: 'Marketing demo only, no PII', approver: 'Owner', status: 'Active' },
];
const AUDIT: AuditRow[] = [
  { time: '14:22', actor: 'SENTINEL', action: 'Held preview build', target: 'Age gate finding F-01' },
  { time: '13:58', actor: 'LITMUS', action: 'Cleared first gate', target: 'rc-004' },
  { time: '11:40', actor: 'CODEX', action: 'Staged canon version', target: 'Terpene index v2' },
  { time: '09:00', actor: 'MERIDIAN', action: 'Filed daily audit', target: 'Seven agents' },
  { time: '08:30', actor: 'Owner', action: 'Signed in with MFA', target: 'Kelvin session' },
];
const PRECHECK: Precheck[] = [
  { id: 'PC-1', item: 'Age gate order correct on every route', state: 'Fail' },
  { id: 'PC-2', item: 'Rate limit enforced on public endpoints', state: 'Fail' },
  { id: 'PC-3', item: 'No secret key reachable from the client', state: 'Pass' },
  { id: 'PC-4', item: 'MFA enforced on admin accounts', state: 'Pass' },
  { id: 'PC-5', item: 'Content lint clean, no banned dashes', state: 'Pass' },
];
const VENDORS: Vendor[] = [
  { id: 'V-01', name: 'Supabase', type: 'Database and auth', posture: 'Reviewed', lastReview: '07-28' },
  { id: 'V-02', name: 'Vercel', type: 'Hosting and WAF', posture: 'Reviewed', lastReview: '07-28' },
  { id: 'V-03', name: 'Resend', type: 'Transactional email', posture: 'Pending', lastReview: 'UNKNOWN' },
  { id: 'V-04', name: 'Metrc', type: 'State traceability', posture: 'Pending', lastReview: 'UNKNOWN' },
  { id: 'V-05', name: 'Socket.dev', type: 'Dependency scanning', posture: 'Enforced', lastReview: '07-27' },
];

const f = (id: string) => FINDINGS.find((x) => x.id === id) || null;

export const Security = {
  listMonitors: () => MONITORS.slice(),
  runMonitor: (id: string, time: string) => { const m = MONITORS.find((x) => x.id === id); if (m) m.lastRun = time; return m; },
  listFindings: () => FINDINGS.slice(),
  getFinding: (id: string) => f(id),
  setFinding: (id: string, state: string) => { const x = f(id); if (x) x.state = state; return x; },
  listIncidents: () => INCIDENTS.slice(),
  setIncident: (id: string, status: string) => { const x = INCIDENTS.find((y) => y.id === id); if (x) x.status = status; return x; },
  listRules: () => RULES.slice(),
  enforceRule: (id: string) => { const x = RULES.find((y) => y.id === id); if (x && x.state === 'Staged') x.state = 'Enforced'; return x; },
  listWaivers: () => WAIVERS.slice(),
  revokeWaiver: (id: string) => { const x = WAIVERS.find((y) => y.id === id); if (x) x.status = 'Revoked'; return x; },
  listAudit: () => AUDIT.slice(),
  listPrecheck: () => PRECHECK.slice(),
  clearRelease: (): { ok: boolean; reason?: string } => {
    const fails = PRECHECK.filter((p) => p.state === 'Fail');
    if (fails.length) return { ok: false, reason: `${fails.length} precheck item${fails.length > 1 ? 's' : ''} failing. SENTINEL cannot clear the release until they pass.` };
    return { ok: true };
  },
  listVendors: () => VENDORS.slice(),
  reviewVendor: (id: string, time: string) => { const x = VENDORS.find((y) => y.id === id); if (x) { x.posture = 'Reviewed'; x.lastReview = time; } return x; },
};
