import 'server-only';

const DEFAULT_BASE = 'https://api.sariee.com';

export function getSarieeBaseUrl(): string {
  return (process.env.SARIEE_API_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, '');
}

export function getSarieeBearerToken(): string | null {
  const t = process.env.SARIEE_API_BEARER_TOKEN;
  return t && t.length > 0 ? t : null;
}

export function isSarieeConfigured(): boolean {
  return getSarieeBearerToken() != null;
}

export function getSarieeOptionalReferer(): string | null {
  const r = process.env.SARIEE_REQUEST_REFERER ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!r || !r.length) return null;
  return r.replace(/\/$/, '');
}
