// Production wing types and pure helpers. Data now lives in Supabase and is
// fetched through /api/admin/kelvin/production; this module holds only the shapes,
// the connection constant, and the derived gate helpers (releasable, variance,
// discrepancy) that both the client and the server routes reason with.

export type Pkg = { id: string; tag: string; item: string; cat: string; qty: number; uom: string; test: string; loc: string; status: string; harvest: string; lab: string; potency: string };
export type Harvest = { id: string; name: string; source: string; wet: string; dry: string; stage: string; packages: string[] };
export type Transfer = { id: string; manifest: string; dir: string; party: string; pkgs: string[]; status: string; manifestQty: number; receivedQty: number | null; date: string };
export type Sale = { id: string; date: string; party: string; pkgs: string[]; qty: number; uom: string; recorded: boolean };
export type Sku = { sku: string; item: string; cat: string; unit: string; pkgs: number };
export type ProdAlert = { id: string; kind: string; subject: string; detail: string; sev: 'attention' | 'fail'; status: string };
export type Connection = { facility: string; licenseType: string; license: string; vendorKey: string; userKey: string; state: string; lastSync: string };

export type ProdData = {
  connection: Connection;
  packages: Pkg[];
  harvests: Harvest[];
  transfers: Transfer[];
  sales: Sale[];
  skus: Sku[];
  alerts: ProdAlert[];
};

export const THRESHOLD_PCT = 1.0;
const RELEASABLE = ['TestPassed', 'RetestPassed'];

// Metrc connection config. Two key auth is unset in the prototype, so it renders
// UNKNOWN. It is config, not row data, so it stays a constant.
export const CONNECTION: Connection = {
  facility: 'CedarGrowth Processor, Buffalo',
  licenseType: 'Processor',
  license: 'OCM-PROC-UNKNOWN',
  vendorKey: 'UNKNOWN',
  userKey: 'UNKNOWN',
  state: 'Keys pending',
  lastSync: 'UNKNOWN',
};

export function releasable(pkgOrTest: Pkg | string | null): boolean {
  const s = typeof pkgOrTest === 'string' ? pkgOrTest : pkgOrTest ? pkgOrTest.test : '';
  return RELEASABLE.indexOf(s) >= 0;
}
export function variance(t: Transfer): number | null {
  if (t.receivedQty == null || !t.manifestQty) return null;
  return Math.round((Math.abs(t.manifestQty - t.receivedQty) / t.manifestQty) * 1000) / 10;
}
export function overThreshold(t: Transfer): boolean {
  const v = variance(t);
  return v != null && v > THRESHOLD_PCT;
}
export function traceFor(data: ProdData, tag: string) {
  const pkg = data.packages.find((p) => p.tag === tag);
  if (!pkg) return null;
  const harvest = data.harvests.find((h) => h.id === pkg.harvest) || null;
  const transfer = data.transfers.find((t) => t.pkgs.indexOf(pkg.id) >= 0 && t.dir === 'Outbound') || null;
  const sale = data.sales.find((s) => s.pkgs.indexOf(pkg.id) >= 0) || null;
  return { pkg, harvest, transfer, sale };
}
