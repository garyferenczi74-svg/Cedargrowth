import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { KELVIN_COOKIE, KELVIN_MAX_AGE, createSessionToken, isAdmin } from '@/lib/kelvinAuth';
import { hashCode } from '@/lib/kelvinPassword';

// First run. An allowlisted admin sets an access code once. If a code already
// exists the endpoint refuses, so it cannot be used to overwrite. On success it
// stores the hash and signs the admin in.

export const runtime = 'nodejs';

const NEUTRAL = 'That did not resolve.';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: NEUTRAL }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const email = (typeof b.email === 'string' ? b.email : '').trim().toLowerCase();
  const code = typeof b.code === 'string' ? b.code : '';

  const supabase = getSupabaseServerClient();
  const secret = process.env.KELVIN_SESSION_SECRET;
  if (!supabase || !secret) {
    return NextResponse.json({ error: 'Access is not configured.' }, { status: 503 });
  }
  if (!isAdmin(email)) {
    return NextResponse.json({ error: NEUTRAL }, { status: 401 });
  }
  if (code.length < 8) {
    return NextResponse.json({ error: 'Choose an access code of at least 8 characters.' }, { status: 400 });
  }

  const existing = await supabase.from('kelvin_admin_credentials').select('email').eq('email', email).maybeSingle();
  if (existing.data) {
    return NextResponse.json({ error: 'An access code is already set. Sign in instead.' }, { status: 409 });
  }

  const password_hash = await hashCode(code);
  const insert = await supabase.from('kelvin_admin_credentials').insert({ email, password_hash });
  if (insert.error) {
    return NextResponse.json({ error: 'Could not save the access code.' }, { status: 500 });
  }

  const token = await createSessionToken(secret, email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(KELVIN_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: KELVIN_MAX_AGE });
  return res;
}
