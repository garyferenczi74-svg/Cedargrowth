// Genomics wing types and helpers. Counts and status only. There is no field or
// route that carries a genetic result: the stored 'result' is a status token,
// Sealed or Pending, never data. REFUSAL is the structural response to any read
// attempt, the same for every kit, because there is no owner override.

export type Kit = { id: string; subject: string; status: string; consent: string; lab: string; ordered: string; result: string; delivery: string };
export type GenomicsData = { kits: Kit[] };

export const REFUSAL = 'Unreadable. Individual genetic results are not readable from any administrative context, and there is no override.';

export function countsByStatus(kits: Kit[]): Record<string, number> {
  const m: Record<string, number> = {};
  kits.forEach((x) => { m[x.status] = (m[x.status] || 0) + 1; });
  return m;
}
export function consentCounts(kits: Kit[]): Record<string, number> {
  const m: Record<string, number> = { Granted: 0, Pending: 0, Withdrawn: 0 };
  kits.forEach((x) => { m[x.consent] = (m[x.consent] || 0) + 1; });
  return m;
}
export function resultedCount(kits: Kit[]): number {
  return kits.filter((x) => x.result === 'Sealed').length;
}
export function deliveredCount(kits: Kit[]): number {
  return kits.filter((x) => x.delivery === 'Delivered').length;
}
