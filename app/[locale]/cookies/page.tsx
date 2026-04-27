import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';

export default async function CookiesPage() {
  const t = await getTranslations('cookies');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-xs text-muted mb-6" style={{ fontFamily: 'var(--font-ui)' }}>
        {t('last_updated')}
      </p>
      <div className="space-y-5 text-ink/80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <p>{t('p3')}</p>
      </div>
    </ContentPageLayout>
  );
}
