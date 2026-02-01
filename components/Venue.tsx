'use client';

import { useTranslations } from 'next-intl';

export function Venue() {
  const t = useTranslations('venue');

  return (
    <section id="venue" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          {t('title')}
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 mb-8 text-center leading-relaxed">
            {t('description')}
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">{t('address')}</h3>
              <p className="text-gray-700">{t('addressValue')}</p>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
