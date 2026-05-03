/**
 * Canonical public site URL for SEO, sitemap, robots, and Open Graph metadata.
 * In production, set NEXT_PUBLIC_SITE_URL to your canonical https origin (no trailing slash).
 */
export function getPublicSiteUrl(): string {
  const raw = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_URL : undefined;
  const trimmed = raw?.trim();
  if (trimmed) return trimmed.replace(/\/$/, '');
  return 'http://localhost:3000';
}

export function getMetadataBaseUrl(): URL {
  try {
    return new URL(getPublicSiteUrl());
  } catch {
    return new URL('http://localhost:3000');
  }
}
