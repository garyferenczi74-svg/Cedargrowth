import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { currentAdmin } from '@/lib/kelvinSession';

// Creates an outbound transfer. The manifest requirement and the test gate are
// enforced here, against the live package row, so the rules hold on real data.

export const runtime = 'nodejs';

const RELEASABLE = ['TestPassed', 'RetestPassed'];

export async function POST(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false, reason: 'No session' }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'Not configured' }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, reason: 'Invalid request' }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;
  const manifest = (typeof b.manifest === 'string' ? b.manifest : '').trim();
  const party = typeof b.party === 'string' ? b.party : '';
  const pkgId = typeof b.pkgId === 'string' ? b.pkgId : '';

  const { data: pkg } = await supabase.from('kelvin_packages').select('*').eq('id', pkgId).maybeSingle();
  if (!pkg) return NextResponse.json({ ok: false, reason: 'Select a package.' });
  if (!manifest) return NextResponse.json({ ok: false, reason: 'A manifest number is required before a transfer can depart.' });
  if (RELEASABLE.indexOf(pkg.test) < 0) {
    return NextResponse.json({ ok: false, reason: `Package ${pkg.tag} is ${pkg.test}. Only TestPassed or RetestPassed packages can move.` });
  }

  const id = 'T-' + Date.now().toString(36);
  const row = { id, manifest, dir: 'Outbound', party: party || 'UNKNOWN', pkgs: [pkg.id], status: 'In transit', manifest_qty: pkg.qty, received_qty: null, date: 'new' };
  const { error } = await supabase.from('kelvin_transfers').insert(row);
  if (error) return NextResponse.json({ ok: false, reason: 'Could not create the transfer.' }, { status: 500 });

  return NextResponse.json({ ok: true, transfer: { id, manifest, party: row.party } });
}
