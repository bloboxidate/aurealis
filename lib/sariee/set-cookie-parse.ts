/**
 * Extract `sariee_session` value from upstream `Set-Cookie` headers (Node/undici `getSetCookie`).
 */
export function parseSarieeSessionFromHeaders(headers: Headers): string | null {
  const h = headers as Headers & { getSetCookie?: () => string[] };
  const list = typeof h.getSetCookie === 'function' ? h.getSetCookie() : splitSetCookieFallback(headers.get('set-cookie'));
  for (const line of list) {
    const m = /(?:^|;\s*)sariee_session=([^;]+)/i.exec(line);
    if (m?.[1]) {
      try {
        return decodeURIComponent(m[1].trim());
      } catch {
        return m[1].trim();
      }
    }
  }
  return null;
}

/** Rough split when `getSetCookie` is unavailable (multiple cookies in one header). */
function splitSetCookieFallback(raw: string | null): string[] {
  if (!raw) return [];
  const out: string[] = [];
  let cur = '';
  let i = 0;
  while (i < raw.length) {
    if (raw[i] === ',' && /;\s*$/.test(cur)) {
      out.push(cur.trim());
      cur = '';
      i += 1;
      while (raw[i] === ' ') i += 1;
      continue;
    }
    cur += raw[i];
    i += 1;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
