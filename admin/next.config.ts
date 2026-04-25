import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  { key: 'X-Frame-Options' as const, value: 'DENY' },
  { key: 'X-Content-Type-Options' as const, value: 'nosniff' },
  { key: 'Referrer-Policy' as const, value: 'no-referrer' },
  { key: 'Permissions-Policy' as const, value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy' as const,
    value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /** Avoid picking parent workspace lockfile as Turbopack root. */
  turbopack: {
    root: here,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
