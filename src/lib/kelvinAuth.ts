// Signed session cookie for the KELVIN admin console. No external dependency.
// Uses Web Crypto (crypto.subtle), so the same code runs in the Edge middleware
// and in the Node route handler. The token is an HMAC signed payload carrying an
// issued at timestamp. Nothing sensitive is stored in it. The signing secret and
// the access password live in env only and never reach the browser bundle.

export const KELVIN_COOKIE = 'kelvin_session';
export const KELVIN_MAX_AGE = 28800; // eight hours in seconds

// The site admin allowlist. Access is restricted to these emails. Adding an
// email here makes it a site admin. Removing one revokes access on the next
// request even if a session cookie still exists, because the allowlist is
// checked on every read, not only at login.
export const KELVIN_ADMINS = ['gary@cedargrowthco.com'];

export function isAdmin(email: string | undefined | null): boolean {
  return !!email && KELVIN_ADMINS.indexOf(email.trim().toLowerCase()) >= 0;
}

const encoder = new TextEncoder();

function bytesToB64url(bytes: ArrayBuffer): string {
  let bin = '';
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i += 1) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(str: string): Uint8Array {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  s += '='.repeat(pad);
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return bytesToB64url(sig);
}

export async function createSessionToken(secret: string, email: string): Promise<string> {
  const payload = bytesToB64url(
    encoder.encode(JSON.stringify({ iat: Math.floor(Date.now() / 1000), email: email.trim().toLowerCase() })).buffer,
  );
  const sig = await sign(payload, secret);
  return `${payload}.${sig}`;
}

// Returns the admin email if the token is well signed, unexpired, and its email
// is still on the allowlist. Returns null otherwise. This is the single read
// path the middleware and the session route both use.
export async function readSession(
  token: string | undefined,
  secret: string | undefined,
  maxAgeSec: number = KELVIN_MAX_AGE,
): Promise<string | null> {
  if (!token || !secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = await sign(payload, secret);
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
    if (typeof data.iat !== 'number') return null;
    if (Math.floor(Date.now() / 1000) - data.iat > maxAgeSec) return null;
    if (!isAdmin(data.email)) return null;
    return String(data.email);
  } catch {
    return null;
  }
}
