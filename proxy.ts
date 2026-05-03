import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { rateLimitApiRequest } from './lib/security/edge-api-rate';

const intl = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const limited = rateLimitApiRequest(request);
    if (limited) {
      return limited;
    }
    return NextResponse.next();
  }
  /** Embedded admin lives outside `[locale]`; skip next-intl so `/admin` is not rewritten. */
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    return NextResponse.next();
  }
  /**
   * Auth callback and Sariee-backed flows live outside `[locale]` prefix.
   * Keep `/auth/*` un-rewritten for legacy `/auth/callback` URLs.
   */
  if (request.nextUrl.pathname === '/auth' || request.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }
  const intlResponse = intl(request);
  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
