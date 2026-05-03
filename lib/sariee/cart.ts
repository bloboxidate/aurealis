import 'server-only';

import { sarieeFetch } from './client';
import { asRecord, extractArray, sarieeUpstreamMessage } from './json-helpers';

function tryParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return null; }
}

function extractCartId(json: unknown): string | null {
  const r = asRecord(json);
  if (!r) return null;
  for (const key of ['cart_id', 'id', 'token', 'cart_token']) {
    const v = r[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number') return String(v);
  }
  const d = asRecord(r.data) ?? asRecord(r.cart);
  if (d) {
    for (const key of ['cart_id', 'id', 'token', 'cart_token']) {
      const v = d[key];
      if (typeof v === 'string' && v.trim()) return v.trim();
      if (typeof v === 'number') return String(v);
    }
  }
  return null;
}

function extractOrderRef(json: unknown): string | null {
  const r = asRecord(json);
  if (!r) return null;
  for (const key of ['order_id', 'id', 'ref', 'order_ref', 'reference', 'order_number']) {
    const v = r[key];
    if (v !== undefined && v !== null) return String(v);
  }
  const d = asRecord(r.data) ?? asRecord(r.order);
  if (d) {
    for (const key of ['order_id', 'id', 'ref', 'order_ref', 'reference', 'order_number']) {
      const v = d[key];
      if (v !== undefined && v !== null) return String(v);
    }
  }
  return null;
}

function extractPaymentUrl(json: unknown): string | null {
  const r = asRecord(json);
  if (!r) return null;
  for (const key of ['payment_url', 'redirect_url', 'url', 'checkout_url', 'payment_link']) {
    const v = r[key];
    if (typeof v === 'string' && v.startsWith('http')) return v;
  }
  const d = asRecord(r.data) ?? asRecord(r.order) ?? asRecord(r.payment);
  if (d) {
    for (const key of ['payment_url', 'redirect_url', 'url', 'checkout_url', 'payment_link']) {
      const v = d[key];
      if (typeof v === 'string' && v.startsWith('http')) return v;
    }
  }
  return null;
}

export type SarieeCartItem = { productId: string; quantity: number };

export type SarieeAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

export type SarieePaymentMethod = {
  id: string | number;
  name: string;
  type: string;
};

export type InitCartResult =
  | { ok: true; cartId: string }
  | { ok: false; error: string };

export type CheckoutResult =
  | { ok: true; ref: string; paymentUrl: string | null }
  | { ok: false; error: string };

export async function initSarieeCart(opts?: { sarieeSession?: string | null }): Promise<InitCartResult> {
  const res = await sarieeFetch('/api/frontend/cart/init', {
    method: 'POST',
    json: {},
    sarieeSession: opts?.sarieeSession,
  });
  const json = tryParse(await res.text());
  const cartId = extractCartId(json);
  if (!cartId) {
    return { ok: false, error: sarieeUpstreamMessage(json, 'cart_init_failed') };
  }
  return { ok: true, cartId };
}

export async function addItemsToSarieeCart(
  cartId: string,
  items: SarieeCartItem[],
  opts?: { sarieeSession?: string | null }
): Promise<{ ok: true } | { ok: false; error: string }> {
  // Try batch first, then per-item fallback
  const batchAttempts = [
    { cart_id: cartId, products: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })) },
    { cart_id: cartId, items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })) },
  ];

  for (const body of batchAttempts) {
    const res = await sarieeFetch('/api/frontend/cart/add-update', {
      method: 'POST',
      json: body,
      sarieeSession: opts?.sarieeSession,
    });
    if (res.ok) return { ok: true };
    if (res.status === 503) return { ok: false, error: 'sariee_not_configured' };
  }

  // Per-item fallback
  for (const item of items) {
    const perItemAttempts = [
      { cart_id: cartId, product_id: item.productId, quantity: item.quantity },
      { cart_id: cartId, product_barcode_id: item.productId, quantity: item.quantity },
      { cart_id: cartId, product_id: Number(item.productId), quantity: item.quantity },
    ];
    let added = false;
    let lastError = '';
    for (const body of perItemAttempts) {
      const res = await sarieeFetch('/api/frontend/cart/add-update', {
        method: 'POST',
        json: body,
        sarieeSession: opts?.sarieeSession,
      });
      if (res.ok) { added = true; break; }
      const j = tryParse(await res.text());
      lastError = sarieeUpstreamMessage(j, `add_failed_${res.status}`);
      if (res.status !== 422 && res.status !== 400) break;
    }
    if (!added) return { ok: false, error: lastError || `add_failed_${item.productId}` };
  }
  return { ok: true };
}

