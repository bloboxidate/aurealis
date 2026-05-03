import 'server-only';

import { NextResponse } from 'next/server';
import { withNoStore } from '@/lib/security/secure-api-headers';

/**
 * Company (`/api/company/…`) is merchant-admin scope. Gate it as follows:
 * - `SARIEE_BLOCK_COMPANY_PROXY=1` → all company proxy calls return 403.
 * - `SARIEE_COMPANY_PROXY_SECRET` set → caller must send header `X-Sariee-Company-Proxy-Secret` with the same value.
 * - Neither → company proxy allowed (dev / trusted networks only).
 */
export function assertSarieeCompanyProxyAllowed(request: Request): NextResponse | null {
  const block = process.env.SARIEE_BLOCK_COMPANY_PROXY;
  if (block === '1' || block === 'true') {
    return NextResponse.json(
      { error: 'company_proxy_disabled', message: 'Set SARIEE_BLOCK_COMPANY_PROXY off to enable company routes.' },
      { status: 403, headers: withNoStore() }
    );
  }

  const secret = process.env.SARIEE_COMPANY_PROXY_SECRET?.trim();
  if (!secret) return null;

  const got = request.headers.get('x-sariee-company-proxy-secret');
  if (got !== secret) {
    return NextResponse.json(
      { error: 'company_proxy_unauthorized', message: 'Invalid or missing X-Sariee-Company-Proxy-Secret.' },
      { status: 401, headers: withNoStore() }
    );
  }
  return null;
}
