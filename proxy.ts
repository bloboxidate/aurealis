import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { rateLimitApiRequest } from './lib/security/edge-api-rate';
import { updateSession } from './lib/supabase/middleware';

const intl = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const limited = rateLimitApiRequest(request);
    if (limited) {
      return limited;
    }
    return updateSession(request, NextResponse.next());
  }
  /** Embedded admin lives outside `[locale]`; skip next-intl so `/admin` is not rewritten. */
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    return updateSession(request, NextResponse.next());
  }
  const intlResponse = intl(request);
  return updateSession(request, intlResponse);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
