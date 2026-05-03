import { isPaymobAcceptConfigured } from '@/lib/paymob/config';
import { getAuthToken, createCardPaymentSession, type BillingForPaymob } from '@/lib/paymob/accept';
import { rateLimit } from '@/lib/paymob/rate-limit';
import { isAllowedRequestOrigin, getClientIp } from '@/lib/paymob/request-origin';
import { validateCartLines } from '@/lib/validate-cart';
import { readJsonWithLimit } from '@/lib/security/parse-body';
import { paymobInitBodySchema, type PaymobInitBody } from '@/lib/security/paymob-init-schema';
import { sanitizePlainText } from '@/lib/security/sanitize';
import { withNoStore } from '@/lib/security/secure-api-headers';
import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const INIT_WINDOW_MS = 15 * 60_000;
const INIT_MAX = 20;
const MAX_BODY = 32_768;

function splitName(full: string): { first: string; last: string } {
  const t = full.trim();
  if (!t) return { first: 'Customer', last: 'Aurealis' };
  const p = t.split(/\s+/);
  if (p.length === 1) return { first: p[0]!, last: '-' };
  return { first: p[0]!, last: p.slice(1).join(' ') };
}

export async function POST(request: Request) {
  const h = { headers: withNoStore() };

  if (!isPaymobAcceptConfigured()) {
    return NextResponse.json({ error: 'paymob_not_configured' }, { status: 503, ...h });
  }
  if (!isAllowedRequestOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403, ...h });
  }
  const ip = getClientIp(request);
  if (!rateLimit(`paymob-init:${ip}`, INIT_MAX, INIT_WINDOW_MS)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429, ...h });
  }

  const raw = await readJsonWithLimit(request, MAX_BODY);
  if (!raw.ok) {
    return raw.response;
  }

  let body: PaymobInitBody;
  try {
    body = paymobInitBodySchema.parse(raw.data);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: 'validation_error' }, { status: 400, ...h });
    }
    throw e;
  }

  const ref = `AUR-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString('hex')}`;
  const cart = await validateCartLines(body.items, ref);
  if (!cart.ok) {
    return NextResponse.json({ error: cart.error }, { status: 400, ...h });
  }

  const { first, last } = splitName(sanitizePlainText(body.fullName, 200));
  const billing: BillingForPaymob = {
    firstName: sanitizePlainText(first, 80),
    lastName: sanitizePlainText(last, 80),
    email: sanitizePlainText(body.email, 254),
    phone: body.phone.replace(/[^\d+().\s-]/g, '').slice(0, 40),
    address: sanitizePlainText(body.address, 2000),
    city: sanitizePlainText(body.city, 200),
  };
  if (!billing.email || !billing.phone) {
    return NextResponse.json({ error: 'invalid_billing' }, { status: 400, ...h });
  }

  const returnPath = `?locale=${encodeURIComponent(body.locale)}&ref=${encodeURIComponent(ref)}`;
  try {
    const auth = await getAuthToken();
    const { iframeUrl, orderId, paymentKey } = await createCardPaymentSession({
      authToken: auth,
      amountCents: cart.amountCents,
      merchantOrderId: ref,
      lines: cart.lines,
      billing,
      returnPath,
    });

    return NextResponse.json(
      {
        iframeUrl,
        orderId,
        clientTokenPreview: paymentKey ? `${paymentKey.slice(0, 8)}…` : null,
      },
      { status: 200, ...h }
    );
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[api/paymob/init]', e);
    }
    return NextResponse.json({ error: 'payment_unavailable' }, { status: 502, ...h });
  }
}
