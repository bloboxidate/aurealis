import { NextResponse } from 'next/server';
import { sarieeFetch } from '@/lib/sariee/client';
import {
  AUREALIS_CUSTOMER_EMAIL_COOKIE,
  AUREALIS_CUSTOMER_NAME_COOKIE,
  AUREALIS_SF_BEARER_COOKIE,
  SARIEE_SESSION_COOKIE,
} from '@/lib/sariee/auth-cookies';
import {
  deepFindEmail,
  deepFindName,
  parseBearerLikeFromJson,
  parseJsonUnknown,
  sarieeUpstreamMessage,
} from '@/lib/sariee/json-helpers';
import { parseSarieeSessionFromHeaders } from '@/lib/sariee/set-cookie-parse';
import { withNoStore } from '@/lib/security/secure-api-headers';

const WEEK = 60 * 60 * 24 * 7;

function sessionCookieOpts() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: WEEK,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400, headers: withNoStore() });
  }
  const r = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  const email = typeof r?.email === 'string' ? r.email.trim() : '';
  const password = typeof r?.password === 'string' ? r.password : '';
  const name = typeof r?.name === 'string' ? r.name.trim() : '';
  if (!email || !password) {
    return NextResponse.json({ error: 'email_and_password_required' }, { status: 400, headers: withNoStore() });
  }

  // Try `name` first (standard), fall back to `full_name` if the field is rejected.
  const attempts = [
    { email, password, name: name || undefined },
    { email, password, full_name: name || undefined },
  ];
  let upstream: Response | null = null;
  let text = '';
  for (const json of attempts) {
    const u = await sarieeFetch('/api/frontend/register', { method: 'POST', json });
    text = await u.text();
    upstream = u;
    if (u.ok) break;
    if (u.status !== 422 && u.status !== 400 && u.status !== 406) break;
  }
  const json = parseJsonUnknown(text);
  if (!upstream?.ok) {
    return NextResponse.json(
      { error: sarieeUpstreamMessage(json, 'Registration failed') },
      { status: upstream?.status ?? 502, headers: withNoStore() }
    );
  }
  const opts = sessionCookieOpts();
  const session = parseSarieeSessionFromHeaders(upstream.headers);
  const bearer = parseBearerLikeFromJson(json);
  // If Sariee returned no session or bearer token the account was created but is not
  // yet active (email confirmation required).
  const needsEmailConfirm = !session && !bearer;
  const res = NextResponse.json({ ok: true, needsEmailConfirm }, { headers: withNoStore() });
  if (session) {
    res.cookies.set(SARIEE_SESSION_COOKIE, session, opts);
  } else if (bearer) {
    res.cookies.set(AUREALIS_SF_BEARER_COOKIE, bearer, opts);
  }
  const em = deepFindEmail(json) ?? email;
  const display = deepFindName(json) ?? (name || null);
  if (em) res.cookies.set(AUREALIS_CUSTOMER_EMAIL_COOKIE, em, opts);
  if (display) res.cookies.set(AUREALIS_CUSTOMER_NAME_COOKIE, display, opts);
  return res;
}
