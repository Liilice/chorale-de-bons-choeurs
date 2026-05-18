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
  // {
  //   title: "Concert de Printemps",
  //   date: "2026-04-10",
  //   time: "20:00",
  //   venue: "Eglise Anglicane de Gustavia",
  //   price: 15,
  // },
  // {
  //   title: "Concert de Printemps",
  //   date: "2026-04-12",
  //   time: "18:30",
  //   venue: "Eglise Anglicane de Gustavia",
  //   price: 15,
  // },
];

export function Concerts() {
  const t = useTranslations("concerts");

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
                    className="w-full px-6 py-3 bg-[#D2232A] text-white font-medium rounded-lg hover:bg-[#AF2027] transition-colors"
                  >
                    {t("buyTickets")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-[#D2232A]/15 bg-gradient-to-br from-[#F6F0EA] via-white to-[#F6F0EA] px-6 py-14 sm:px-12 lg:px-20 lg:py-20 shadow-sm">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#D2232A]/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-[#D2232A]/5 blur-3xl" />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-[#D2232A]/20">
                <Image
                  src="/music.svg"
                  alt=""
                  width={32}
                  height={32}
                  aria-hidden
                />
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">
                {t("noUpcomingTitle")}
              </h3>

              <p className="mt-4 max-w-xl text-gray-600 leading-relaxed">
                {t("noUpcoming")}
              </p>

              <a
                href="https://www.facebook.com/ChoraledeBonsChoeurs"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D2232A] px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-[#AF2027] hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.8 8.43-4.94 8.43-9.94Z" />
                </svg>
                {t("followFacebook")}
              </a>
            </div>
          </div>
        )}
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
