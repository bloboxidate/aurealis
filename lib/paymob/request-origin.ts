import 'server-only';

export function isAllowedRequestOrigin(request: Request): boolean {
  if (process.env.PAYMOB_RELAX_ORIGIN === '1') {
    return true;
  }
  const origin = request.headers.get('origin') ?? '';
  if (!origin) {
    return process.env.NODE_ENV !== 'production';
  }
  const allowed = new Set<string>();
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    allowed.add(process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''));
  }
  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL.replace(/\/$/, '')}`);
  }
  allowed.add('http://localhost:3000');
  allowed.add('http://127.0.0.1:3000');
  const o = origin.replace(/\/$/, '');
  if (allowed.has(o)) return true;
  return false;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
