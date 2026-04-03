import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={"fr"}>
      <head>
        <title>Chorale de Bons Chœurs - Admin</title>
        <meta
          name="description"
          content="Site vitrine et billetterie en ligne pour une chorale de Saint Barthélémy - panel d'administration"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
