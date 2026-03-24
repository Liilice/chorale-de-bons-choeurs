'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Concert, concerts } from './Concerts';
import { useState } from 'react';
import { TicketingModal } from './TicketingModal';

export function About() {
  const t = useTranslations('about');
  const tConcerts = useTranslations('concerts');
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  return (
    <>
      <section className='px-20 py-10'>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center underline decoration-[#D2232A] decoration-4 underline-offset-4">
          {t('title')}
        </h2>
        <div className="grid grid-cols-2 gap-10 place-items-start">
          <div className='w-full h-full flex justify-end items-start'>
            <Image src="/hero_v2.jpg" alt="Photo des artistes de notre chorale" width={700} height={400} className='rounded-xl' />
          </div>
          <div className='w-full h-full flex flex-col justify-between items-start'>
            <div className='flex flex-col gap-10'>
              <p className="max-w-125 text-lg text-gray-700 text-pretty leading-relaxed">
                {t('description')}
              </p>
              <div className='w-full flex gap-6'>
                <div className='flex justify-start items-center gap-2'>
                  <Image src={'/music.svg'} alt={'icon of a location'} width={24} height={24} />
                  <span>Organisation à but non lucratif</span>
                </div>
                <div className='flex justify-start items-center gap-2'>
                  <Image src={'/ping.svg'} alt={'icon of a location'} width={24} height={24} />
                  <span>Gustavia, Saint Barthélemy</span>
                </div>
              </div>
            </div>
            <div className='flex gap-6'>
              <button
                onClick={() => setSelectedConcert(concerts[0])}
                className="px-6 py-3 border border-[#D2232A] bg-[#d2232917] text-black font-medium rounded-lg hover:bg-[#D2232A] hover:text-white transition-colors"
              >
                {tConcerts('buyTickets')}
              </button>
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
