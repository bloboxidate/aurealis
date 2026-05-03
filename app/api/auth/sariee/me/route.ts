import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  AUREALIS_CUSTOMER_EMAIL_COOKIE,
  AUREALIS_CUSTOMER_NAME_COOKIE,
  AUREALIS_SF_BEARER_COOKIE,
  SARIEE_SESSION_COOKIE,
} from '@/lib/sariee/auth-cookies';
import { withNoStore } from '@/lib/security/secure-api-headers';

export async function GET() {
  const c = await cookies();
  const session = c.get(SARIEE_SESSION_COOKIE)?.value ?? null;
  const bearer = c.get(AUREALIS_SF_BEARER_COOKIE)?.value ?? null;
  const email = c.get(AUREALIS_CUSTOMER_EMAIL_COOKIE)?.value ?? null;
  const name = c.get(AUREALIS_CUSTOMER_NAME_COOKIE)?.value ?? null;

  if (!session && !bearer && !email) {
    return NextResponse.json({ user: null }, { headers: withNoStore() });
  }

  return NextResponse.json(
    { user: { email, name } },
    { headers: withNoStore() }
  );
}
