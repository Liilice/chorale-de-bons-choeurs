"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { TicketingModal } from "./TicketingModal";
import Image from "next/image";

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
    price: 15,
  },
];

export function Concerts() {
  const t = useTranslations("concerts");
  const tVenue = useTranslations("venue");

  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <section id="concerts" className="px-20 py-10 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            {t("title")}
          </h2>
          {concerts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
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
                      <span className="font-medium mr-2">{t("date")}:</span>
                      <span>{formatDate(concerts[0].date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t("time")}:</span>
                      <span>{concerts[0].time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t("venue")}:</span>
                      <span>{concerts[0].venue}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">{t("price")}:</span>
                      <span>{concerts[0].price}€</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConcert(concerts[0])}
                    className="w-full px-6 py-3 bg-[#D2232A] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {t("buyTickets")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              {t("noUpcoming")}
            </p>
          )}
        </div>
        <div className="container mt-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            {tVenue("title")}
          </h2>

          <div className="flex flex-row gap-2.5">
            <div>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {tVenue("description")}
              </p>
              <h3 className="font-medium text-gray-900 mb-2">
                {tVenue("address")}
              </h3>
              <p className="text-gray-700">{tVenue("addressValue")}</p>
            </div>
            <Image
              src={"/eglise.png"}
              alt={"église"}
              width={700}
              height={400}
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
