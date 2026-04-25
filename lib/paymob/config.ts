/**
 * Paymob Accept (Egypt) — config only, no secrets in client bundles.
 * @see https://accept.paymob.com/ — register webhooks and copy keys from the dashboard.
 */

const PAYMOB_BASE = 'https://accept.paymob.com';

export function getPaymobBaseUrl(): string {
  return (process.env.PAYMOB_BASE_URL ?? PAYMOB_BASE).replace(/\/$/, '');
}

export function isPaymobAcceptConfigured(): boolean {
  return Boolean(
    process.env.PAYMOB_API_KEY &&
      process.env.PAYMOB_MERCHANT_ID &&
      process.env.PAYMOB_INTEGRATION_ID &&
      process.env.PAYMOB_HMAC_SECRET
  );
}

/** Iframe in URL path: often the card integration id or a dedicated iframe id from the dashboard. */
export function getPaymobIframeId(): string {
  return (
    process.env.PAYMOB_IFRAME_ID ??
    process.env.PAYMOB_INTEGRATION_ID ??
    ''
  );
}

export function getMerchantId(): string {
  return process.env.PAYMOB_MERCHANT_ID ?? '';
}

export function getIntegrationId(): string {
  return process.env.PAYMOB_INTEGRATION_ID ?? '';
}
