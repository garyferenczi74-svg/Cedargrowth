import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Advances an ordered kit to Shipped. Fulfillment logistics only, no genetic
// data is read or written. Gated.

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const id = typeof (body as Record<string, unknown>)?.id === 'string' ? ((body as Record<string, unknown>).id as string) : '';
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  const { data } = await supabase.from('kelvin_kits').update({ status: 'Shipped' }).eq('id', id).eq('status', 'Ordered').select('id').maybeSingle();
  return NextResponse.json({ ok: true, shipped: !!data });
}
