import { NextResponse } from 'next/server';
import { KELVIN_COOKIE, KELVIN_MAX_AGE, createSessionToken } from '@/lib/kelvinAuth';

// Accepts a password, compares it to the configured access password, and on a
// match sets the signed session cookie scoped to the console path. Every failure
// class returns the same neutral line so the endpoint enumerates nothing. Access
// is refused clearly when the env is not configured, so it fails closed.

export const runtime = 'nodejs';

const NEUTRAL = 'That did not resolve.';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: NEUTRAL }, { status: 400 });
  }
  const password =
    body && typeof (body as Record<string, unknown>).password === 'string'
      ? ((body as Record<string, unknown>).password as string)
      : '';

  const expected = process.env.KELVIN_ACCESS_PASSWORD;
  const secret = process.env.KELVIN_SESSION_SECRET;
  if (!expected || !secret) {
    return NextResponse.json({ error: 'Access is not configured.' }, { status: 503 });
  }
  if (!password || password !== expected) {
    return NextResponse.json({ error: NEUTRAL }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(KELVIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/admin/kelvin',
    maxAge: KELVIN_MAX_AGE,
  });
  return res;
}
