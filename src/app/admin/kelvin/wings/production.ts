// Production wing store, the TraceProvider seam. All Metrc shaped state and the
// gates live here: the test gate (releasable only at TestPassed or RetestPassed),
// the manifest requirement, and the discrepancy threshold. A module singleton,
// mutated in place; the wing forces a re-render after each action. When the real
// Metrc API arrives, only this file changes.

export type Pkg = {
  id: string;
  tag: string;
  item: string;
  cat: string;
  qty: number;
  uom: string;
  test: string;
  loc: string;
  status: string;
  harvest: string;
  lab: string;
  potency: string;
};
export type Harvest = { id: string; name: string; source: string; wet: string; dry: string; stage: string; packages: string[] };
export type Transfer = { id: string; manifest: string; dir: string; party: string; pkgs: string[]; status: string; manifestQty: number; receivedQty: number | null; date: string };
export type Sale = { id: string; date: string; party: string; pkgs: string[]; qty: number; uom: string; recorded: boolean };
export type Sku = { sku: string; item: string; cat: string; unit: string; pkgs: number };
export type ProdAlert = { id: string; kind: string; subject: string; detail: string; sev: 'attention' | 'fail'; status: 'open' | 'acknowledged' };

export const THRESHOLD_PCT = 1.0;
const RELEASABLE = ['TestPassed', 'RetestPassed'];

const CONNECTION = {
  facility: 'CedarGrowth Processor, Buffalo',
  licenseType: 'Processor',
  license: 'OCM-PROC-UNKNOWN',
  vendorKey: 'UNKNOWN',
  userKey: 'UNKNOWN',
  state: 'Keys pending',
  lastSync: 'UNKNOWN',
};

const PACKAGES: Pkg[] = [
  { id: 'P1', tag: '1A4FF0100000A22000000148', item: '0.5g Vape, fresh frozen', cat: 'Vape Cartridge', qty: 120, uom: 'Each', test: 'TestPassed', loc: 'Vault A', status: 'Active', harvest: 'H-014', lab: 'Keystone Labs', potency: 'UNKNOWN' },
  { id: 'P2', tag: '1A4FF0100000A22000000149', item: '1g Rosin, dried cured', cat: 'Concentrate', qty: 480, uom: 'Grams', test: 'AwaitingResults', loc: 'Post press', status: 'Active', harvest: 'H-014', lab: 'Keystone Labs', potency: 'UNKNOWN' },
  { id: 'P3', tag: '1A4FF0100000A22000000150', item: 'Gummies 10ct 100mg', cat: 'Edible', qty: 200, uom: 'Each', test: 'RetestPassed', loc: 'Vault B', status: 'Active', harvest: 'H-012', lab: 'Empire Analytical', potency: 'UNKNOWN' },
  { id: 'P4', tag: '1A4FF0100000A22000000151', item: 'Ice water hash, fresh frozen', cat: 'Concentrate', qty: 260, uom: 'Grams', test: 'TestFailed', loc: 'Quarantine', status: 'On hold', harvest: 'H-015', lab: 'Keystone Labs', potency: 'UNKNOWN' },
  { id: 'P5', tag: '1A4FF0100000A22000000152', item: '0.5g Vape, dried cured', cat: 'Vape Cartridge', qty: 90, uom: 'Each', test: 'NotSubmitted', loc: 'Staging', status: 'Active', harvest: 'H-016', lab: 'UNKNOWN', potency: 'UNKNOWN' },
  { id: 'P6', tag: '1A4FF0100000A22000000153', item: 'Preroll 1g', cat: 'Preroll', qty: 500, uom: 'Each', test: 'TestPassed', loc: 'Vault A', status: 'Active', harvest: 'H-012', lab: 'Empire Analytical', potency: 'UNKNOWN' },
];

const HARVESTS: Harvest[] = [
  { id: 'H-014', name: 'Fresh frozen wash, week 30', source: 'Fresh frozen whole plant', wet: '4200 g', dry: 'UNKNOWN', stage: 'Pressed', packages: ['P1', 'P2'] },
  { id: 'H-012', name: 'Dried cure press, week 29', source: 'Dried and cured trim', wet: '3800 g', dry: '612 g', stage: 'Packaged', packages: ['P3', 'P6'] },
  { id: 'H-015', name: 'Ice water hash, week 30', source: 'Fresh frozen whole plant', wet: '3600 g', dry: 'UNKNOWN', stage: 'Drying', packages: ['P4'] },
  { id: 'H-016', name: 'Vape fill run, week 31', source: 'Dried and cured trim', wet: 'UNKNOWN', dry: 'UNKNOWN', stage: 'Curing', packages: ['P5'] },
];

const TRANSFERS: Transfer[] = [
  { id: 'T-1', manifest: '0000451892', dir: 'Outbound', party: 'Buffalo Green Dispensary', pkgs: ['P1', 'P6'], status: 'In transit', manifestQty: 620, receivedQty: null, date: '07-31' },
  { id: 'T-2', manifest: '0000451870', dir: 'Outbound', party: 'Elmwood Wellness', pkgs: ['P3'], status: 'Delivered', manifestQty: 200, receivedQty: 196, date: '07-30' },
  { id: 'T-3', manifest: 'UNKNOWN', dir: 'Outbound', party: 'Allentown Apothecary', pkgs: ['P5'], status: 'Draft', manifestQty: 90, receivedQty: null, date: '07-31' },
  { id: 'T-4', manifest: '0000450012', dir: 'Inbound', party: 'Keystone Labs', pkgs: ['P2'], status: 'Delivered', manifestQty: 480, receivedQty: 480, date: '07-29' },
];

