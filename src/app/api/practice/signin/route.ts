import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRACTICE_AT_COOKIE, PRACTICE_RT_COOKIE } from '@/lib/practice/supabaseStore';

// Practice sign-in (CG Prompt 09G). Email and password against Supabase Auth. On
// success the session is stored in httpOnly cookies the server reads to build the
// RLS-scoped client. When MFA enforcement is turned on, this flow gains the TOTP
// challenge step; until then a password sign-in yields a usable session.

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Practice is not configured.' }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'That did not resolve.' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    return NextResponse.json({ error: 'Those credentials did not match.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set(PRACTICE_AT_COOKIE, data.session.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: data.session.expires_in ?? 3600,
  });
  res.cookies.set(PRACTICE_RT_COOKIE, data.session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
