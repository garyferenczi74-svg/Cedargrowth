// Evidence wing types and shared constants. Data lives in Supabase and is fetched
// through /api/admin/kelvin/evidence; the publish gate runs server side. This
// module holds only shapes, the public URL helper, and the default panel set the
// match action stamps onto a newly matched certificate.

export type Batch = { id: string; item: string; tag: string; coa: string; coaId: string; publish: string; pubDate: string; lab: string; terps: string[] };
export type Coa = { id: string; lab: string; batch: string; state: string; panels: Record<string, string> | null; potency: string; date: string };
export type Lab = { name: string; accreditation: string; license: string; turnaround: string; status: string };

export type EvidenceData = { batches: Batch[]; coas: Coa[]; labs: Lab[] };

export const PANELS_PASS: Record<string, string> = {
  Cannabinoids: 'Pass',
  Microbials: 'Pass',
  'Heavy metals': 'Pass',
  Pesticides: 'Pass',
  'Residual solvents': 'Not applicable, solventless',
};

export function publicUrl(batch: string): string {
  return `/transparency?batch=${batch}`;
}
