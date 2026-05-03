import { isSarieeConfigured, getSarieeBaseUrl } from '@/lib/sariee/config';
import { sarieeFetch } from '@/lib/sariee/client';
import { withNoStore } from '@/lib/security/secure-api-headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Checks env and a lightweight call to Sariee (categories list). Use for deployment checks only;
 * remove or protect in production if you do not want this endpoint public.
 */
export async function GET() {
  const configured = isSarieeConfigured();
  if (!configured) {
    return NextResponse.json(
      { ok: false, configured: false, baseUrl: getSarieeBaseUrl(), message: 'Set SARIEE_API_BEARER_TOKEN' },
      { status: 200, headers: withNoStore() }
    );
  }

  const upstream = await sarieeFetch('/api/frontend/categories/all-categories', { method: 'GET' });
  const text = await upstream.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    /* non-JSON */
  }

  const isDev = process.env.NODE_ENV === 'development';
  const devPayload =
    isDev && typeof parsed === 'object' && parsed !== null
      ? { sample: parsed }
      : isDev
        ? { hint: text.slice(0, 200) }
        : {};

  return NextResponse.json(
    {
      ok: upstream.ok,
      configured: true,
      baseUrl: getSarieeBaseUrl(),
      upstreamStatus: upstream.status,
      proxyPattern: '/api/sariee/v1/{frontend|company}/… → Sariee /api/{frontend|company}/…',
      webhookUrl: '/api/sariee/webhook',
      forwardHeaders:
        'If-Match, If-None-Match, Accept, Accept-Language, Idempotency-Key, X-Request-Id; optional SARIEE_EXTRA_FORWARD_HEADERS',
      ...devPayload,
    },
    { status: 200, headers: withNoStore() }
  );
}
