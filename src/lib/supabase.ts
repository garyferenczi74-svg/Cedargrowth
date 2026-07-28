import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side client for the reservations insert. Uses the secret key so the
// insert runs with full privileges (bypassing RLS); this key is server only and
// must never reach the browser bundle. Returns null when env is not configured
// so the route can fail clearly instead of throwing at import.
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) return null;
  return createClient(url, secretKey, { auth: { persistSession: false } });
}
