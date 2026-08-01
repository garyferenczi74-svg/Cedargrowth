import { cookies } from 'next/headers';
import { KELVIN_COOKIE, readSession } from '@/lib/kelvinAuth';

// Server helper for the console data routes. Returns the signed in admin email
// or null. Data routes call this and refuse when it is null, so operational data
// is reachable only by an authenticated admin. Node runtime only (uses cookies).

export async function currentAdmin(): Promise<string | null> {
  const token = cookies().get(KELVIN_COOKIE)?.value;
  return readSession(token, process.env.KELVIN_SESSION_SECRET);
}
