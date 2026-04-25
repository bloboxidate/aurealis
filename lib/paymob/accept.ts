import 'server-only';

import { getIntegrationId, getMerchantId, getPaymobBaseUrl, getPaymobIframeId } from './config';
import type { ValidatedLine } from '@/lib/validate-cart';

type AuthResponse = { token: string };

type OrderResponse = { id: number; merchant_order_id?: string; success?: string };

type PaymentKeyResponse = { token: string; id?: number };

export type BillingForPaymob = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

async function postJson<T>(url: string, body: object): Promise<{ ok: boolean; data: T; raw: string; status: number }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const raw = await res.text();
  let data: T = undefined as T;
  try {
    data = (raw ? JSON.parse(raw) : {}) as T;
  } catch {
    data = undefined as T;
  }
  return { ok: res.ok, data, raw, status: res.status };
}

export async function getAuthToken(): Promise<string> {
  const apiKey = process.env.PAYMOB_API_KEY;
  if (!apiKey) throw new Error('PAYMOB_API_KEY is not set');
  const base = getPaymobBaseUrl();
  const { ok, data, status, raw } = await postJson<AuthResponse>(`${base}/api/auth/tokens`, { api_key: apiKey });
  if (!ok || !data?.token) {
    throw new Error(`Paymob auth failed (${status}): ${raw.slice(0, 200)}`);
  }
  return data.token;
}

function buildOrderItems(lines: ValidatedLine[]) {
  return lines.map((l) => ({
    name: l.product.name_en,
    amount_cents: l.lineAmountCents,
    description: l.product.slug,
    quantity: l.quantity,
  }));
}

function billingData(b: BillingForPaymob) {
  return {
    apartment: 'NA',
    email: b.email,
    floor: 'NA',
    first_name: b.firstName,
    street: b.address,
    building: 'NA',
    phone_number: b.phone,
    shipping_method: 'NA',
    postal_code: 'NA',
    city: b.city,
    country: 'EG',
    last_name: b.lastName,
    state: 'NA',
  };
}

/**
 * Register order + get payment key for Accept iframe. Totals are already server-validated (piasters).
 */
export async function createCardPaymentSession(params: {
  authToken: string;
  amountCents: number;
  merchantOrderId: string;
  lines: ValidatedLine[];
  billing: BillingForPaymob;
  returnPath: string;
}): Promise<{ iframeUrl: string; orderId: number; paymentKey: string }> {
  const { authToken, amountCents, merchantOrderId, lines, billing, returnPath } = params;
  const base = getPaymobBaseUrl();
  const merchantId = getMerchantId();
  const integrationId = Number(getIntegrationId());
  if (!Number.isFinite(integrationId) || integrationId <= 0) {
    throw new Error('PAYMOB_INTEGRATION_ID is invalid');
  }

  const mid = Number(merchantId);
  const orderBody: Record<string, unknown> = {
    auth_token: authToken,
    delivery_needed: 'false',
    amount_cents: amountCents,
    currency: 'EGP',
    merchant_order_id: merchantOrderId,
    items: buildOrderItems(lines),
  };
  if (Number.isFinite(mid) && mid > 0) {
    orderBody.merchant_id = mid;
  }

  const or = await postJson<OrderResponse>(`${base}/api/ecommerce/orders`, orderBody);
  if (!or.ok || !or.data.id) {
    throw new Error(`Paymob order failed (${or.status}): ${or.raw.slice(0, 500)}`);
  }
  const orderId = or.data.id;

  const publicUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${process.env.VERCEL_URL ?? 'localhost'}`).replace(
    /\/$/,
    ''
  );
  const returnUrl = `${publicUrl}/api/paymob/return${returnPath}`;

  const payBody: Record<string, unknown> = {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: String(orderId),
    billing_data: billingData(billing),
    currency: 'EGP',
    integration_id: integrationId,
    lock_order_when_paid: 'false',
  };
  if (returnUrl) {
    payBody.return_url = returnUrl;
  }

  let pk = await postJson<PaymentKeyResponse>(`${base}/api/acceptance/payment_keys`, payBody);
  if ((!pk.ok || !pk.data?.token) && returnUrl) {
    delete payBody.return_url;
    pk = await postJson<PaymentKeyResponse>(`${base}/api/acceptance/payment_keys`, payBody);
  }
  if (!pk.ok || !pk.data?.token) {
    throw new Error(`Paymob payment_keys failed (${pk.status}): ${pk.raw.slice(0, 500)}`);
  }

  const iframeId = getPaymobIframeId() || String(integrationId);
  const iframeUrl = `${base}/api/acceptance/iframes/${encodeURIComponent(iframeId)}?payment_token=${encodeURIComponent(pk.data.token)}`;

  return { iframeUrl, orderId, paymentKey: pk.data.token };
}
