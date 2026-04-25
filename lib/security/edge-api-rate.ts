import { NextRequest, NextResponse } from 'next/server';

type Bucket = { count: number; windowStart: number };
const store = new Map<string, Bucket>();
const MAX_KEYS = 12_000;

/**
 * In-memory, per-IP cap for all `/api/*` (single Node/Edge instance).
 * Complement: Paymob `init` has stricter limits; WAF/Cloudflare in production.
 */
function getConfig() {
  const windowMs = 60_000;
  const max = Math.max(10, Math.min(500, Number(process.env.API_RATE_MAX_PER_MIN ?? 120) || 120));
  return { windowMs, max };
}

function prune() {
  if (store.size <= MAX_KEYS) return;
  const keys = [...store.keys()];
  for (const k of keys.slice(0, Math.floor(keys.length / 2))) {
    store.delete(k);
  }
}

export function rateLimitApiRequest(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const { windowMs, max } = getConfig();
  const key = `api:${ip}`;
  const now = Date.now();
  const b = store.get(key);
  if (!b || now - b.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    prune();
    return null;
  }
  if (b.count >= max) {
    return NextResponse.json(
      { error: 'rate_limited' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
  b.count += 1;
  return null;
}
