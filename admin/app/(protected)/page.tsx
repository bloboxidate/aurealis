import { headers } from 'next/headers';
import Logout from './ui-logout';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3001';
  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="flex items-start justify-between gap-4 border-b border-slate-700/80 pb-6">
        <div>
          <h1 className="text-2xl font-semibold">Auréalis — Admin</h1>
          <p className="text-slate-400 text-sm mt-1">
            Isolated app on a separate port ({host}) — keep it off public routing; use a VPN, SSH tunnel, or private network.
            Connect Paymob, Supabase, and order tooling from here as you add features.
          </p>
        </div>
        <Logout />
      </header>
      <ul className="mt-8 space-y-3 text-slate-300 text-sm list-disc pl-5">
        <li>Enable ADMIN_PASS_HASH (bcrypt) in production. Remove ADMIN_DEV_PASSWORD.</li>
        <li>Rotate ADMIN_SESSION_SECRET and restart after any suspected leak.</li>
        <li>Use ADMIN_ALLOWED_IPS in production to restrict to office/VPN exit IPs.</li>
        <li>Never place customer PII in logs. Payment secrets stay server-only on the store app (port 3000).</li>
        <li>
          Point Paymob webhooks to the <strong>store</strong> domain (e.g. /api/paymob/return), not this admin app.
        </li>
      </ul>
    </div>
  );
}
