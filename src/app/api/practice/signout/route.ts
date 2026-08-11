import { NextResponse } from 'next/server';
import { PRACTICE_AT_COOKIE, PRACTICE_RT_COOKIE } from '@/lib/practice/supabaseStore';

// Practice sign-out. Clears the session cookies.
export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PRACTICE_AT_COOKIE, '', { path: '/', maxAge: 0 });
  res.cookies.set(PRACTICE_RT_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
