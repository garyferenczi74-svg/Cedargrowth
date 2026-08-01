import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Resolves a review item and writes the decision to the feed, both persisted.

export const runtime = 'nodejs';

function hhmm(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export async function POST(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;
  const id = typeof b.id === 'string' ? b.id : '';
  const decision = typeof b.decision === 'string' ? b.decision : '';
  if (!id || ['approved', 'rejected', 'sentback'].indexOf(decision) < 0) return NextResponse.json({ ok: false }, { status: 400 });

  const { data: item } = await supabase.from('kelvin_review').update({ status: decision }).eq('id', id).select('title').maybeSingle();
  if (!item) return NextResponse.json({ ok: false }, { status: 404 });

  const verb = decision === 'approved' ? 'approved' : decision === 'rejected' ? 'rejected' : 'sent back';
  const time = hhmm();
  const eventRow = { agent: 'MERIDIAN', time, type: 'DECISION', summary: `Owner ${verb}: ${item.title}`, sub: `Review item ${id} resolved. Queue count updated.`, wing: null };
  const { data: ev } = await supabase.from('kelvin_events').insert(eventRow).select('id').maybeSingle();

  const { count } = await supabase.from('kelvin_review').select('id', { count: 'exact', head: true }).eq('status', 'open');

  return NextResponse.json({ ok: true, title: item.title, remaining: count || 0, event: { id: ev ? Number(ev.id) : Date.now(), agent: 'MERIDIAN', time, type: 'DECISION', summary: `Owner ${verb}: ${item.title}`, sub: `Review item ${id} resolved. Queue count updated.` } });
}
