import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { TrackOrderForm } from './TrackOrderForm';

export default async function TrackOrderPage() {
  const t = await getTranslations('trackOrder');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-sm text-ink/75 mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
        {t('intro')}
      </p>
      <TrackOrderForm />
    </ContentPageLayout>
  );
}
