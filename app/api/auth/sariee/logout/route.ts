import { NextResponse } from 'next/server';
import {
  AUREALIS_CUSTOMER_EMAIL_COOKIE,
  AUREALIS_CUSTOMER_NAME_COOKIE,
  AUREALIS_SF_BEARER_COOKIE,
  SARIEE_SESSION_COOKIE,
} from '@/lib/sariee/auth-cookies';
import { withNoStore } from '@/lib/security/secure-api-headers';

const clear = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 0,
};

export async function POST() {
  const res = NextResponse.json({ ok: true }, { headers: withNoStore() });
  res.cookies.set(SARIEE_SESSION_COOKIE, '', clear);
  res.cookies.set(AUREALIS_SF_BEARER_COOKIE, '', clear);
  res.cookies.set(AUREALIS_CUSTOMER_EMAIL_COOKIE, '', clear);
  res.cookies.set(AUREALIS_CUSTOMER_NAME_COOKIE, '', clear);
  return res;
}
