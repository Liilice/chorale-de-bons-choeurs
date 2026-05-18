import { useTranslations } from "next-intl";

const Confirmation = () => {
  const t = useTranslations("confirm");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-green-600"
          aria-hidden
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="mb-4 text-3xl font-bold text-gray-900">{t("title")}</h1>

      <p className="mb-3 text-lg text-gray-700">{t("message")}</p>

      <p className="mb-6 text-gray-600">{t("subMessage")}</p>

      <div className="rounded-lg bg-gray-50 px-6 py-4 text-sm text-gray-600">
        {t("spam")}
      </div>
    </div>
  );
};

export default Confirmation;
