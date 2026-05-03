'use client';

import { ADMIN_BASE } from '@/lib/admin/const';

export default function Logout() {
  return (
    <button
      type="button"
      className="text-sm text-slate-400 hover:text-white shrink-0"
      onClick={async () => {
        await fetch('/api/admin/auth/logout', { method: 'POST' });
        window.location.href = `${ADMIN_BASE}/login`;
      }}
    >
      Log out
    </button>
  );
}
