import { sarieeFetch } from '@/lib/sariee/client';
import { withNoStore } from '@/lib/security/secure-api-headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * BFF: lists categories from Sariee (GET …/api/frontend/categories/all-categories).
 * Forwards query string if present (per Sariee docs / Postman).
 * General proxy: GET /api/sariee/v1/frontend/categories/all-categories (same upstream).
 */
export async function GET(request: Request) {
  const next = new URL(request.url);
  const qs = next.searchParams.toString();
  const path = `/api/frontend/categories/all-categories${qs ? `?${qs}` : ''}`;
  const upstream = await sarieeFetch(path, { method: 'GET', forwardFrom: request.headers });
  const body = await upstream.text();
  const ct = upstream.headers.get('content-type') ?? 'application/json';
  return new NextResponse(body, {
    status: upstream.status,
    headers: { ...withNoStore(), 'Content-Type': ct },
  });
}