const SALES: Sale[] = [
  { id: 'SL-1', date: '07-30', party: 'Elmwood Wellness', pkgs: ['P3'], qty: 196, uom: 'Each', recorded: true },
  { id: 'SL-2', date: '07-29', party: 'Buffalo Green Dispensary', pkgs: ['P6'], qty: 120, uom: 'Each', recorded: true },
];

const SKUS: Sku[] = [
  { sku: 'vape-05g-ff', item: '0.5g Vape, fresh frozen', cat: 'Vape Cartridge', unit: 'Each', pkgs: 1 },
  { sku: 'rosin-1g', item: '1g Rosin, dried cured', cat: 'Concentrate', unit: 'Grams', pkgs: 1 },
  { sku: 'gummies-10ct-100', item: 'Gummies 10ct 100mg', cat: 'Edible', unit: 'Each', pkgs: 1 },
  { sku: 'hash-iwh', item: 'Ice water hash, fresh frozen', cat: 'Concentrate', unit: 'Grams', pkgs: 1 },
  { sku: 'preroll-1g', item: 'Preroll 1g', cat: 'Preroll', unit: 'Each', pkgs: 1 },
  { sku: 'vape-05g-dc', item: '0.5g Vape, dried cured', cat: 'Vape Cartridge', unit: 'Each', pkgs: 1 },
];

const ALERTS: ProdAlert[] = [
  { id: 'A-1', kind: 'Discrepancy', subject: 'Manifest 0000451870', detail: 'Received 196 Each against 200 on the manifest. Variance 2.0 percent exceeds the 1.0 percent threshold.', sev: 'attention', status: 'open' },
  { id: 'A-2', kind: 'Test failure', subject: 'Package ...000151', detail: 'Ice water hash returned TestFailed. Held in Quarantine. Not releasable to transfer or sale.', sev: 'fail', status: 'open' },
  { id: 'A-3', kind: 'Manifest missing', subject: 'Transfer T-3', detail: 'Outbound transfer to Allentown Apothecary has no manifest. It cannot depart until a manifest is issued.', sev: 'attention', status: 'open' },
  { id: 'A-4', kind: 'Connection', subject: 'Metrc connection', detail: 'Two key authentication is not configured. Vendor and user API keys are pending. No data transmits until both are set.', sev: 'attention', status: 'open' },
  { id: 'A-5', kind: 'Test gate', subject: 'Package ...000152', detail: '0.5g Vape dried cured is NotSubmitted. Blocked from transfer and sale until TestPassed or RetestPassed.', sev: 'attention', status: 'open' },
];

export const Trace = {
  getConnection: () => ({ ...CONNECTION }),
  listPackages: () => PACKAGES.slice(),
  getPackage: (id: string) => PACKAGES.find((p) => p.id === id) || null,
  getPackageByTag: (tag: string) => PACKAGES.find((p) => p.tag === tag) || null,
  listHarvests: () => HARVESTS.slice(),
  getHarvest: (id: string) => HARVESTS.find((h) => h.id === id) || null,
  listTransfers: () => TRANSFERS.slice(),
  getTransfer: (id: string) => TRANSFERS.find((t) => t.id === id) || null,
  listSales: () => SALES.slice(),
  listSkus: () => SKUS.slice(),
  listAlerts: () => ALERTS.slice(),
  openAlertCount: () => ALERTS.filter((a) => a.status === 'open').length,
  releasable: (p: Pkg | string | null) => {
    const s = typeof p === 'string' ? p : p ? p.test : '';
    return RELEASABLE.indexOf(s) >= 0;
  },
  variance: (t: Transfer): number | null => {
    if (t.receivedQty == null || !t.manifestQty) return null;
    return Math.round((Math.abs(t.manifestQty - t.receivedQty) / t.manifestQty) * 1000) / 10;
  },
  overThreshold: (t: Transfer): boolean => {
    const v = Trace.variance(t);
    return v != null && v > THRESHOLD_PCT;
  },
  acknowledge: (id: string) => {
    const a = ALERTS.find((x) => x.id === id);
    if (a) a.status = 'acknowledged';
    return a || null;
  },
  createTransfer: (input: { manifest: string; party: string; pkgId: string }): { ok: boolean; reason?: string; transfer?: Transfer } => {
    const pkg = Trace.getPackage(input.pkgId);
    if (!pkg) return { ok: false, reason: 'Select a package.' };
    if (!input.manifest || !input.manifest.trim()) return { ok: false, reason: 'A manifest number is required before a transfer can depart.' };
    if (!Trace.releasable(pkg)) return { ok: false, reason: `Package ${pkg.tag} is ${pkg.test}. Only TestPassed or RetestPassed packages can move.` };
    const t: Transfer = { id: `T-${TRANSFERS.length + 1}`, manifest: input.manifest.trim(), dir: 'Outbound', party: input.party || 'UNKNOWN', pkgs: [pkg.id], status: 'In transit', manifestQty: pkg.qty, receivedQty: null, date: 'new' };
    TRANSFERS.unshift(t);
    return { ok: true, transfer: t };
  },
  traceFor: (tag: string) => {
    const pkg = Trace.getPackageByTag(tag);
    if (!pkg) return null;
    const harvest = Trace.getHarvest(pkg.harvest);
    const transfer = TRANSFERS.find((t) => t.pkgs.indexOf(pkg.id) >= 0 && t.dir === 'Outbound') || null;
    const sale = SALES.find((s) => s.pkgs.indexOf(pkg.id) >= 0) || null;
    return { pkg, harvest, transfer, sale };
  },
};
