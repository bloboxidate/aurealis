import { headers } from 'next/headers';
import Link from 'next/link';
import Logout from './ui-logout';
import { ADMIN_BASE } from '@/lib/admin/const';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost';
  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="flex items-start justify-between gap-4 border-b border-slate-700/80 pb-6">
        <div>
          <h1 className="text-2xl font-semibold">Auréalis — Admin</h1>
          <p className="text-slate-400 text-sm mt-1">
            Same deployment as the storefront ({host}). Set{' '}
            <code className="text-amber-200/80">SUPABASE_SERVICE_ROLE_KEY</code> in this project&apos;s env (e.g. Vercel) to
            manage the catalog.
          </p>
        </div>
        <Logout />
      </header>
      <p className="mb-6">
        <Link
          href={`${ADMIN_BASE}/products`}
          className="inline-flex rounded border border-amber-200/30 bg-amber-200/10 px-4 py-2 text-sm text-amber-100 hover:bg-amber-200/20"
        >
          Manage products
        </Link>
      </p>
      <ul className="mt-8 space-y-3 text-slate-300 text-sm list-disc pl-5">
        <li>Enable ADMIN_PASS_HASH (bcrypt) in production. Remove ADMIN_DEV_PASSWORD.</li>
        <li>Rotate ADMIN_SESSION_SECRET after any suspected leak.</li>
        <li>Use ADMIN_ALLOWED_IPS to restrict to known IPs (leave unset to allow anywhere, e.g. phone on cellular).</li>
        <li>Never place customer PII in logs. Payment secrets stay server-only on the storefront.</li>
        <li>
          Point Paymob webhooks to the <strong>store</strong> domain (e.g. /api/paymob/return), not admin.
        </li>
      </ul>
    </div>
  );
}
