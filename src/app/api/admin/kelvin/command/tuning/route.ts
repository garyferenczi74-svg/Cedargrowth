import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Applies, rolls back, or rejects a tuning proposal, persisted.

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;
  const id = typeof b.id === 'string' ? b.id : '';
  const op = typeof b.op === 'string' ? b.op : '';
  const note = typeof b.note === 'string' ? b.note : '';

  if (op === 'apply') await supabase.from('kelvin_tuning').update({ status: 'applied' }).eq('id', id);
  else if (op === 'rollback') await supabase.from('kelvin_tuning').update({ status: 'proposed' }).eq('id', id);
  else if (op === 'reject') await supabase.from('kelvin_tuning').update({ status: 'rejected', note }).eq('id', id);
  else return NextResponse.json({ ok: false }, { status: 400 });

  return NextResponse.json({ ok: true });
}
