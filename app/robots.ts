import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/env';

const BASE = getPublicSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
