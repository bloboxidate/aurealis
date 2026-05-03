import 'server-only';

import { getSarieeBaseUrl, getSarieeBearerToken, getSarieeOptionalReferer } from './config';

/** Authorization + optional Referer + default Accept. Caller may set Content-Type (e.g. multipart). */
export function buildSarieeAuthHeaders(extra?: HeadersInit): Headers {
  const h = new Headers(extra);
  const token = getSarieeBearerToken();
  if (token) h.set('Authorization', `Bearer ${token}`);
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

export type SarieeInit = RequestInit & { json?: unknown };

/**
 * Server-side call to the Sariee API (Postman: Customer → /api/frontend/…, Company → /api/company/…).
 * Keep SARIEE_API_BEARER_TOKEN only in server env — never expose to the browser.
 */
export async function sarieeFetch(path: string, init: SarieeInit = {}): Promise<Response> {
  const base = getSarieeBaseUrl();
  const pathPart = path.startsWith('/') ? path : `/${path}`;
  const url = pathPart.startsWith('http') ? pathPart : `${base}${pathPart}`;

  if (!getSarieeBearerToken()) {
    return new Response(JSON.stringify({ error: 'sariee_not_configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { json, headers: hint, body, ...rest } = init;
  const headers = buildSarieeAuthHeaders(hint);
  const method = rest.method ?? (json !== undefined ? 'POST' : 'GET');

  if (json !== undefined) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    return fetch(url, { ...rest, method, headers, body: JSON.stringify(json) });
  }

  ensureJsonContentTypeForBody(headers, body);
  return fetch(url, { ...rest, method, headers, body });
}
