'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get('password') ?? '');
    try {
      const r = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!r.ok) {
        setErr('Invalid credentials or too many attempts.');
        setLoading(false);
        return;
      }
      window.location.href = '/admin';
    } catch {
      setErr('Network error.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-slate-900/50 border border-slate-700/80 rounded-lg p-5">
      <div>
        <label className="block text-xs text-slate-400 mb-1">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-slate-600 bg-white px-3 py-2 text-sm"
        />
      </div>
      {err && <p className="text-sm text-rose-400">{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
