// Access code hashing for the KELVIN admin, PBKDF2 over Web Crypto so it runs in
// the Node route handlers with no external dependency. The stored form is
// pbkdf2$iterations$saltBase64$hashBase64. The plain code is never stored.

const enc = new TextEncoder();
const ITERATIONS = 120000;

function toB64(buf: ArrayBuffer): string {
  let bin = '';
  const arr = new Uint8Array(buf);
  for (let i = 0; i < arr.length; i += 1) bin += String.fromCharCode(arr[i]);
  return btoa(bin);
}
function fromB64(s: string): Uint8Array {
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function derive(code: string, salt: Uint8Array, iterations: number): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256);
  return toB64(bits);
}

export async function hashCode(code: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(code, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toB64(salt.buffer)}$${hash}`;
}

export async function verifyCode(code: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1], 10);
  if (!iterations) return false;
  const salt = fromB64(parts[2]);
  const expected = parts[3];
  const actual = await derive(code, salt, iterations);
  return actual === expected;
}
