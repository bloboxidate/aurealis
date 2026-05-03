import 'server-only';

import { getSarieeBaseUrl, getSarieeBearerToken, getSarieeOptionalReferer } from './config';
import { applySarieeForwardHeaders } from './forward-headers';

/** Authorization + optional Referer + default Accept. Caller may set Content-Type (e.g. multipart). */
export function buildSarieeAuthHeaders(
  extra?: HeadersInit,
  opts?: { bearerOverride?: string | null; omitServerBearer?: boolean; sarieeSession?: string | null }
): Headers {
  const h = new Headers(extra);
  const server = getSarieeBearerToken();
  const cust = opts?.bearerOverride?.trim();
  let bearer: string | null = null;
  if (opts?.omitServerBearer && cust) bearer = cust;
  else if (server) bearer = server;
  else if (cust) bearer = cust;
  if (bearer) h.set('Authorization', `Bearer ${bearer}`);
  const sess = opts?.sarieeSession?.trim();
  if (sess) {
    const prev = h.get('Cookie');
    const part = `sariee_session=${sess}`;
    h.set('Cookie', prev ? `${prev}; ${part}` : part);
  }
  const ref = getSarieeOptionalReferer();
  if (ref) h.set('Referer', ref);
  if (!h.has('Accept')) h.set('Accept', 'application/json');
  return h;
}

function ensureJsonContentTypeForBody(headers: Headers, body: BodyInit | null | undefined): void {
  if (headers.has('Content-Type')) return;
  if (body === undefined || body === null) return;
  if (typeof FormData !== 'undefined' && body instanceof FormData) return;
  headers.set('Content-Type', 'application/json');
}

export type SarieeInit = RequestInit & {
  json?: unknown;
  /** Merge allowlisted headers (If-Match, Accept, …) */
  forwardFrom?: Headers;
  /** Replace server bearer (e.g. per-customer token from Sariee login). */
  bearerOverride?: string | null;
  /** Send `Cookie: sariee_session=…` for storefront session APIs. */
  sarieeSession?: string | null;
  /** When true, do not attach `SARIEE_API_BEARER_TOKEN` (session-only calls). */
  omitServerBearer?: boolean;
};

/**
 * Server-side call to the Sariee API (Postman: Customer → /api/frontend/…, Company → /api/company/…).
 * Keep SARIEE_API_BEARER_TOKEN only in server env — never expose to the browser.
 */
export async function sarieeFetch(path: string, init: SarieeInit = {}): Promise<Response> {
  const base = getSarieeBaseUrl();
  const pathPart = path.startsWith('/') ? path : `/${path}`;
  const url = pathPart.startsWith('http') ? pathPart : `${base}${pathPart}`;

  const { json, headers: hint, body, forwardFrom, bearerOverride, sarieeSession, omitServerBearer, ...rest } = init;

  const hasServerBearer = !!getSarieeBearerToken();
  const hasCustomerBearer = (bearerOverride?.length ?? 0) > 0;
  const hasSession = (sarieeSession?.length ?? 0) > 0;
  const allowedWithoutServer = omitServerBearer === true && (hasCustomerBearer || hasSession);
  if (!hasServerBearer && !allowedWithoutServer) {
    return new Response(JSON.stringify({ error: 'sariee_not_configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const headers = buildSarieeAuthHeaders(hint, { bearerOverride, omitServerBearer, sarieeSession });
  if (forwardFrom) applySarieeForwardHeaders(headers, forwardFrom);
  const method = rest.method ?? (json !== undefined ? 'POST' : 'GET');

  if (json !== undefined) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    return fetch(url, { ...rest, method, headers, body: JSON.stringify(json) });
  }

  ensureJsonContentTypeForBody(headers, body);
  return fetch(url, { ...rest, method, headers, body });
}
