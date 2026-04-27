import 'server-only';

import { getSarieeBaseUrl, getSarieeBearerToken, getSarieeOptionalReferer } from './config';

function buildHeaders(extra?: HeadersInit): Headers {
  const h = new Headers(extra);
  h.set('Accept', 'application/json');
  if (!h.has('Content-Type')) h.set('Content-Type', 'application/json');
  const token = getSarieeBearerToken();
  if (token) h.set('Authorization', `Bearer ${token}`);
  const ref = getSarieeOptionalReferer();
  if (ref) h.set('Referer', ref);
  return h;
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
  const headers = buildHeaders(hint);
  const method = rest.method ?? (json !== undefined ? 'POST' : 'GET');

  if (json !== undefined) {
    return fetch(url, { ...rest, method, headers, body: JSON.stringify(json) });
  }
  return fetch(url, { ...rest, method, headers, body });
}
