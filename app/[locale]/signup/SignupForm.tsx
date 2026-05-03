'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export function SignupForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    void (async () => {
      const res = await fetch('/api/auth/sariee/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ name: name.trim() || undefined, email: email.trim(), password }),
      });
      let msg: string | null = null;
      let needsEmailConfirm = false;
      try {
        const j = (await res.json()) as { error?: string; needsEmailConfirm?: boolean };
        if (!res.ok && typeof j.error === 'string') msg = j.error;
        if (res.ok) needsEmailConfirm = !!j.needsEmailConfirm;
      } catch {
        if (!res.ok) msg = t('error_signup_failed');
      }
      setPending(false);
      if (!res.ok) {
        setError(msg ?? t('error_signup_failed'));
        return;
      }
      if (needsEmailConfirm) {
        setError(t('signup_confirm_email'));
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
        <label htmlFor="su-name" className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bold mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
          {t('field_name')}
        </label>
        <input
          id="su-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-border/80 bg-light/20 px-4 py-3 text-ink"
        />
      </div>
      <div>
        <label htmlFor="su-email" className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bold mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
          {t('field_email')}
        </label>
        <input
          id="su-email"
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
        <label htmlFor="su-password" className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bold mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
          {t('field_password_signup')}
        </label>
        <input
          id="su-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-border/80 bg-light/20 px-4 py-3 text-ink"
          minLength={8}
          required
        />
        <p className="text-xs text-muted mt-1" style={{ fontFamily: 'var(--font-ui)' }}>
          {t('password_hint')}
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full py-3.5 rounded-full bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold disabled:opacity-50"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {pending ? '…' : t('signup_submit')}
      </button>
      <p className="text-sm text-muted" style={{ fontFamily: 'var(--font-body)' }}>
        {t('have_account')}{' '}
        <Link href={`/${locale}/login`} className="text-apricot font-semibold hover:underline">
          {t('login')}
        </Link>
      </p>
    </form>
  );
}
