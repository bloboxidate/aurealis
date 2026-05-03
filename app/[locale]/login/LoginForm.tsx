'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const code = searchParams.get('error');
    if (code === 'auth_callback') setError(t('error_auth_callback'));
    else if (code === 'missing_config') setError(t('error_missing_config'));
  }, [searchParams, t]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    void (async () => {
      const res = await fetch('/api/auth/sariee/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      let msg: string | null = null;
      try {
        const j = (await res.json()) as { error?: string };
        if (!res.ok && typeof j.error === 'string') msg = j.error;
      } catch {
        if (!res.ok) msg = t('error_login_failed');
      }
      setPending(false);
      if (!res.ok) {
        setError(msg ?? t('error_login_failed'));
        return;
      }
      await router.push(`/${locale}/account`);
      router.refresh();
    })();
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-md">
      {error && (
        <p
          className="text-sm text-ink/80 bg-apricot/10 border border-apricot/30 rounded-2xl px-4 py-3"
          style={{ fontFamily: 'var(--font-body)' }}
          role="alert"
        >
          {error}
        </p>
      )}
      <div>
        <label htmlFor="login-email" className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bold mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
          {t('field_email')}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-border/80 bg-light/20 px-4 py-3 text-ink"
          required
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bold mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
          {t('field_password')}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-border/80 bg-light/20 px-4 py-3 text-ink"
          minLength={8}
          required
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full py-3.5 rounded-full bg-ink text-petal text-[10px] tracking-[0.3em] uppercase font-bold disabled:opacity-50"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {pending ? '…' : t('login_submit')}
      </button>
      <p className="text-sm text-muted" style={{ fontFamily: 'var(--font-body)' }}>
        {t('no_account')}{' '}
        <Link href={`/${locale}/signup`} className="text-apricot font-semibold hover:underline">
          {t('signup')}
        </Link>
      </p>
    </form>
  );
}
