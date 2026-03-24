'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Concert {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
}

interface TicketingModalProps {
  concert: Concert;
  onClose: () => void;
}

export function TicketingModal({ concert, onClose }: TicketingModalProps) {
  const t = useTranslations('ticketing');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    adult: 0,
    student: 0,
    child: 0,
    senior: 0
  });

  const ticketTypes: TicketType[] = [
    { id: 'adult', name: t('adult'), price: concert.price },
    { id: 'student', name: t('student'), price: concert.price * 0.75 },
    { id: 'child', name: t('child'), price: concert.price * 0.5 },
    { id: 'senior', name: t('senior'), price: concert.price * 0.8 }
  ];

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const total = ticketTypes.reduce((sum, ticket) => {
    return sum + (quantities[ticket.id] || 0) * ticket.price;
  }, 0);

  const hasTickets = Object.values(quantities).some(q => q > 0);

  const handleCheckout = () => {
    if (!hasTickets) {
      alert(t('selectTickets'));
      return;
    }
    alert(`${t('total')}: ${total.toFixed(2)}€`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">{concert.title}</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {ticketTypes.map(ticket => (
              <div 
                key={ticket.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{ticket.name}</div>
                  <div className="text-gray-600">{ticket.price.toFixed(2)}€</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(ticket.id, -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {quantities[ticket.id] || 0}
                  </span>
                  <button
                    onClick={() => updateQuantity(ticket.id, 1)}
                    className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xl font-bold mb-4">
              <span>{t('total')}:</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!hasTickets}
              className="w-full px-6 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {t('checkout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
