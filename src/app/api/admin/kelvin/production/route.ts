import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';
import { CONNECTION } from '@/app/admin/kelvin/wings/production';

// Reads the whole Production dataset for the wing, in the shape the client
// renders. Gated: only an authenticated admin gets it.

export const runtime = 'nodejs';

const num = (v: unknown): number => (v == null ? 0 : Number(v));

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const [pk, hv, tx, sl, sk, al] = await Promise.all([
    supabase.from('kelvin_packages').select('*').order('id'),
    supabase.from('kelvin_harvests').select('*').order('id'),
    supabase.from('kelvin_transfers').select('*').order('created_at').order('id'),
    supabase.from('kelvin_sales').select('*').order('id'),
    supabase.from('kelvin_skus').select('*').order('sku'),
    supabase.from('kelvin_prod_alerts').select('*').order('id'),
  ]);

  const packages = (pk.data || []).map((p) => ({
    id: p.id, tag: p.tag, item: p.item, cat: p.cat, qty: num(p.qty), uom: p.uom,
    test: p.test, loc: p.loc, status: p.status, harvest: p.harvest, lab: p.lab, potency: p.potency,
  }));
  const harvests = (hv.data || []).map((h) => ({
    id: h.id, name: h.name, source: h.source, wet: h.wet, dry: h.dry, stage: h.stage,
    packages: packages.filter((p) => p.harvest === h.id).map((p) => p.id),
  }));
  const transfers = (tx.data || []).map((t) => ({
    id: t.id, manifest: t.manifest, dir: t.dir, party: t.party, pkgs: t.pkgs || [],
    status: t.status, manifestQty: num(t.manifest_qty), receivedQty: t.received_qty == null ? null : num(t.received_qty), date: t.date,
  }));
  const sales = (sl.data || []).map((s) => ({
    id: s.id, date: s.date, party: s.party, pkgs: s.pkgs || [], qty: num(s.qty), uom: s.uom, recorded: !!s.recorded,
  }));
  const skus = (sk.data || []).map((s) => ({ sku: s.sku, item: s.item, cat: s.cat, unit: s.unit, pkgs: num(s.pkgs) }));
  const alerts = (al.data || []).map((a) => ({ id: a.id, kind: a.kind, subject: a.subject, detail: a.detail, sev: a.sev, status: a.status }));

  return NextResponse.json({ connection: CONNECTION, packages, harvests, transfers, sales, skus, alerts });
}
