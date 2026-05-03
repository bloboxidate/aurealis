import { getSarieeBaseUrl, getSarieeBearerToken } from '@/lib/sariee/config';
import { buildSarieeAuthHeaders } from '@/lib/sariee/client';
import { assertSarieeCompanyProxyAllowed } from '@/lib/sariee/proxy-guard';
import { withNoStore } from '@/lib/security/secure-api-headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** e.g. script.js, forget-password, checkout-return */
const SEGMENT_RE = /^[a-zA-Z0-9._-]+$/;
const MAX_SEGMENTS = 48;

function hopByHop(name: string): boolean {
  const n = name.toLowerCase();
  return ['connection', 'keep-alive', 'transfer-encoding', 'host', 'content-length', 'expect', 'te'].includes(n);
}

function buildUpstreamUrl(pathParts: string[], search: string): string | null {
  if (pathParts.length < 2 || pathParts.length > MAX_SEGMENTS) return null;
  const realm = pathParts[0];
  if (realm !== 'frontend' && realm !== 'company') return null;
  const rest = pathParts.slice(1);
  if (!rest.length) return null;
  for (const s of pathParts) {
    if (!SEGMENT_RE.test(s)) return null;
  }
  const p = `/api/${realm}/${rest.join('/')}`;
  const qs = search && search.length > 0 ? `?${search}` : '';
  return `${getSarieeBaseUrl()}${p}${qs}`;
}

function mergeUpstreamHeaders(upstream: Response): Headers {
  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    const kl = key.toLowerCase();
    if (kl === 'set-cookie') return;
    if (hopByHop(key)) return;
    out.append(key, value);
  });
  for (const [k, v] of Object.entries(withNoStore())) {
    out.set(k, v);
  }
  return out;
}

async function handle(request: Request, context: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path: pathParts } = await context.params;
  const url = new URL(request.url);
  const upstreamUrl = buildUpstreamUrl(pathParts, url.searchParams.toString());
  if (!upstreamUrl) {
    return NextResponse.json(
      {
        error: 'invalid_proxy_path',
        message:
          'Use /api/sariee/v1/frontend/… or /api/sariee/v1/company/… mirroring Sariee paths after /api/ (see Postman).',
      },
      { status: 400, headers: withNoStore() }
    );
  }

  if (pathParts[0] === 'company') {
    const denied = assertSarieeCompanyProxyAllowed(request);
    if (denied) return denied;
  }

  if (!getSarieeBearerToken()) {
    return NextResponse.json({ error: 'sariee_not_configured' }, { status: 503, headers: withNoStore() });
  }

  const method = request.method.toUpperCase();
  if (method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: withNoStore({
        Allow: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
      }),
    });
  }

  const headers = buildSarieeAuthHeaders();
  let body: BodyInit | undefined;
  if (!['GET', 'HEAD'].includes(method)) {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 0) {
      body = buf;
      const ct = request.headers.get('content-type');
      if (ct) headers.set('Content-Type', ct);
    }
  }

  const upstream = await fetch(upstreamUrl, {
    method,
    headers,
    body,
    redirect: 'manual',
  });

  const resHeaders = mergeUpstreamHeaders(upstream);
  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  });
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
