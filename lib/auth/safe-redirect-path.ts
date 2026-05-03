import { routing } from '@/i18n/routing';

const LOCALE_PATH = new RegExp(`^\\/(${routing.locales.join('|')})(\\/|$)`);

export function getSafeNextPath(fallback: string, candidate: string | null): string {
  if (!candidate || !candidate.startsWith('/')) return fallback;
  if (candidate.startsWith('//')) return fallback;
  if (candidate.includes(':')) return fallback;
  if (candidate.includes('..')) return fallback;
  /** Same-origin app routes use locale prefix (next-intl). Reject odd paths after auth. */
  if (!LOCALE_PATH.test(candidate)) return fallback;
  return candidate;
}
