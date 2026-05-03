import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Liveness: no secrets, safe for load balancers and uptime checks.
 * Returns JSON with `Cache-Control: no-store` so it is never treated as static content.
 */
export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'aurealis-storefront',
      time: new Date().toISOString(),
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
