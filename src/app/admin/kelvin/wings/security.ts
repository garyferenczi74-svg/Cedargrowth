// Security wing types and the release gate helper. Data lives in Supabase and is
// fetched through /api/admin/kelvin/security; the release clearance gate is
// enforced server side in the mutate route. releaseGate mirrors that check for
// the client display.

export type Monitor = { id: string; name: string; target: string; cadence: string; lastRun: string; state: string };
export type Finding = { id: string; sev: string; title: string; monitor: string; state: string; detail: string };
export type Incident = { id: string; title: string; sev: string; status: string; opened: string; findings: string[] };
export type Rule = { id: string; rule: string; state: string; scope: string };
export type Waiver = { id: string; subject: string; reason: string; approver: string; status: string };
export type AuditRow = { time: string; actor: string; action: string; target: string };
export type Precheck = { id: string; item: string; state: string };
export type Vendor = { id: string; name: string; type: string; posture: string; lastReview: string };

export type SecurityData = {
  monitors: Monitor[]; findings: Finding[]; incidents: Incident[]; rules: Rule[];
  waivers: Waiver[]; audit: AuditRow[]; prechecks: Precheck[]; vendors: Vendor[];
};

export function releaseGate(prechecks: Precheck[]): { ok: boolean; reason?: string } {
  const fails = prechecks.filter((p) => p.state === 'Fail');
  if (fails.length) return { ok: false, reason: `${fails.length} precheck item${fails.length > 1 ? 's' : ''} failing. SENTINEL cannot clear the release until they pass.` };
  return { ok: true };
}
