import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSarieeOrder } from '@/lib/sariee/cart';
import { withNoStore } from '@/lib/security/secure-api-headers';
import { SARIEE_SESSION_COOKIE, AUREALIS_SF_BEARER_COOKIE } from '@/lib/sariee/auth-cookies';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const h = { headers: withNoStore() };

  const c = await cookies();
  const sarieeSession = c.get(SARIEE_SESSION_COOKIE)?.value ?? null;
  const customerBearer = c.get(AUREALIS_SF_BEARER_COOKIE)?.value ?? null;

  const result = await getSarieeOrder(decodeURIComponent(ref), {
    sarieeSession,
    bearerOverride: customerBearer,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404, ...h });
  }

  return NextResponse.json({ order: result.order }, { status: 200, ...h });
}
