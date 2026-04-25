'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

const BRAND = ['#f8ae7f', '#f7d595', '#a5bf97', '#bfb5e8', '#fff9f3'] as const;

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="border-t border-border/60 bg-petal pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 lg:pt-20 pb-16 lg:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          <div className="max-w-md space-y-5 lg:col-span-1">
            <div className="w-44 sm:w-52 max-w-full opacity-95">
              <Image
                src="/logo-black.png"
                alt="Auréalis"
                width={320}
                height={96}
                className="w-full h-auto object-contain object-left"
                sizes="(max-width: 640px) 176px, 208px"
              />
            </div>
            <p className="text-ink/55 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              {t('tagline')}
            </p>
            <div className="flex gap-1.5 pt-1">
              {BRAND.map((c) => (
                <span key={c} className="h-1.5 w-6 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-[10px] tracking-[0.45em] uppercase font-bold text-apricot mb-4"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {t('site_column')}
            </p>
            <ul className="space-y-3">
              {(
                [
                  ['shop', `/${locale}/shop`],
                  ['about', `/${locale}/about`],
                  ['contact', `/${locale}/contact`],
                  ['account', `/${locale}/account`],
                ] as const
              ).map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-ink/60 text-sm hover:text-apricot transition-colors"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {t(key as 'shop')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className="text-[10px] tracking-[0.45em] uppercase font-bold text-apricot mb-4"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {t('help')}
            </p>
            <ul className="space-y-3">
              {(
                [
                  ['faq', `/${locale}/faq`],
                  ['shipping', `/${locale}/shipping`],
                ] as const
              ).map(([key, href]) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-ink/60 text-sm hover:text-apricot transition-colors"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {t(key as 'faq')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className="text-[10px] tracking-[0.45em] uppercase font-bold text-apricot mb-4"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Legal
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-ink/60 text-sm hover:text-apricot transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-ink/60 text-sm hover:text-apricot transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink/35" style={{ fontFamily: 'var(--font-ui)' }}>
          <span>{t('copyright')}</span>
          <span className="italic text-ink/25" style={{ fontFamily: 'var(--font-display)' }}>
            Auréalis
          </span>
        </div>
      </div>
    </footer>
  );
}
