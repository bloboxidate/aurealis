import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <div className="space-y-6 text-ink/80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <h2
          className="text-2xl font-light italic text-ink pt-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('values_title')}
        </h2>
        <ul className="list-disc list-inside space-y-2 text-ink/75">
          <li>{t('v1')}</li>
          <li>{t('v2')}</li>
          <li>{t('v3')}</li>
        </ul>
        <p className="text-sm text-muted pt-2">{t('est')}</p>
      </div>
    </ContentPageLayout>
  );
}
