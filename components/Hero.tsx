'use client';

import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-black mb-6">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
        <a
          href="#concerts"
          className="inline-block px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  );
}
