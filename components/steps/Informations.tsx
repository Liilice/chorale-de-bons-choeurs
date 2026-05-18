import { useTranslations } from "next-intl";

const Informations = ({
  quantities,
  updateQuantity,
  hasTickets,
  loading,
  customerName,
  customerEmail,
  setCustomerEmail,
  setCustomerName,
  handleCheckout,
  error,
}: {
  quantities: number;
  updateQuantity: (delta: number) => void;
  hasTickets: boolean;
  loading: boolean;
  customerName: string;
  customerEmail: string;
  setCustomerEmail: React.Dispatch<React.SetStateAction<string>>;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  handleCheckout: () => void;
  error: string;
}) => {
  const t = useTranslations("ticketing");

  const total = quantities * 15;

  return (
    <form className="p-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("name")} :
      </label>
      <input
        type="text"
        required
        className="mt-2 w-full px-2 py-2 border-gray-600  border-[1px] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2232A]"
        placeholder={t("name")}
        onChange={(e) => setCustomerName(e.target.value)}
      />{" "}
      <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
        {t("email")} :
      </label>
      <input
        type="email"
        required
        className="mt-2 w-full px-2 py-2 border-gray-600  border-[1px] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D2232A]"
        placeholder={t("email")}
        onChange={(e) => setCustomerEmail(e.target.value)}
      />
      <div className="space-y-4 mt-6 flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div className="flex-1">
          <div className="font-medium text-gray-900">{t("adult")}</div>
          <div className="text-gray-600">15€</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              updateQuantity(-1);
            }}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">
            {quantities}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              updateQuantity(1);
            }}
            className="w-8 h-8 rounded-full bg-[#D2232A] hover:bg-[#AF2027] text-white font-bold"
          >
            +
          </button>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-xl font-bold mb-4">
          <span>{t("total")}:</span>
          <span>{total.toFixed(2)}€</span>
        </div>

        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleCheckout();
          }}
          disabled={!hasTickets || loading || !customerEmail || !customerName}
          className="w-full px-6 py-4 bg-[#D2232A] text-white font-medium rounded-lg hover:bg-[#AF2027] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? t("loading") : t("checkout")}
        </button>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </form>
  );
};

export default Informations;
