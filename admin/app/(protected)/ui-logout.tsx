'use client';

export default function Logout() {
  return (
    <button
      type="button"
      className="text-sm text-slate-400 hover:text-white shrink-0"
      onClick={async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
      }}
    >
      Log out
    </button>
  );
}
