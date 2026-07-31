import { NextResponse } from 'next/server';
import { KELVIN_COOKIE } from '@/lib/kelvinAuth';

// Clears the session cookie. The console posts here on sign out.

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(KELVIN_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
