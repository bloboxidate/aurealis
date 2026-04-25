import { isPaymobAcceptConfigured } from '@/lib/paymob/config';
import { isPaymobSuccessParam, verifyTransactionResponseHmac } from '@/lib/paymob/verify-response-hmac';
import { rateLimit } from '@/lib/paymob/rate-limit';
import { getClientIp } from '@/lib/paymob/request-origin';
import { withNoStore } from '@/lib/security/secure-api-headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const RETURN_WINDOW_MS = 60_000;
const RETURN_MAX = 60;

/**
 * Customer redirect from Paymob after card flow. HMAC is verified; never mark orders paid without this.
 */
export function GET(request: Request) {
  const url = new URL(request.url);
  const site =
    (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${process.env.VERCEL_URL ?? 'localhost:3000'}`).replace(/\/$/, '');
  const locale = (url.searchParams.get('locale') ?? 'en') === 'ar' ? 'ar' : 'en';

  const ip = getClientIp(request);
  const noStore = { headers: withNoStore() };

  if (!rateLimit(`paymob-return:${ip}`, RETURN_MAX, RETURN_WINDOW_MS)) {
    return NextResponse.redirect(new URL(`/${locale}/checkout?error=rate_limited`, site), { status: 302, ...noStore });
  }

  const secret = process.env.PAYMOB_HMAC_SECRET ?? '';
  const ref = url.searchParams.get('ref') ?? '';
  if (!isPaymobAcceptConfigured() || !secret) {
    return NextResponse.redirect(new URL(`/${locale}/checkout?error=paymob_not_configured`, site), {
      status: 302,
      ...noStore,
    });
  }

  const hmac = verifyTransactionResponseHmac(request.url, secret);
  if (!hmac.ok) {
    const fail = new URL(`/${locale}/checkout`, site);
    fail.searchParams.set('error', 'paymob_hmac');
    if (ref) fail.searchParams.set('ref', ref);
    return NextResponse.redirect(fail, { status: 302, ...noStore });
  }

  const paymobIds = hmac.query.get('id') ?? hmac.query.get('transaction_id') ?? '';
  const success = isPaymobSuccessParam(hmac.query);
  if (!success) {
    return NextResponse.redirect(
      new URL(`/${locale}/checkout?error=payment_declined&paymobId=${encodeURIComponent(paymobIds)}`, site),
      { status: 302, ...noStore }
    );
  }

  const orderRef = ref || hmac.query.get('merchant_order_id') || paymobIds || 'OK';
  return NextResponse.redirect(
    new URL(
      `/${locale}/checkout/success?ref=${encodeURIComponent(orderRef)}&paymobTxn=${encodeURIComponent(paymobIds)}`,
      site
    ),
    { status: 302, ...noStore }
  );
}

/** Health / Paymob preflight — no custom headers to avoid information disclosure. */
export function HEAD() {
  return new NextResponse(null, { status: 200 });
}
