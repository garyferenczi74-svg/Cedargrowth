import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { sendSignupAlert, sendSignupConfirmation, type SignupEmailData } from '@/lib/email';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTENTS = ['newsletter', 'dna_kit', 'find_dispensary', 'wholesale'] as const;
type Intent = (typeof INTENTS)[number];

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function clean(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
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

  const intent = typeof b.intent === 'string' ? b.intent : '';
  if (!INTENTS.includes(intent as Intent)) {
    return badRequest('A valid intent is required');
  }

  const email = typeof b.email === 'string' ? b.email.trim() : '';
  if (!email || !EMAIL_RE.test(email)) {
    return badRequest('A valid email is required');
  }

  if (typeof b.name === 'string' && b.name.trim().length > 200) {
    return badRequest('Name is too long');
  }
  if (typeof b.location === 'string' && b.location.trim().length > 200) {
    return badRequest('Location is too long');
  }
  if (typeof b.business === 'string' && b.business.trim().length > 200) {
    return badRequest('Business is too long');
  }
  if (typeof b.note === 'string' && b.note.trim().length > 2000) {
    return badRequest('Note is too long');
  }

  const name = clean(b.name, 200);
  const location = clean(b.location, 200);
  const business = clean(b.business, 200);
  const note = clean(b.note, 2000);

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const { error } = await supabase.from('signups').insert({
    intent,
    email,
    name,
    location,
    business,
    note,
    source: intent,
  });
  if (error) {
    console.error('Signup insert failed', error);
    return NextResponse.json({ error: 'Could not save signup' }, { status: 500 });
  }

  const emailData: SignupEmailData = {
    intent: intent as Intent,
    email,
    name,
    location,
    business,
    note,
  };
  await sendSignupAlert(emailData);
  await sendSignupConfirmation(emailData);

  return NextResponse.json({ ok: true });
}
