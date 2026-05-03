import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sarieeFetch } from '@/lib/sariee/client';
import {
  AUREALIS_CUSTOMER_EMAIL_COOKIE,
  AUREALIS_CUSTOMER_NAME_COOKIE,
  AUREALIS_SF_BEARER_COOKIE,
  SARIEE_SESSION_COOKIE,
} from '@/lib/sariee/auth-cookies';
import { deepFindEmail, deepFindName, parseJsonUnknown } from '@/lib/sariee/json-helpers';
import { withNoStore } from '@/lib/security/secure-api-headers';

export async function GET() {
  const c = await cookies();
  const session = c.get(SARIEE_SESSION_COOKIE)?.value;
  const bearer = c.get(AUREALIS_SF_BEARER_COOKIE)?.value;
  const cachedEmail = c.get(AUREALIS_CUSTOMER_EMAIL_COOKIE)?.value ?? null;
  const cachedName = c.get(AUREALIS_CUSTOMER_NAME_COOKIE)?.value ?? null;

  if (!session && !bearer && !cachedEmail) {
    return NextResponse.json({ user: null }, { headers: withNoStore() });
  }

  const res = await sarieeFetch('/api/frontend/cart/state', {
    method: 'GET',
    sarieeSession: session ?? null,
    bearerOverride: bearer ?? null,
    omitServerBearer: !session && !!bearer,
  });
  const text = await res.text();
  const json = parseJsonUnknown(text);
  const email = deepFindEmail(json) ?? cachedEmail;
  const name = deepFindName(json) ?? cachedName;

  return NextResponse.json(
    { user: { email: email ?? cachedEmail, name: name ?? cachedName } },
    { headers: withNoStore() }
  );
}
