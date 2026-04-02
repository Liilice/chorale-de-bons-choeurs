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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 h-20">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* <div>
          <Image src="/logo.png" alt="Logo de la chorale" width={75} height={75}/>
        </div> */}
        <a
          href="https://www.facebook.com/ChoraledeBonsChoeurs"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-[#0866FF] bg-[#0867ff1d] text-black font-medium rounded-lg hover:bg-[#0866FF] hover:text-white transition-colors inline-block text-center cursor-pointer"
        >
          {tAbout("facebook")}
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#about"
            className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            {t("about")}
          </a>
          <a
            href="#concerts"
            className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            {t("concerts")}
          </a>
          <button
            onClick={toggleLocale}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 transition-colors cursor-pointer"
          >
            {locale === "en" ? "FR" : "EN"}
          </button>
        </div>
      </nav>
    </header>
  );
}
