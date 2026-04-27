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
