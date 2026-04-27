import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

const allowedDevOrigins = isDev
  ? [
      ...new Set(
        `192.168.1.30,${process.env.ALLOWED_DEV_ORIGINS ?? ''}`
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      ),
    ]
  : undefined;

function buildCsp() {
  const script = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";
  const supabaseConnect = "https://*.supabase.co wss://*.supabase.co";
  const connect = isDev
    ? `connect-src 'self' https: wss: ws: http: https://vercel.live https://*.vercel.app ${supabaseConnect}`
    : `connect-src 'self' https://vercel.live https://*.vercel.app ${supabaseConnect}`;
  return [
    "default-src 'self'",
    script,
    "style-src 'self' 'unsafe-inline' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    connect,
    "frame-ancestors 'none'",
    "frame-src 'self' https://accept.paymob.com",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    isDev ? "" : "block-all-mixed-content",
    isDev ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join('; ');
}

const securityHeaders: { key: string; value: string }[] = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
  { key: 'Content-Security-Policy', value: buildCsp() },
];

if (process.env.VERCEL === '1' || process.env.ENABLE_HSTS === '1') {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  });
}

export default withNextIntl({
  ...(allowedDevOrigins && allowedDevOrigins.length > 0
    ? { allowedDevOrigins }
    : {}),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
});
