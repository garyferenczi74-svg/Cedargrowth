import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Reads the Evidence dataset (batches, COAs, labs) in the client shape. Gated.

export const runtime = 'nodejs';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const [bt, co, lb] = await Promise.all([
    supabase.from('kelvin_batches').select('*').order('id', { ascending: false }),
    supabase.from('kelvin_coas').select('*').order('id'),
    supabase.from('kelvin_labs').select('*').order('name'),
  ]);

  const batches = (bt.data || []).map((b) => ({
    id: b.id, item: b.item, tag: b.tag, coa: b.coa_state, coaId: b.coa_id,
    publish: b.publish_state, pubDate: b.pub_date, lab: b.lab, terps: b.terps || [],
  }));
  const coas = (co.data || []).map((c) => ({
    id: c.id, lab: c.lab, batch: c.batch, state: c.state, panels: c.panels, potency: c.potency, date: c.date,
  }));
  const labs = (lb.data || []).map((l) => ({
    name: l.name, accreditation: l.accreditation, license: l.license, turnaround: l.turnaround, status: l.status,
  }));

  return NextResponse.json({ batches, coas, labs });
}
