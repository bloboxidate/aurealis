import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import Link from 'next/link';

export default async function AccessibilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('accessibility');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <div className="space-y-5 text-ink/80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <p>{t('p3')}</p>
        <p>
          {t('contact_lead')}{' '}
          <Link href={`/${locale}/contact`} className="text-apricot hover:underline">
            {t('contact_cta')}
          </Link>
        </p>
      </div>
    </ContentPageLayout>
  );
}