export async function applySarieePromo(
  cartId: string,
  code: string,
  opts?: { sarieeSession?: string | null }
): Promise<{ ok: true; discount?: number } | { ok: false; error: string }> {
  const res = await sarieeFetch('/api/frontend/cart/promocode', {
    method: 'POST',
    json: { cart_id: cartId, code, promo_code: code, coupon_code: code },
    sarieeSession: opts?.sarieeSession,
  });
  const json = tryParse(await res.text());
  if (!res.ok) return { ok: false, error: sarieeUpstreamMessage(json, 'promo_invalid') };
  const r = asRecord(json);
  const d = asRecord(r?.data);
  const discount = (d?.discount ?? r?.discount);
  return { ok: true, discount: typeof discount === 'number' ? discount : undefined };
}

export async function getSarieePaymentMethods(
  cartId: string,
  opts?: { sarieeSession?: string | null }
): Promise<{ ok: true; methods: SarieePaymentMethod[] } | { ok: false; error: string }> {
  const res = await sarieeFetch('/api/frontend/checkout/avail-methods', {
    method: 'POST',
    json: { cart_id: cartId },
    sarieeSession: opts?.sarieeSession,
  });
  const json = tryParse(await res.text());
  if (!res.ok) return { ok: false, error: sarieeUpstreamMessage(json, 'methods_unavailable') };

  const arr = extractArray(json);
  const methods: SarieePaymentMethod[] = arr.map((m) => {
    const r = asRecord(m) ?? {};
    return {
      id: (r.id ?? r.payment_method_id ?? '') as string | number,
      name: String(r.name ?? r.method_name ?? r.title ?? ''),
      type: String(r.type ?? r.method_type ?? ''),
    };
  });
  return { ok: true, methods };
}

export async function sarieeCheckoutAction(
  cartId: string,
  address: SarieeAddress,
  paymentMethodId: string | number,
  opts?: { sarieeSession?: string | null }
): Promise<CheckoutResult> {
  const body = {
    cart_id: cartId,
    payment_method_id: paymentMethodId,
    // address fields — try multiple common naming conventions
    name: address.name,
    full_name: address.name,
    email: address.email,
    phone: address.phone,
    address: address.address,
    city: address.city,
    shipping_address: {
      name: address.name,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
    },
  };

  const res = await sarieeFetch('/api/frontend/checkout/checkout-action', {
    method: 'POST',
    json: body,
    sarieeSession: opts?.sarieeSession,
  });

  const json = tryParse(await res.text());
  if (!res.ok) {
    return { ok: false, error: sarieeUpstreamMessage(json, `checkout_failed_${res.status}`) };
  }

  const ref = extractOrderRef(json) ?? `SARIEE-${Date.now()}`;
  const paymentUrl = extractPaymentUrl(json);
  return { ok: true, ref, paymentUrl };
}

export async function getSarieeOrder(
  ref: string,
  opts?: { sarieeSession?: string | null; bearerOverride?: string | null }
): Promise<{ ok: true; order: Record<string, unknown> } | { ok: false; error: string }> {
  const attempts = [
    `/api/frontend/single-order?order_id=${encodeURIComponent(ref)}`,
    `/api/frontend/single-order?id=${encodeURIComponent(ref)}`,
    `/api/frontend/single-order?ref=${encodeURIComponent(ref)}`,
    `/api/frontend/order-tracking?order_id=${encodeURIComponent(ref)}`,
    `/api/frontend/order-tracking?ref=${encodeURIComponent(ref)}`,
  ];

  for (const path of attempts) {
    const res = await sarieeFetch(path, {
      sarieeSession: opts?.sarieeSession,
      bearerOverride: opts?.bearerOverride,
    });
    if (res.ok) {
      const json = tryParse(await res.text());
      const r = asRecord(json);
      const order = asRecord(r?.data) ?? asRecord(r?.order) ?? r;
      if (order) return { ok: true, order };
    }
    if (res.status === 503) break;
  }
  return { ok: false, error: 'order_not_found' };
}

export async function getSarieeOrders(opts?: {
  sarieeSession?: string | null;
  bearerOverride?: string | null;
}): Promise<{ ok: true; orders: Record<string, unknown>[] } | { ok: false; error: string }> {
  const paths = [
    '/api/company/builder/profile/orders',
    '/api/frontend/profile/orders',
  ];

  for (const path of paths) {
    const res = await sarieeFetch(path, {
      sarieeSession: opts?.sarieeSession,
      bearerOverride: opts?.bearerOverride,
      omitServerBearer: !!(opts?.bearerOverride && !opts?.sarieeSession),
    });
    if (res.ok) {
      const json = tryParse(await res.text());
      const arr = extractArray(json);
      return { ok: true, orders: arr.map((o) => asRecord(o) ?? {}) };
    }
    if (res.status === 503) break;
  }
  return { ok: false, error: 'orders_unavailable' };
}
