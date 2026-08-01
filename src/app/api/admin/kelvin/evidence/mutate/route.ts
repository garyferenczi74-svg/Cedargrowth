import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';
import { PANELS_PASS } from '@/app/admin/kelvin/wings/evidence';

// Evidence mutations. The publish gate is enforced here: a batch publishes only
// when its COA state is Passed. Adjudicate resolves an ingested COA from its
// panels and sets the batch state the gate reads. All gated.

export const runtime = 'nodejs';

function mmdd(): string {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function POST(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false, reason: 'No session' }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'Not configured' }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, reason: 'Invalid request' }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;
  const op = typeof b.op === 'string' ? b.op : '';
  const id = typeof b.id === 'string' ? b.id : '';
  const batchId = typeof b.batchId === 'string' ? b.batchId : '';

  if (op === 'publish') {
    const { data: bt } = await supabase.from('kelvin_batches').select('*').eq('id', id).maybeSingle();
    if (!bt) return NextResponse.json({ ok: false, reason: 'Batch not found.' });
    if (bt.coa_state !== 'Passed') return NextResponse.json({ ok: false, reason: `Batch ${id} is ${bt.coa_state}. A COA must be ingested and Passed before it can publish to transparency.` });
    if (bt.publish_state === 'Published') return NextResponse.json({ ok: false, reason: `Batch ${id} is already published.` });
    await supabase.from('kelvin_batches').update({ publish_state: 'Published', pub_date: mmdd() }).eq('id', id);
    return NextResponse.json({ ok: true, batch: { id } });
  }

  if (op === 'unpublish') {
    await supabase.from('kelvin_batches').update({ publish_state: 'Unpublished', pub_date: 'UNKNOWN' }).eq('id', id).eq('publish_state', 'Published');
    return NextResponse.json({ ok: true });
  }

  if (op === 'adjudicate') {
    const { data: coa } = await supabase.from('kelvin_coas').select('*').eq('id', id).maybeSingle();
    if (!coa || coa.state !== 'Ingested') return NextResponse.json({ ok: false, reason: 'Not ingested.' });
    const panels = (coa.panels || {}) as Record<string, string>;
    const fail = Object.keys(panels).some((k) => panels[k] === 'Fail');
    const state = fail ? 'Failed' : 'Passed';
    await supabase.from('kelvin_coas').update({ state }).eq('id', id);
    if (coa.batch && coa.batch !== 'UNKNOWN') await supabase.from('kelvin_batches').update({ coa_state: state }).eq('id', coa.batch);
    return NextResponse.json({ ok: true, coa: id, state });
  }

  if (op === 'match') {
    if (!batchId) return NextResponse.json({ ok: false, reason: 'No open batch to match.' });
    await supabase.from('kelvin_coas').update({ batch: batchId, state: 'Ingested', panels: PANELS_PASS }).eq('id', id);
    await supabase.from('kelvin_batches').update({ coa_id: id, coa_state: 'Ingested' }).eq('id', batchId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, reason: 'Unknown operation.' }, { status: 400 });
}
