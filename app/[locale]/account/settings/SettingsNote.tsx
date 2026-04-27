'use client';

import { useTranslations } from 'next-intl';

export function SettingsNote() {
  const t = useTranslations('accountSettings');

  return (
    <div
      className="rounded-2xl border border-border/70 bg-light/20 px-5 py-4 text-sm text-ink/70"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {t('newsletter_note')}
    </div>
  );
}
