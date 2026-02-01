'use client';

import { useTranslations } from 'next-intl';

export function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto text-center leading-relaxed">
          {t('description')}
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600 mb-2">50+</div>
            <div className="text-gray-600">{t('members')}</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600 mb-2">15</div>
            <div className="text-gray-600">{t('years')}</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600 mb-2">6+</div>
            <div className="text-gray-600">{t('concerts')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
