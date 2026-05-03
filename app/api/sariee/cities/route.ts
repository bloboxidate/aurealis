import { NextResponse } from 'next/server';
import { fetchSarieeCities } from '@/lib/sariee/helpers';
import { withNoStore } from '@/lib/security/secure-api-headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stateId = url.searchParams.get('state_id') ?? undefined;
  const cities = await fetchSarieeCities(stateId);
  return NextResponse.json({ cities }, { headers: withNoStore() });
}
