import 'server-only';

export function parseJsonUnknown(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export function asRecord(v: unknown): Record<string, unknown> | null {
  return v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

/** Sariee often wraps lists in `data`, `products`, or nested shapes. */
export function extractArray(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  const r = asRecord(json);
  if (!r) return [];
  for (const k of ['data', 'products', 'items', 'result', 'records']) {
    const v = r[k];
    if (Array.isArray(v)) return v;
    const inner = asRecord(v);
    if (inner) {
      for (const ik of ['data', 'products', 'items']) {
        const a = inner[ik];
        if (Array.isArray(a)) return a;
      }
    }
  }
  return [];
}

export function sarieeUpstreamMessage(json: unknown, fallback: string): string {
  const r = asRecord(json);
  if (!r) return fallback;
  const msg = r.message ?? r.error ?? r.msg;
  if (typeof msg === 'string' && msg.trim()) return msg.trim();
  return fallback;
}

function walk(obj: unknown, visit: (o: Record<string, unknown>) => void): void {
  const r = asRecord(obj);
  if (!r) return;
  visit(r);
  for (const v of Object.values(r)) {
    if (Array.isArray(v)) {
      for (const item of v) walk(item, visit);
    } else walk(v, visit);
  }
}

export function deepFindEmail(obj: unknown): string | null {
  let found: string | null = null;
  walk(obj, (o) => {
    for (const [k, v] of Object.entries(o)) {
      if (found) return;
      const kl = k.toLowerCase();
      if ((kl === 'email' || kl.endsWith('_email') || kl === 'email_address') && typeof v === 'string') {
        const e = v.trim();
        if (e.includes('@')) found = e;
      }
    }
  });
  return found;
}

export function parseBearerLikeFromJson(json: unknown): string | null {
  const r = asRecord(json);
  if (!r) return null;
  for (const k of ['token', 'access_token', 'accessToken', 'auth_token', 'bearer']) {
    const v = r[k];
    if (typeof v === 'string' && v.trim().length > 8) return v.trim();
  }
  const d = asRecord(r.data);
  if (d) {
    for (const k of ['token', 'access_token', 'accessToken']) {
      const v = d[k];
      if (typeof v === 'string' && v.trim().length > 8) return v.trim();
    }
  }
  return null;
}

export function deepFindName(obj: unknown): string | null {
  const r = asRecord(obj);
  if (!r) return null;
  for (const k of ['full_name', 'name', 'display_name', 'username', 'customer_name']) {
    const v = r[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  const u = asRecord(r.user);
  if (u) {
    for (const k of ['full_name', 'name']) {
      const v = u[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
  }
  return null;
}
