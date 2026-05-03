import { NextResponse } from 'next/server';
import { sarieeFetch } from '@/lib/sariee/client';
import { parseJsonUnknown, sarieeUpstreamMessage } from '@/lib/sariee/json-helpers';
import { withNoStore } from '@/lib/security/secure-api-headers';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400, headers: withNoStore() });
  }
  const r = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  const email = typeof r?.email === 'string' ? r.email.trim() : '';
  if (!email) {
    return NextResponse.json({ error: 'email_required' }, { status: 400, headers: withNoStore() });
  }

  const upstream = await sarieeFetch('/api/frontend/forget-password', {
    method: 'POST',
    json: { email },
  });
  const json = parseJsonUnknown(await upstream.text());
  if (!upstream.ok) {
    return NextResponse.json(
      { error: sarieeUpstreamMessage(json, 'Request failed') },
      { status: upstream.status, headers: withNoStore() }
    );
  }
  return NextResponse.json({ ok: true }, { headers: withNoStore() });
}
