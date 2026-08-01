import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Acknowledges a production alert, persisted.

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

  const { data, error } = await supabase.from('kelvin_prod_alerts').update({ status: 'acknowledged' }).eq('id', id).select('id, kind, subject').maybeSingle();
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, alert: data });
}
