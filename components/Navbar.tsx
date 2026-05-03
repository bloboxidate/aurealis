'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import BrandWordmark from '@/components/BrandWordmark';
import { NavMenuDropdown } from '@/components/NavMenuDropdown';
import { UserAuthNav, UserAuthNavMobile } from '@/components/UserAuthNav';
import { useCartStore } from '@/lib/store';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const cartCount = useCartStore((s) => s.count());
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const otherLocale = locale === 'en' ? 'ar' : 'en';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? 'bg-petal/90 backdrop-blur-xl nav-elevate border-b border-border/40'
          : 'bg-petal/40 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[1600px] mx-auto pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))] lg:pl-[max(2.5rem,env(safe-area-inset-left,0px))] lg:pr-[max(2.5rem,env(safe-area-inset-right,0px))]">
        {/*
          1fr · auto · 1fr grid guarantees the logo column is always mathematically centred
          regardless of how wide the left (menu) and right (auth/cart) sides are.
          Logo lives in a real grid cell — avoids iOS Safari paint bugs with backdrop-blur.
        */}
        <div className="relative grid w-full min-h-28 grid-cols-[1fr_auto_1fr] items-center sm:min-h-32 md:min-h-36">
          <div className="relative z-20 flex shrink-0 items-center">
            <div className="hidden md:block">
              <NavMenuDropdown />
            </div>
            <button
              type="button"
              className="md:hidden text-ink/50 hover:text-apricot min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation rounded-lg -ms-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                {menuOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" strokeLinecap="round" />
                    <line x1="3" y1="17" x2="21" y2="17" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <div className="relative z-10 flex items-center justify-center isolate px-2">
            <Link
              href={`/${locale}`}
              className="group flex items-center justify-center outline-none ring-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hover:scale-[1.02] h-20 w-[240px] sm:h-24 sm:w-[340px] md:h-28 md:w-[420px] lg:w-[480px] xl:h-32 xl:w-[540px]"
            >
              <BrandWordmark
                src="/logo-black.png"
                blend="none"
                width={480}
                height={154}
                contained
                layoutIntrinsic
                boxClassName="transition-transform duration-500 h-full w-full"
                className="opacity-[0.88] [filter:sepia(0.12)_saturate(0.9)_contrast(1.05)]"
                sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, (max-width: 1024px) 340px, 440px"
                priority
              />
            </Link>
          </div>

          <div className="relative z-20 flex shrink-0 items-center justify-end justify-self-end gap-1.5 sm:gap-2 md:gap-4">
            <UserAuthNav />
            <Link
              href={`/${otherLocale}`}
              className="shrink-0 min-h-10 min-w-10 sm:min-h-12 sm:min-w-12 inline-flex items-center justify-center rounded-full border border-ink/12 bg-petal/50 px-2 sm:px-4 text-[10px] sm:text-sm uppercase font-bold text-ink/60 hover:text-apricot hover:border-apricot/40 transition-colors"
              style={{ fontFamily: 'var(--font-ui)', letterSpacing: otherLocale === 'ar' ? '0' : '0.2em' }}
            >
              {otherLocale === 'ar' ? 'عربي' : 'EN'}
            </Link>
            <Link
              href={`/${locale}/search`}
              aria-label={t('search')}
              className="text-ink/40 hover:text-apricot transition-colors min-w-[44px] min-h-[44px] items-center justify-center touch-manipulation hidden sm:flex"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" strokeLinecap="round" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/cart`}
              aria-label="Cart"
              className="relative text-ink/45 hover:text-apricot transition-colors min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] inline-flex items-center justify-center -me-0.5 sm:-me-0 touch-manipulation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-apricot text-petal text-[8px] font-extrabold rounded-full flex items-center justify-center" style={{ fontFamily: 'var(--font-ui)' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border/60 bg-petal/98 backdrop-blur-lg px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] max-h-[min(80dvh,520px)] overflow-y-auto overscroll-contain touch-pan-y">
          <UserAuthNavMobile onNavigate={() => setMenuOpen(false)} />
          <nav className="space-y-1 pt-2">
            {(
              [
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
              ] as const
            ).map((key) => {
              const path = key === 'track_order' ? 'track-order' : key;
              return (
                <Link
                  key={key}
                  href={`/${locale}/${path}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3.5 -mx-1 px-1 text-sm uppercase font-semibold text-ink/60 active:text-apricot"
                  style={{ fontFamily: 'var(--font-ui)', letterSpacing: locale === 'ar' ? '0' : '0.25em' }}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
