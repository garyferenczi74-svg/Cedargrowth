import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Editorial mutations. The clearance gate (a flagged dictionary scan is a hard
// block) and the stage chain are enforced here. All gated.

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false, reason: 'No session' }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'Not configured' }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;
  const op = typeof b.op === 'string' ? b.op : '';
  const id = typeof b.id === 'string' ? b.id : '';
  const date = typeof b.date === 'string' ? b.date : '';

  const getDraft = async () => (await supabase.from('kelvin_drafts').select('*').eq('id', id).maybeSingle()).data;

  if (op === 'clear') {
    const d = await getDraft();
    if (!d) return NextResponse.json({ ok: false, reason: 'Draft not found.' });
    if (d.stage !== 'In clearance') return NextResponse.json({ ok: false, reason: `Draft ${id} is not in clearance.` });
    if (d.scan === 'flagged') return NextResponse.json({ ok: false, reason: `Draft ${id} has a dictionary scan hit. A single banned term is a hard block. It cannot clear until the copy is fixed.` });
    await supabase.from('kelvin_drafts').update({ stage: 'Cleared' }).eq('id', id);
    return NextResponse.json({ ok: true, title: d.title });
  }
  if (op === 'sendback') {
    await supabase.from('kelvin_drafts').update({ stage: 'Draft' }).eq('id', id);
    return NextResponse.json({ ok: true });
  }
  if (op === 'approve') {
    const d = await getDraft();
    if (!d) return NextResponse.json({ ok: false, reason: 'Draft not found.' });
    if (d.stage !== 'Cleared') return NextResponse.json({ ok: false, reason: `Draft ${id} is ${d.stage}. Only a cleared draft can be approved.` });
    await supabase.from('kelvin_drafts').update({ stage: 'Approved' }).eq('id', id);
    return NextResponse.json({ ok: true, title: d.title });
  }
  if (op === 'schedule') {
    const d = await getDraft();
    if (!d) return NextResponse.json({ ok: false, reason: 'Draft not found.' });
    if (d.stage !== 'Approved') return NextResponse.json({ ok: false, reason: `Draft ${id} is ${d.stage}. Only an approved draft can be scheduled.` });
    const pd = date || '08-05';
    await supabase.from('kelvin_drafts').update({ stage: 'Scheduled', pub_date: pd }).eq('id', id);
    return NextResponse.json({ ok: true, title: d.title, pubDate: pd });
  }
  if (op === 'publish') {
    const d = await getDraft();
    if (!d) return NextResponse.json({ ok: false, reason: 'Draft not found.' });
    if (d.stage !== 'Scheduled') return NextResponse.json({ ok: false, reason: `Draft ${id} is ${d.stage}. Only a scheduled draft can be published.` });
    await supabase.from('kelvin_drafts').update({ stage: 'Published' }).eq('id', id);
    return NextResponse.json({ ok: true, title: d.title });
  }
  if (op === 'promote') {
    const { data: r } = await supabase.from('kelvin_research').select('*').eq('id', id).maybeSingle();
    if (!r) return NextResponse.json({ ok: false, reason: 'Research not found.' });
    await supabase.from('kelvin_research').update({ status: 'In draft' }).eq('id', id);
    const { count } = await supabase.from('kelvin_drafts').select('id', { count: 'exact', head: true });
    const nid = 'D-' + String((count || 0) + 1).padStart(2, '0');
    const nd = { id: nid, title: r.topic, author: 'APERTURE', stage: 'Draft', scan: 'clean', flag: '', blocker: `Promoted from research ${id}.`, pub_date: 'UNKNOWN' };
    await supabase.from('kelvin_drafts').insert(nd);
    return NextResponse.json({ ok: true, draft: { id: nid, title: r.topic } });
  }

  return NextResponse.json({ ok: false, reason: 'Unknown operation.' }, { status: 400 });
}
