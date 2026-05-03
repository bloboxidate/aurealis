import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

/**
 * Legacy Supabase email-confirmation URL (`/auth/callback?code=…`).
 * Auth is Sariee-backed now; send users to login.
 */
export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { origin } = requestUrl;
  return NextResponse.redirect(new URL(`/${routing.defaultLocale}/login`, origin));
}
