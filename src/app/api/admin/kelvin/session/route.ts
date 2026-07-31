import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { KELVIN_COOKIE, readSession } from '@/lib/kelvinAuth';

// Returns the signed in admin email for the console header. Reads the same
// signed cookie the middleware reads, so it reflects the true session.

export const runtime = 'nodejs';

export async function GET() {
  const token = cookies().get(KELVIN_COOKIE)?.value;
  const email = await readSession(token, process.env.KELVIN_SESSION_SECRET);
  if (!email) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }
  return NextResponse.json({ email });
}
