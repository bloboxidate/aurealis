import { isIpAllowed } from '@/lib/allowlist';
import { headers } from 'next/headers';

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const firstIp = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || '';
  if (!isIpAllowed(firstIp, process.env.ADMIN_ALLOWED_IPS)) {
    return <div className="p-8 text-rose-400">Access denied (IP not allowed).</div>;
  }
  return <>{children}</>;
}
