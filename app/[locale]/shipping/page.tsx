import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';

export default async function ShippingPage() {
  const t = await getTranslations('shipping');
  const blocks = (['intro', 'delivery', 'returns', 'int'] as const).map((key) => t(key));

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <div className="space-y-6 text-ink/80 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
        {blocks.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </ContentPageLayout>
  );
}
