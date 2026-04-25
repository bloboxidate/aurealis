import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { rateLimitApiRequest } from './lib/security/edge-api-rate';

const intl = createMiddleware(routing);

/**
 * 1) Global API rate cap (in-memory, per instance).
 * 2) next-intl for all non-API page routes.
 */
export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const limited = rateLimitApiRequest(request);
    if (limited) {
      return limited;
    }
    return NextResponse.next();
  }
  return intl(request);
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
