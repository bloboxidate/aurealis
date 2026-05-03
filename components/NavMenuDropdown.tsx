'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useWishlistStore } from '@/lib/wishlist-store';

const NAV_LINK_KEYS = [
  'shop',
  'collections',
  'blog',
  'about',
  'contact',
  'search',
  'account',
  'wishlist',
  'track_order',
  'faq',
] as const;

function pathForKey(key: (typeof NAV_LINK_KEYS)[number]) {
  return key === 'track_order' ? 'track-order' : key;
}

export function NavMenuDropdown() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const wishCount = useWishlistStore((s) => s.count());
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t('menu_aria')}
        className="group flex items-center gap-2.5 min-h-11 pl-1 pr-2.5 -ms-1 rounded-2xl text-[10px] lg:text-[11px] tracking-[0.3em] uppercase font-semibold text-ink/50 hover:text-apricot border border-transparent hover:border-apricot/20 hover:bg-petal/60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        <span className="inline-flex h-[2px] w-4 flex-col justify-between" aria-hidden>
          <span
            className={`block h-px bg-current origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? 'translate-y-[3px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px bg-current origin-center transition-opacity duration-300 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-px bg-current origin-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? '-translate-y-[3px] -rotate-45' : ''
            }`}
          />
        </span>
        {t('menu')}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          className={`shrink-0 text-apricot/60 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        >
          <path d="M2 4.5L6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={[
          'absolute start-0 top-[calc(100%+0.5rem)] z-[60] w-[min(100vw-2rem,18rem)] origin-top will-change-transform',
          'rounded-2xl border border-border/50 bg-petal/95 backdrop-blur-xl',
          'shadow-[0_24px_48px_-12px_rgba(45,50,40,0.15)]',
          'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open
            ? 'visible scale-100 opacity-100 translate-y-0'
            : 'invisible scale-[0.98] opacity-0 -translate-y-2.5 pointer-events-none',
        ].join(' ')}
        role="menu"
        aria-hidden={!open}
      >
        <ul className="py-2">
          {NAV_LINK_KEYS.map((key, i) => {
            const path = pathForKey(key);
            return (
              <li
                key={key}
                className={open ? 'nav-menu-drop-item' : undefined}
                style={open ? { animationDelay: `${45 + i * 32}ms` } : undefined}
              >
                <Link
                  href={`/${locale}/${path}`}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-[10px] lg:text-[11px] uppercase font-semibold text-ink/55 hover:text-apricot hover:bg-apricot/5 transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-ui)', letterSpacing: locale === 'ar' ? '0' : '0.2em' }}
                >
                  {t(key)}
                  {key === 'wishlist' && wishCount > 0 && (
                    <span className="ms-1.5 text-[9px] text-apricot">({wishCount})</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
