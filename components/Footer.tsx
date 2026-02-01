'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('contact')}</h3>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium">{t('email')}:</span> contact@chorale-bons-choeurs.fr
              </p>
              <p className="text-gray-300">
                <span className="font-medium">{t('phone')}:</span> +590 590 XX XX XX
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t('followUs')}</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Chorale de Bons Chœurs</h3>
            <p className="text-gray-300">Saint-Barthélemy</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Chorale de Bons Chœurs. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
