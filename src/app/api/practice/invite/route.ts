import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { practiceSessionToken } from '@/lib/practice/supabaseStore';

// Invite a staff member (CG Prompt onboarding). A manager or owner names an email
// and a role. The system creates the auth user in an invited state, the person
// record, and the role grant, and returns a one-time link the invitee follows to
// set their own password. No public sign-up; accounts are provisioned by an
// admin, and the invitee never learns a temporary password.

export const runtime = 'nodejs';

const VALID_ROLES = ['EMPLOYEE', 'ASSESSOR', 'OPERATIONS_MANAGER', 'OWNER'];

// Resolve the caller and confirm they are a manager or owner, from the session.
async function callerRoles(): Promise<string[] | null> {
  const token = practiceSessionToken();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!token || !url || !pub || !secret) return null;
  const uc = createClient(url, pub, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data } = await uc.auth.getUser();
  const uid = data.user?.id;
  if (!uid) return null;
  const svc = createClient(url, secret, { auth: { persistSession: false } });
  const { data: person } = await svc.from('practice_persons').select('id').eq('auth_user_id', uid).maybeSingle();
  if (!person) return null;
  const { data: roles } = await svc.from('practice_person_current_roles').select('role').eq('person_id', person.id);
  return (roles ?? []).map((r) => r.role);
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return NextResponse.json({ error: 'Practice is not configured.' }, { status: 503 });

  const roles = await callerRoles();
  if (!roles || !(roles.includes('OWNER') || roles.includes('OPERATIONS_MANAGER'))) {
    return NextResponse.json({ error: 'Only a manager or owner can invite.' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'That did not resolve.' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const role = typeof body.role === 'string' ? body.role : '';
  if (!email || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'An email and a valid role are required.' }, { status: 400 });
  }

  const svc = createClient(url, secret, { auth: { persistSession: false } });
  const origin = new URL(request.url).origin;
  const { data: link, error } = await svc.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo: `${origin}/practice/set-password` },
  });
  if (error || !link.user) {
    const msg = /already been registered|exists/i.test(error?.message ?? '') ? 'That email already has an account.' : 'Could not create the invite.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { data: person, error: pErr } = await svc
    .from('practice_persons')
    .insert({ auth_user_id: link.user.id, email })
    .select('id')
    .single();
  if (pErr || !person) {
    return NextResponse.json({ error: 'The invite was created but the person record failed. Remove the auth user and retry.' }, { status: 500 });
  }
  await svc.from('practice_person_role_events').insert({ person_id: person.id, role, granted: true, effective_at: new Date().toISOString() });

  return NextResponse.json({ ok: true, email, role, link: link.properties?.action_link ?? null });
}
