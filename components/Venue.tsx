"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export function Venue() {
  const tVenue = useTranslations("venue");

  return (
    <section id="venue" className="px-8 py-10 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
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
              <Image src="/ping.svg" alt="" width={25} height={25} aria-hidden />
              {tVenue("map")}
            </a>
          </div>

          <div className="flex flex-row justify-start items-center">
            <Image
              src="/logo_withoutBG.png"
              alt="Logo de la chorale"
              width={100}
              height={100}
            />
            <Image
              src="/flag_saint_barthelemy.png"
              alt="Drapeau de Saint-Barthélemy"
              width={150}
              height={150}
            />
          </div>
        </div>

        <div className="w-full h-full">
          <Image
            src="/eglise.png"
            alt="Église Anglicane de Gustavia"
            width={700}
            height={400}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
