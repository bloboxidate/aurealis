'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { getUserDisplayName } from '@/lib/auth/user-display-name';

function useAuthUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setUser(null);
      setClientReady(true);
      return;
    }
    setClientReady(true);
    const load = () => {
      void supabase.auth.getUser().then(({ data, error }) => {
        if (error) setUser(null);
        else setUser(data.user ?? null);
      });
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, clientReady };
}

export function UserAuthNav() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const { user, clientReady } = useAuthUser();
  const supabase = typeof window !== 'undefined' ? getSupabaseBrowser() : null;

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.refresh();
  }, [router, supabase]);

  if (!clientReady) {
    return <div className="hidden md:block h-4 w-24 sm:w-32 rounded bg-ink/5 animate-pulse" aria-hidden />;
  }

  if (user && supabase) {
    const name = getUserDisplayName(user);
    return (
      <div
        className="hidden md:flex items-center gap-2 sm:gap-3 max-w-[min(12rem,28vw)] lg:max-w-[min(14rem,20vw)]"
        data-auth="in"
      >
        <span
          className="text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold text-ink/55 truncate"
          style={{ fontFamily: 'var(--font-ui)' }}
          title={name}
        >
          {name}
        </span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="shrink-0 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-ink/40 hover:text-apricot"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('sign_out')}
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-2 sm:gap-3 whitespace-nowrap" data-auth="out">
      <Link
        href={`/${locale}/login`}
        className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold text-ink/45 hover:text-apricot nav-link-lux"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {t('login')}
      </Link>
      <span className="text-ink/15 select-none" aria-hidden>
        ·
      </span>
      <Link
        href={`/${locale}/signup`}
        className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-bold text-apricot/90 hover:text-apricot"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {t('signup')}
      </Link>
    </div>
  );
}

export function UserAuthNavMobile({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const { user, clientReady } = useAuthUser();
  const supabase = getSupabaseBrowser();
  const go = onNavigate ?? (() => {});

  if (!clientReady) {
    return null;
  }

  if (user && supabase) {
    const name = getUserDisplayName(user);
    return (
      <div className="space-y-3 pb-4 border-b border-border/50">
        <p
          className="text-xs text-ink/60 truncate px-1"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('signed_in_as', { name })}
        </p>
        <button
          type="button"
          onClick={async () => {
            go();
            await supabase.auth.signOut();
            router.refresh();
          }}
          className="block w-full text-left py-2 text-sm tracking-[0.25em] uppercase font-semibold text-ink/60"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('sign_out')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-0 pb-4 border-b border-border/50">
      <Link
        href={`/${locale}/login`}
        onClick={go}
        className="block py-3.5 -mx-1 px-1 text-sm tracking-[0.25em] uppercase font-semibold text-ink/60 active:text-apricot"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {t('login')}
      </Link>
      <Link
        href={`/${locale}/signup`}
        onClick={go}
        className="block py-3.5 -mx-1 px-1 text-sm tracking-[0.25em] uppercase font-bold text-apricot/90 active:text-apricot"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {t('signup')}
      </Link>
    </div>
  );
}
