import { isPaymobAcceptConfigured, getPaymobBaseUrl } from '@/lib/paymob/config';
import { withNoStore } from '@/lib/security/secure-api-headers';

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * No secrets. Lets the storefront know if card checkout can start (keys present).
 */
export function GET() {
  return NextResponse.json(
    {
      cardPaymentsReady: isPaymobAcceptConfigured(),
      base: getPaymobBaseUrl().replace(/^https?:\/\//, ''),
    },
    { headers: withNoStore() }
  );
}
