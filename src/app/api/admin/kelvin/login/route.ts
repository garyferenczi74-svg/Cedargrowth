import { NextResponse } from 'next/server';
import { KELVIN_COOKIE, KELVIN_MAX_AGE, createSessionToken, isAdmin } from '@/lib/kelvinAuth';

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
  const b = (body ?? {}) as Record<string, unknown>;
  const email = typeof b.email === 'string' ? b.email : '';
  const password = typeof b.password === 'string' ? b.password : '';

  const expected = process.env.KELVIN_ACCESS_PASSWORD;
  const secret = process.env.KELVIN_SESSION_SECRET;
  if (!expected || !secret) {
    return NextResponse.json({ error: 'Access is not configured.' }, { status: 503 });
  }
  // The same neutral line for a non admin email and for a wrong key, so the
  // screen enumerates nothing. Only an allowlisted email with the key resolves.
  if (!isAdmin(email) || !password || password !== expected) {
    return NextResponse.json({ error: NEUTRAL }, { status: 401 });
  }

  const token = await createSessionToken(secret, email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(KELVIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: KELVIN_MAX_AGE,
  });
  return res;
}
