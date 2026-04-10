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
      <section className="pt-10">
        <div className="max-w-[90%] mx-auto w-full flex flex-col gap-6 md:flex-row md:gap-12">
          {/* IMAGE EN DESSOUS */}
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/hero_v3.jpeg"
              alt="Photo des artistes de notre chorale"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* TEXTE AU-DESSUS */}
          <div className="space-y-8">
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-2xl sm:text-5xl text-gray-900 leading-[1.05] tracking-tight">
                {t("title").split(" ").slice(0, 2).join(" ")} <br />
                <span className="italic text-[#AF2027]">
                  {t("title").split(" ").slice(2).join(" ")}
                </span>
              </h1>
              <Image
                src="/logo_withoutBG.png"
                alt="Logo de la chorale"
                width={75}
                height={75}
              />
            </div>

            <p className="text-md md:text-xl text-black max-w-3xl leading-relaxed">
              {t("description")}
            </p>

            <button
              onClick={() => setSelectedConcert(concerts[0])}
              className="px-8 py-4 bg-[#AF2027] text-white font-bold uppercase tracking-widest rounded-sm shadow-lg hover:brightness-110 transition-all duration-300"
            >
              {tConcerts("buyTickets")}
            </button>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-700">
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
