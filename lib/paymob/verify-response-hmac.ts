import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Paymob "transaction response" redirect: HMAC-SHA512 over a fixed string order.
 * If verification fails in production, adjust key order/aliases per your dashboard
 * and Paymob’s current spec: https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac
 */
const HMAC_KEY_ORDER: string[] = [
  'amount_cents',
  'created_at',
  'currency',
  'error_occured',
  'has_parent_transaction',
  'id',
  'integration_id',
  'is_3d_secure',
  'is_auth',
  'is_capture',
  'is_refund',
  'is_refunded',
  'is_standalone_payment',
  'is_voided',
  'order',
  'owner',
  'pending',
  'source_data',
  'success',
];

function getVal(params: URLSearchParams, key: string): string {
  const v = params.get(key);
  if (v != null) return v;
  if (key === 'is_3d_secure') {
    return params.get('is_3d_success') ?? '';
  }
  if (key === 'is_refund') {
    return params.get('is_refund') ?? params.get('is_refunded') ?? '';
  }
  return '';
}

/**
 * @returns whether the HMAC is valid. If `hmac` or secret is missing, returns `false` (do not treat as paid).
 */
export function verifyTransactionResponseHmac(
  fullUrl: string,
  hmacSecret: string
): { ok: boolean; query: URLSearchParams; received: string } {
  const u = new URL(fullUrl, 'https://x.local');
  const q = u.searchParams;
  const received = (q.get('hmac') ?? q.get('HMAC') ?? '').toLowerCase();
  if (!received || !hmacSecret) {
    return { ok: false, query: q, received };
  }
  const concat = HMAC_KEY_ORDER.map((k) => getVal(q, k)).join('');
  const expected = createHmac('sha512', hmacSecret)
    .update(concat, 'utf8')
    .digest('hex')
    .toLowerCase();
  if (expected.length !== received.length) {
    return { ok: false, query: q, received };
  }
  try {
    return {
      ok: timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(received, 'utf8')),
      query: q,
      received,
    };
  } catch {
    return { ok: false, query: q, received };
  }
}

/** Success flag in redirect: Paymob may send string "true" or "false". */
export function isPaymobSuccessParam(params: URLSearchParams): boolean {
  const s = (params.get('success') ?? '').toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}
