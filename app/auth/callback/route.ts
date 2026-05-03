import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { getSafeNextPath } from '@/lib/auth/safe-redirect-path';
import type { Database } from '@/types/database';

const DEFAULT_NEXT = `/${routing.defaultLocale}/account`;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams, origin } = requestUrl;
  const code = searchParams.get('code');
  const nextRaw = searchParams.get('next');
  const next = getSafeNextPath(DEFAULT_NEXT, nextRaw);

  if (code) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.redirect(new URL(`/${routing.defaultLocale}/login?error=missing_config`, origin));
    }

    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(
    new URL(`/${routing.defaultLocale}/login?error=auth_callback`, origin)
  );
}
