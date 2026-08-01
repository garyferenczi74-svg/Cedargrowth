import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Reads the persisted Command data: the feed events (newest first), the review
// queue, and the tuning proposals. Queue and canon are static reference and stay
// client side. Gated.

export const runtime = 'nodejs';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const [ev, rv, tn] = await Promise.all([
    supabase.from('kelvin_events').select('*').order('id', { ascending: false }),
    supabase.from('kelvin_review').select('*').order('id'),
    supabase.from('kelvin_tuning').select('*').order('id'),
  ]);

  const events = (ev.data || []).map((e) => ({ id: Number(e.id), agent: e.agent, time: e.time, type: e.type, summary: e.summary, sub: e.sub, wing: e.wing || undefined }));
  const review = (rv.data || []).map((r) => ({ id: r.id, from: r.from_line, title: r.title, body: r.body, status: r.status, note: r.note || undefined }));
  const tuning = (tn.data || []).map((t) => ({ id: t.id, from: t.from_line, title: t.title, detail: t.detail, affects: t.affects, status: t.status, note: t.note || undefined }));

  return NextResponse.json({ events, review, tuning });
}
