'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function ContactForm() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-5 max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {sent ? (
        <p className="text-sm text-sage font-medium" style={{ fontFamily: 'var(--font-body)' }}>
          {t('form_success')}
        </p>
      ) : (
        <>
          <div>
            <label htmlFor="name" className="block text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('label_name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-petal text-ink text-sm focus:outline-none focus:ring-2 focus:ring-apricot/30"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('label_email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-petal text-ink text-sm focus:outline-none focus:ring-2 focus:ring-apricot/30"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('label_message')}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-border bg-petal text-ink text-sm focus:outline-none focus:ring-2 focus:ring-apricot/30 resize-y min-h-[120px]"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 rounded-full bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-apricot-deep transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('form_submit')}
          </button>
        </>
      )}
    </form>
  );
}
