import { readSessionValue } from '@/lib/session';
import { isIpAllowed } from '@/lib/allowlist';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const firstIp = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || '';
  if (!isIpAllowed(firstIp, process.env.ADMIN_ALLOWED_IPS)) {
    return <div className="p-8 text-rose-400">Access denied (IP not allowed).</div>;
  }
  if (!readSessionValue(h.get('cookie')).ok) {
    redirect('/login');
  }
  return <>{children}</>;
}
