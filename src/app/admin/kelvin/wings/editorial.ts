// Editorial wing types and stage chain. Data lives in Supabase and is fetched
// through /api/admin/kelvin/editorial; the clearance gate (dictionary scan) and
// the stage chain are enforced server side. This module holds only shapes and the
// chain order.

export type Draft = { id: string; title: string; author: string; stage: string; scan: string; flag: string; blocker: string; pubDate: string };
export type Research = { id: string; topic: string; source: string; status: string };
export type EditorialData = { drafts: Draft[]; research: Research[] };

export const STAGES = ['Draft', 'In clearance', 'Cleared', 'Approved', 'Scheduled', 'Published'];

export function stageIndex(s: string): number {
  return STAGES.indexOf(s);
}
