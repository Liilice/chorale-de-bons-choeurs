"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";

export function Header() {
  const t = useTranslations("navigation");
  const tAbout = useTranslations("about");

  const params = useParams();
  const locale = params.locale as string;

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "fr" : "en";
    window.location.href = `/${newLocale}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0  z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 mx-auto px-4 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between">
      {/* <div>
          <Image src="/logo.png" alt="Logo de la chorale" width={75} height={75}/>
        </div> */}
      <h2 className="text-2xl font-bold text-[#AF2027] italic">
        {tAbout("title")}
      </h2>
      <div className="flex items-center gap-6">
        <a
          href="#about"
          className="text-gray-700 transition-colors cursor-pointer hover:underline hover:text-[#AF2027] hover:underline-offset-8 "
        >
          {t("about")}
        </a>
        <a
          href="#concerts"
          className="text-gray-700  transition-colors cursor-pointer hover:underline hover:text-[#AF2027] hover:underline-offset-8"
        >
          {t("concerts")}
        </a>

        <a
          href="https://www.facebook.com/ChoraledeBonsChoeurs"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium rounded-lg text-gray-700 hover:underline hover:text-[#0866FF] hover:underline-offset-8 transition-colors inline-block cursor-pointer"
        >
          {tAbout("facebook")}
        </a>
        <button
          onClick={toggleLocale}
          className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 transition-colors cursor-pointer"
        >
          {locale === "en" ? "FR" : "EN"}
        </button>
      </div>
    </nav>
  );
}
