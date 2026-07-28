import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side client for the reservations insert. Returns null when env is
// not configured so the route can fail clearly instead of throwing at import.
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}
