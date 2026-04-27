import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { SettingsNote } from './SettingsNote';

export default async function AccountSettingsPage() {
  const t = await getTranslations('accountSettings');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-ink/80 leading-relaxed mb-6" style={{ fontFamily: 'var(--font-body)' }}>
        {t('body')}
      </p>
      <SettingsNote />
    </ContentPageLayout>
  );
}
