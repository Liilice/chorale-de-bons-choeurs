"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Concert, concerts } from "./Concerts";
import { useState } from "react";
import { TicketingModal } from "./TicketingModal";

export function About() {
  const t = useTranslations("about");
  const tConcerts = useTranslations("concerts");
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent z-10" />
          <Image
            src="/hero_v3.jpeg"
            alt="Photo des artistes de notre chorale"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 sm:gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="relative flex flex-row items-center gap-4">
              <h1 className="text-2xl sm:text-5xl md:text-6xl text-gray-900 leading-[1.05] tracking-tight">
                {t("title").split(" ").slice(0, 2).join(" ")} <br />
                <span className="italic text-[#AF2027]">
                  {t("title").split(" ").slice(2).join(" ")}
                </span>
              </h1>
              <Image
                src="/logo_withoutBG.png"
                alt="Logo de la chorale"
                width={100}
                height={100}
              />
            </div>

            <p className="text-md md:text-2xl text-black max-w-3xl leading-relaxed">
              {t("description")}
            </p>

            <button
              onClick={() => setSelectedConcert(concerts[0])}
              className="px-8 py-4 bg-[#AF2027] text-white font-bold uppercase tracking-widest rounded-sm shadow-lg hover:brightness-110 transition-all duration-300"
            >
              {tConcerts("buyTickets")}
            </button>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-4 text-gray-700">
              <div className="flex items-center gap-2">
                <Image
                  src="/music.svg"
                  alt="Icône musique"
                  width={22}
                  height={22}
                />
                <span>Organisation à but non lucratif</span>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/ping.svg"
                  alt="Icône localisation"
                  width={22}
                  height={22}
                />
                <span>Gustavia, Saint-Barthélemy</span>
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
