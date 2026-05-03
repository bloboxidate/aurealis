'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  const t = useTranslations('errorPage');
  const locale = useLocale();

  return (
    <>
      <Navbar />
      <div className="min-h-[65vh] bg-petal flex flex-col items-center justify-center px-4 pt-32 sm:pt-36 pb-16 text-center max-w-lg mx-auto">
        <h1
          className="text-2xl sm:text-3xl font-light italic text-ink mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('title')}
        </h1>
        <p className="text-ink/70 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
          {t('body')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex justify-center px-8 py-3.5 rounded-full bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('retry')}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex justify-center px-8 py-3.5 rounded-full border-2 border-ink/15 text-ink/80 text-[10px] tracking-[0.3em] uppercase font-bold"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('cta_home')}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
