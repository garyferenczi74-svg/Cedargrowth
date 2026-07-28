import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import {
  sendReservationAlert,
  sendCustomerConfirmation,
  type ReservationEmailData,
  type ReservationItem,
} from '@/lib/email';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON');
  }
  const b = (body ?? {}) as Record<string, unknown>;

  // Honeypot. Real users never fill this hidden field. Fake success, no save.
  if (typeof b.company === 'string' && b.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  const location = typeof b.location === 'string' ? b.location.trim() : '';
  const note = typeof b.note === 'string' ? b.note.trim() : '';
  const rawItems = Array.isArray(b.items) ? b.items : null;

  if (!name || name.length > 200) return badRequest('Name is required');
  if (!email || !EMAIL_RE.test(email)) return badRequest('A valid email is required');
  if (!location || location.length > 200) return badRequest('Location is required');
  if (note.length > 2000) return badRequest('Note is too long');
  if (!rawItems || rawItems.length === 0 || rawItems.length > 50) {
    return badRequest('At least one reserved item is required');
  }

  const items: ReservationItem[] = [];
  for (const raw of rawItems) {
    const it = (raw ?? {}) as Record<string, unknown>;
    if (
      typeof it.slug !== 'string' ||
      typeof it.name !== 'string' ||
      typeof it.spec !== 'string' ||
      !Number.isInteger(it.qty) ||
      (it.qty as number) < 1 ||
      it.slug.length > 200 ||
      it.name.length > 200 ||
      it.spec.length > 200 ||
      (it.qty as number) > 999
    ) {
      return badRequest('Invalid item in reservation');
    }
    items.push({ slug: it.slug, name: it.name, spec: it.spec, qty: it.qty as number });
  }
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const { error } = await supabase.from('reservations').insert({
    name,
    email,
    location,
    note: note || null,
    items,
    item_count: itemCount,
  });
  if (error) {
    console.error('Reservation insert failed', error);
    return NextResponse.json({ error: 'Could not save reservation' }, { status: 500 });
  }

  const emailData: ReservationEmailData = {
    name,
    email,
    location,
    note,
    items,
    itemCount,
  };
  await sendReservationAlert(emailData);
  await sendCustomerConfirmation(emailData);

  return NextResponse.json({ ok: true });
}
