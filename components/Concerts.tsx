"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { TicketingModal } from "./TicketingModal";
import Image from "next/image";

export interface Concert {
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
}

export const concerts: Concert[] = [
  {
    title: "Concert de Printemps",
    date: "2026-04-10",
    time: "20:00",
    venue: "Eglise Anglicane de Gustavia",
    price: 15,
  },
  {
    title: "Concert de Printemps",
    date: "2026-04-12",
    time: "18:30",
    venue: "Eglise Anglicane de Gustavia",
    price: 15,
  },
];

export function Concerts() {
  const t = useTranslations("concerts");
  const tVenue = useTranslations("venue");

  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
  
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <>
      <section id="concerts" className="px-8 py-10 lg:px-16 ">
        <span className="font-bold uppercase tracking-[0.2em] text-sm text-[#AF2027]">
          Calendrier Musical
        </span>
        <h2 className="mt-4 mb-4 text-5xl text-on-background">{t("title")}</h2>
        {concerts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {concerts.map((concert, key) => (
              <div
                key={concert.title + key}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {concert.title}
                  </h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t("date")}:</span>
                      <span>{formatDate(concert.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t("time")}:</span>
                      <span>{concert.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t("venue")}:</span>
                      <span>{concert.venue}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t("price")}:</span>
                      <span>{concert.price}€</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConcert(concert)}
                    className="w-full px-6 py-3 bg-[#D2232A] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {t("buyTickets")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">{t("noUpcoming")}</p>
        )}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Content */}
          <div className="w-full flex flex-col justify-center">
            <h2 className="mt-4 mb-4 text-5xl text-on-background">
              {tVenue("title")}
            </h2>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {tVenue("description")}
            </p>

            <div className="bg-[#F6F0EA] px-10 py-5">
              <h3 className="font-semibold text-xl text-gray-900 mb-2">
                {tVenue("address")}
              </h3>

              <p className="text-gray-700">
                Eglise Anglicane de Gustavia
                <br />
                Rue Samuel Fahlberg, Gustavia 97133, Saint-Barthélemy
              </p>
            </div>

            <div className="mt-4">
              <a
                href="https://www.google.com/maps?q=Rue+Samuel+Fahlberg,+Gustavia+97133,+Saint-Barthélemy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg font-bold uppercase text-[#D2232A] hover:underline"
              >
                <Image src="/ping.svg" alt="map" width={25} height={25} />
                {tVenue("map")}
              </a>
            </div>
            <div className="flex flex-row justify-start items-center">
              <Image
                src="/logo_withoutBG.png"
                alt="map"
                width={100}
                height={100}
              />
              <Image
                src="/flag_saint_barthelemy.png"
                alt="map"
                width={150}
                height={150}
              />
            </div>
          </div>
          {/* Image */}
          <div className="w-full h-full">
            <Image
              src="/eglise.png"
              alt="Église"
              width={700}
              height={400}
              className="w-full h-full object-cover rounded-xl"
            />
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
