'use client';

import { useTranslations } from 'next-intl';

type Props = { variant?: 'default' | 'dark' };

export default function NewsletterForm({ variant = 'default' }: Props) {
  const t = useTranslations('home');
  const dark = variant === 'dark';

  return (
    <form
      className="flex flex-col sm:flex-row max-w-md mx-auto gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder={t('newsletter_placeholder')}
        className={`flex-1 px-5 py-4 text-sm border focus:outline-none transition-colors rounded-full sm:rounded-l-full sm:rounded-r-none ${
          dark
            ? 'bg-ink-deep/50 border-petal/20 text-petal placeholder-petal/35 focus:border-apricot'
            : 'bg-petal text-ink placeholder-muted/60 border-border focus:border-apricot'
        }`}
        style={{ fontFamily: 'var(--font-ui)' }}
      />
      <button
        type="submit"
        className={`px-8 py-4 text-[10px] tracking-[0.3em] uppercase font-bold transition-colors duration-300 whitespace-nowrap rounded-full sm:rounded-l-none sm:rounded-r-full ${
          dark
            ? 'bg-apricot text-petal hover:bg-apricot-deep'
            : 'bg-ink text-petal hover:bg-apricot'
        }`}
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {t('newsletter_cta')}
      </button>
    </form>
  );
}
