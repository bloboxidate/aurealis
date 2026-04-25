import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { ContactForm } from '@/components/ContactForm';

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-ink/75 mb-10 max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
        {t('intro')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div className="space-y-4 text-sm text-ink/70" style={{ fontFamily: 'var(--font-body)' }}>
          <p className="whitespace-pre-line">{t('address')}</p>
          <p>
            <span className="text-muted" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('hours_label')}
            </span>
            <br />
            {t('hours')}
          </p>
          <p>
            <a href="mailto:hello@aurealis.com" className="text-apricot hover:underline">
              {t('email_link')}
            </a>
          </p>
        </div>
        <ContactForm />
      </div>
    </ContentPageLayout>
  );
}
