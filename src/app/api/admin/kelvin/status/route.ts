import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { KELVIN_ADMINS } from '@/lib/kelvinAuth';

// Tells the login page whether an access code has been set yet, so it can show
// the first run "create your access code" screen or the normal sign in screen.
// Reveals only a boolean, never anything sensitive.

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getSupabaseServerClient();
  const secret = process.env.KELVIN_SESSION_SECRET;
  if (!supabase || !secret) {
    return NextResponse.json({ configured: false, setup: false });
  }
  const { data, error } = await supabase
    .from('kelvin_admin_credentials')
    .select('email')
    .eq('email', KELVIN_ADMINS[0])
    .maybeSingle();
  if (error) {
    return NextResponse.json({ configured: true, setup: false });
  }
  return NextResponse.json({ configured: true, setup: !!data });
}
