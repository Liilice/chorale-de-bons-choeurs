'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TicketingModal } from './TicketingModal';

interface Concert {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
}

export function Concerts() {
  const t = useTranslations('concerts');
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  // Sample concert data
  const concerts: Concert[] = [
    {
      id: 1,
      title: "Concert de Noël",
      date: "2026-12-20",
      time: "19:00",
      venue: "Église de Saint-Barthélemy",
      price: 15
    },
    {
      id: 2,
      title: "Concert de Printemps",
      date: "2027-03-15",
      time: "18:30",
      venue: "Église de Saint-Barthélemy",
      price: 15
    }
  ];

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
              {concerts.map((concert) => (
                <div 
                  key={concert.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {concert.title}
                    </h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">{t('date')}:</span>
                        <span>{formatDate(concert.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">{t('time')}:</span>
                        <span>{concert.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">{t('venue')}:</span>
                        <span>{concert.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">{t('price')}:</span>
                        <span>{concert.price}€</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedConcert(concert)}
                      className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {t('buyTickets')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              {t('noUpcoming')}
            </p>
          )}
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
