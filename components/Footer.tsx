"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#F6F0EA] text-black/70 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t("contact")}</h3>
            <p className=" space-y-2 text-black/70">
              <span className="font-medium text-black/70">{t("email")}:</span>{" "}
              <a
                href={`mailto:annemarie.fwi@gmail.com`}
                className="text-black/70 underline cursor-pointer hover:text-[#AF2027] transition-colors"
              >
                Cdbchoeur@gmail.com
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t("followUs")}</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/ChoraledeBonsChoeurs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 hover:text-[#0866FF] transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/choraledebonschoeurs.sbh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 hover:text-[#F116BA] transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#AF2027]">
              Chorale de Bons Chœurs
            </h3>
            <p className="text-black/70">Saint-Barthélemy</p>
          </div>
        </div>
        <p className="text-center text-gray-500">
          © {new Date().getFullYear()} Chorale de Bons Chœurs. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
