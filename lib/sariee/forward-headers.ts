import 'server-only';

/**
 * Headers Postman often sends that our BFF previously dropped. Forwarding these to Sariee
 * avoids subtle failures (412 preconditions, locale, idempotency) when mirroring their API.
 *
 * Add lowercase names via SARIEE_EXTRA_FORWARD_HEADERS (comma-separated), e.g.
 * `x-company-id,x-store-id` if Sariee support instructs you to.
 */
const BLOCK_FROM_CLIENT = new Set([
  'authorization',
  'cookie',
  'host',
  'content-length',
  'connection',
  'transfer-encoding',
  'expect',
  'te',
  'proxy-authorization',
  'proxy-connection',
  'upgrade',
]);

function blockForwarded(name: string): boolean {
  const n = name.toLowerCase();
  if (BLOCK_FROM_CLIENT.has(n)) return true;
  if (n.startsWith('x-forwarded-')) return true;
  if (n.startsWith('x-vercel-')) return true;
  return false;
}

const DEFAULT_FORWARD = new Set([
  'if-match',
  'if-none-match',
  'if-unmodified-since',
  'if-modified-since',
  'accept',
  'accept-language',
  'idempotency-key',
  'x-request-id',
  'x-correlation-id',
]);

function allowedNames(): Set<string> {
  const s = new Set(DEFAULT_FORWARD);
  const extra = process.env.SARIEE_EXTRA_FORWARD_HEADERS ?? '';
  for (const part of extra.split(',')) {
    const t = part.trim().toLowerCase();
    if (t && !blockForwarded(t)) s.add(t);
  }
  return s;
}

const MAX_FORWARDED_HEADER_VALUE_LEN = 8192;

/**
 * Copy allowlisted request headers from the incoming Request into outbound Sariee headers.
 * Does not remove server-set Authorization / Referer; caller should build auth first, then call this.
 */
export function applySarieeForwardHeaders(outbound: Headers, incoming: Headers): void {
  const allow = allowedNames();
  let count = 0;
  const maxHeaders = 40;
  incoming.forEach((value, key) => {
    if (count >= maxHeaders) return;
    const low = key.toLowerCase();
    if (!allow.has(low) || blockForwarded(low)) return;
    if (value.length > MAX_FORWARDED_HEADER_VALUE_LEN) return;
    outbound.set(key, value);
    count += 1;
  });
}
