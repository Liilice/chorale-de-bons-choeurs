'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  const t = useTranslations('navigation');
  const params = useParams();
  const locale = params.locale as string;

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'fr' : 'en';
    window.location.href = `/${newLocale}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-2xl font-bold text-gray-900">
          {t('home')}
        </Link>
        <div className="flex items-center gap-6">
          <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">
            {t('about')}
          </a>
          <a href="#concerts" className="text-gray-700 hover:text-gray-900 transition-colors">
            {t('concerts')}
          </a>
          <a href="#venue" className="text-gray-700 hover:text-gray-900 transition-colors">
            {t('contact')}
          </a>
          <button
            onClick={toggleLocale}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </nav>
    </header>
  );
}
