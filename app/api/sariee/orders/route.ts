import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSarieeOrders } from '@/lib/sariee/cart';
import { withNoStore } from '@/lib/security/secure-api-headers';
import { SARIEE_SESSION_COOKIE, AUREALIS_SF_BEARER_COOKIE } from '@/lib/sariee/auth-cookies';

export const dynamic = 'force-dynamic';

export async function GET() {
  const h = { headers: withNoStore() };

  const c = await cookies();
  const sarieeSession = c.get(SARIEE_SESSION_COOKIE)?.value ?? null;
  const customerBearer = c.get(AUREALIS_SF_BEARER_COOKIE)?.value ?? null;

  if (!sarieeSession && !customerBearer) {
    return NextResponse.json({ orders: [], authenticated: false }, { status: 200, ...h });
  }

  const result = await getSarieeOrders({ sarieeSession, bearerOverride: customerBearer });

  if (!result.ok) {
    return NextResponse.json({ orders: [], error: result.error }, { status: 200, ...h });
  }

  return NextResponse.json({ orders: result.orders, authenticated: true }, { status: 200, ...h });
}
