import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';

const FAQ_KEYS = [
  { q: 'q1' as const, a: 'a1' as const },
  { q: 'q2' as const, a: 'a2' as const },
  { q: 'q3' as const, a: 'a3' as const },
  { q: 'q4' as const, a: 'a4' as const },
  { q: 'q5' as const, a: 'a5' as const },
];

export default async function FaqPage() {
  const t = await getTranslations('faq');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <div className="space-y-0 divide-y divide-border/80">
        {FAQ_KEYS.map(({ q, a }) => (
          <details
            key={q}
            className="group py-4 sm:py-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 text-ink font-medium"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span>{t(q)}</span>
              <span
                className="text-apricot text-xl leading-none transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <p
              className="mt-3 text-sm text-ink/70 leading-relaxed pl-0"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t(a)}
            </p>
          </details>
        ))}
      </div>
    </ContentPageLayout>
  );
}
