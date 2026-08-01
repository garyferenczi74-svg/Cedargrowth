import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Reads the Editorial dataset (drafts, research) in the client shape. Gated.

export const runtime = 'nodejs';

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const [dr, rs] = await Promise.all([
    supabase.from('kelvin_drafts').select('*').order('id'),
    supabase.from('kelvin_research').select('*').order('id'),
  ]);

  const drafts = (dr.data || []).map((d) => ({ id: d.id, title: d.title, author: d.author, stage: d.stage, scan: d.scan, flag: d.flag, blocker: d.blocker, pubDate: d.pub_date }));
  const research = rs.data || [];
  return NextResponse.json({ drafts, research });
}
