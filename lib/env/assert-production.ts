import 'server-only';

/**
 * Fail fast when the server starts in production with inconsistent or unsafe configuration.
 * Set SKIP_PRODUCTION_ENV_CHECK=1 only for exceptional cases (e.g. one-off debugging).
 */
export function assertProductionConfiguration(): void {
  if (process.env.NODE_ENV !== 'production') return;
  if (process.env.SKIP_PRODUCTION_ENV_CHECK === '1') return;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!site) {
    throw new Error(
      '[env] Production requires NEXT_PUBLIC_SITE_URL (canonical https origin, e.g. https://www.example.com).'
    );
  }
  if (!site.startsWith('https://')) {
    throw new Error('[env] Production NEXT_PUBLIC_SITE_URL must use https://');
  }

  if (!process.env.SARIEE_API_BEARER_TOKEN?.trim()) {
    throw new Error('[env] Production requires SARIEE_API_BEARER_TOKEN for the product catalog and checkout.');
  }

  const supUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if ((supUrl && !supKey) || (!supUrl && supKey)) {
    throw new Error(
      '[env] Set both NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or neither, for Auth.'
    );
  }
  if (supUrl && !supUrl.startsWith('https://')) {
    throw new Error('[env] NEXT_PUBLIC_SUPABASE_URL must use https://');
  }
}
