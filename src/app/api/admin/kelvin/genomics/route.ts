import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Reads the kit lifecycle status only. Selects the operational columns
// explicitly, never a result, so the read cannot leak data even by accident.

export const runtime = 'nodejs';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const { data } = await supabase
    .from('kelvin_kits')
    .select('id, subject, status, consent, lab, ordered, result, delivery')
    .order('id');

  return NextResponse.json({ kits: data || [] });
}
