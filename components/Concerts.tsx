'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TicketingModal } from './TicketingModal';
import Image from 'next/image';

export interface Concert {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
}

// Sample concert data
export const concerts: Concert[] = [
  {
    id: 1,
    title: "Concert de Noël",
    date: "2026-12-20",
    time: "19:00",
    venue: "Église de Saint-Barthélemy",
    price: 15
  },
];

export function Concerts() {
  const t = useTranslations('concerts');
  const tVenue = useTranslations('venue');

  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <section id="concerts" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            {t('title')}
          </h2>
          {concerts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div
                key={concerts[0].id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {concerts[0].title}
                  </h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t('date')}:</span>
                      <span>{formatDate(concerts[0].date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t('time')}:</span>
                      <span>{concerts[0].time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t('venue')}:</span>
                      <span>{concerts[0].venue}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t('price')}:</span>
                      <span>{concerts[0].price}€</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConcert(concerts[0])}
                    className="w-full px-6 py-3 bg-[#D2232A] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {t('buyTickets')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              {t('noUpcoming')}
            </p>
          )}
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            {tVenue('title')}
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-8 text-center leading-relaxed">
              {tVenue('description')}
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">{tVenue('address')}</h3>
                <p className="text-gray-700">{tVenue('addressValue')}</p>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <Image src={'/eglise.png'} alt={'église'} width={100} height={100} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedConcert && (
        <TicketingModal
          concert={selectedConcert}
          onClose={() => setSelectedConcert(null)}
        />
      )}
    </>
  );
}
