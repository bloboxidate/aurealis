import type { MetadataRoute } from 'next';
import { products } from '@/lib/data';

const BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) || 'http://localhost:3000';

const LOCALE = ['en', 'ar'] as const;

const STATIC_SEGMENTS = [
  '',
  'shop',
  'cart',
  'checkout',
  'checkout/success',
  'wishlist',
  'search',
  'account',
  'account/orders',
  'account/settings',
  'login',
  'signup',
  'track-order',
  'about',
  'contact',
  'faq',
  'shipping',
  'returns',
  'privacy',
  'terms',
  'cookies',
  'accessibility',
  'directory',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  for (const loc of LOCALE) {
    for (const seg of STATIC_SEGMENTS) {
      const path = seg ? `/${loc}/${seg}` : `/${loc}`;
      urls.push({
        url: `${BASE}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: seg === '' ? 1 : seg === 'shop' ? 0.9 : 0.6,
      });
    }
    for (const p of products) {
      urls.push({
        url: `${BASE}/${loc}/product/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return urls;
}
