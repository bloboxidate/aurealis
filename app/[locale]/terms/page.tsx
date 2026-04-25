import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';

export default async function TermsPage() {
  const t = await getTranslations('legal');
  const sectionKeys = ['terms_p1', 'terms_p2', 'terms_p3', 'terms_p4', 'terms_p5'] as const;

  return (
    <ContentPageLayout title={t('terms_title')} kicker={t('last_updated')}>
      <div className="space-y-4 text-sm text-ink/75 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
        {sectionKeys.map((key) => (
          <p key={key}>{t(key)}</p>
        ))}
      </div>
    </ContentPageLayout>
  );
}
