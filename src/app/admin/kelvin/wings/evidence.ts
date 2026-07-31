// Evidence wing store. Batch registry, COA ingestion, and publishing to the
// public transparency source. The publish gate lives here: a batch publishes only
// once its COA is ingested and Passed. Module singleton, mutated in place.

export type Batch = { id: string; item: string; tag: string; coa: string; coaId: string; publish: string; pubDate: string; lab: string; terps: string[] };
export type Coa = { id: string; lab: string; batch: string; state: string; panels: Record<string, string> | null; potency: string; date: string };
export type Lab = { name: string; accreditation: string; license: string; turnaround: string; status: string };

const PANELS_PASS: Record<string, string> = { Cannabinoids: 'Pass', Microbials: 'Pass', 'Heavy metals': 'Pass', Pesticides: 'Pass', 'Residual solvents': 'Not applicable, solventless' };
const PANELS_FAIL: Record<string, string> = { Cannabinoids: 'Pass', Microbials: 'Fail', 'Heavy metals': 'Pass', Pesticides: 'Pass', 'Residual solvents': 'Not applicable, solventless' };

const BATCHES: Batch[] = [
  { id: 'B-2411', item: 'Gummies 10ct 100mg', tag: '1A4FF0100000A22000000150', coa: 'Passed', coaId: 'COA-8842', publish: 'Published', pubDate: '07-29', lab: 'Empire Analytical', terps: ['Myrcene', 'Limonene', 'Caryophyllene'] },
  { id: 'B-2410', item: 'Preroll 1g', tag: '1A4FF0100000A22000000153', coa: 'Passed', coaId: 'COA-8830', publish: 'Unpublished', pubDate: 'UNKNOWN', lab: 'Empire Analytical', terps: ['Terpinolene', 'Ocimene', 'Myrcene'] },
  { id: 'B-2408', item: '0.5g Vape, fresh frozen', tag: '1A4FF0100000A22000000148', coa: 'Ingested', coaId: 'COA-8850', publish: 'Unpublished', pubDate: 'UNKNOWN', lab: 'Keystone Labs', terps: ['Limonene', 'Linalool', 'Pinene'] },
  { id: 'B-2412', item: '1g Rosin, dried cured', tag: '1A4FF0100000A22000000149', coa: 'Awaiting', coaId: 'UNKNOWN', publish: 'Unpublished', pubDate: 'UNKNOWN', lab: 'Keystone Labs', terps: [] },
  { id: 'B-2409', item: 'Ice water hash, fresh frozen', tag: '1A4FF0100000A22000000151', coa: 'Failed', coaId: 'COA-8825', publish: 'Unpublished', pubDate: 'UNKNOWN', lab: 'Keystone Labs', terps: ['Myrcene', 'Humulene'] },
  { id: 'B-2405', item: 'Preroll 1g, week 26', tag: '1A4FF0100000A22000000131', coa: 'Passed', coaId: 'COA-8790', publish: 'Archived', pubDate: '07-12', lab: 'Empire Analytical', terps: ['Myrcene', 'Pinene'] },
];

const COAS: Coa[] = [
  { id: 'COA-8850', lab: 'Keystone Labs', batch: 'B-2408', state: 'Ingested', panels: PANELS_PASS, potency: 'UNKNOWN', date: '07-31' },
  { id: 'COA-8851', lab: 'Empire Analytical', batch: 'UNKNOWN', state: 'Received', panels: null, potency: 'UNKNOWN', date: '07-31' },
  { id: 'COA-8842', lab: 'Empire Analytical', batch: 'B-2411', state: 'Passed', panels: PANELS_PASS, potency: 'UNKNOWN', date: '07-29' },
  { id: 'COA-8830', lab: 'Empire Analytical', batch: 'B-2410', state: 'Passed', panels: PANELS_PASS, potency: 'UNKNOWN', date: '07-28' },
  { id: 'COA-8825', lab: 'Keystone Labs', batch: 'B-2409', state: 'Failed', panels: PANELS_FAIL, potency: 'UNKNOWN', date: '07-27' },
];

const LABS: Lab[] = [
  { name: 'Keystone Labs', accreditation: 'ISO 17025', license: 'OCM-LAB-UNKNOWN', turnaround: '5 business days', status: 'Active' },
  { name: 'Empire Analytical', accreditation: 'ISO 17025', license: 'OCM-LAB-UNKNOWN', turnaround: '4 business days', status: 'Active' },
];

const b = (id: string) => BATCHES.find((x) => x.id === id) || null;
const c = (id: string) => COAS.find((x) => x.id === id) || null;

export const Evidence = {
  listBatches: () => BATCHES.slice(),
  getBatch: (id: string) => b(id),
  listCoas: () => COAS.slice(),
  getCoa: (id: string) => c(id),
  listLabs: () => LABS.slice(),
  publishedCount: () => BATCHES.filter((x) => x.publish === 'Published').length,
  passedUnpublished: () => BATCHES.filter((x) => x.coa === 'Passed' && x.publish === 'Unpublished').length,
  publicUrl: (batch: string) => `/transparency?batch=${batch}`,
  adjudicateCoa: (id: string) => {
    const coa = c(id);
    if (!coa || coa.state !== 'Ingested') return null;
    const fail = coa.panels && Object.keys(coa.panels).some((k) => coa.panels![k] === 'Fail');
    coa.state = fail ? 'Failed' : 'Passed';
    const bt = b(coa.batch);
    if (bt) bt.coa = coa.state;
    return coa;
  },
  matchCoa: (id: string, batchId: string) => {
    const coa = c(id);
    const bt = b(batchId);
    if (!coa || !bt) return null;
    coa.batch = batchId;
    coa.state = 'Ingested';
    coa.panels = PANELS_PASS;
    bt.coaId = coa.id;
    bt.coa = 'Ingested';
    return coa;
  },
  publishBatch: (id: string): { ok: boolean; reason?: string; batch?: Batch } => {
    const bt = b(id);
    if (!bt) return { ok: false, reason: 'Batch not found.' };
    if (bt.coa !== 'Passed') return { ok: false, reason: `Batch ${id} is ${bt.coa}. A COA must be ingested and Passed before it can publish to transparency.` };
    if (bt.publish === 'Published') return { ok: false, reason: `Batch ${id} is already published.` };
    bt.publish = 'Published';
    bt.pubDate = 'new';
    return { ok: true, batch: bt };
  },
  unpublishBatch: (id: string) => {
    const bt = b(id);
    if (bt && bt.publish === 'Published') {
      bt.publish = 'Unpublished';
      bt.pubDate = 'UNKNOWN';
    }
    return bt;
  },
};
