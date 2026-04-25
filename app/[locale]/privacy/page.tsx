import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';

export default async function PrivacyPage() {
  const t = await getTranslations('legal');
  const sectionKeys = ['privacy_p1', 'privacy_p2', 'privacy_p3', 'privacy_p4', 'privacy_p5'] as const;

  return (
    <ContentPageLayout title={t('privacy_title')} kicker={t('last_updated')}>
      <div className="space-y-4 text-sm text-ink/75 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
        {sectionKeys.map((key) => (
          <p key={key}>{t(key)}</p>
        ))}
      </div>
    </ContentPageLayout>
  );
}
