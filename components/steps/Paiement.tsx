const Paiement = ({
  showPayment,
  paiementError,
  setPaiementError,
}: {
  showPayment: boolean;
  paiementError: boolean;
  setPaiementError: (value: boolean) => void;
}) => {
  const handleRetry = () => {
    setPaiementError(false);
  };

  return (
    showPayment && (
      <div className="relative">
        {/* SumUp Card */}
        <div id="sumup-card" className="min-h-[120px]" />

        {/* Overlay erreur */}
        {paiementError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center px-6">
              
              {/* Icon */}
              <div className="mb-4 flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
                <span className="text-red-600 text-3xl font-bold">!</span>
              </div>

              {/* Title */}
              <p className="text-red-500 uppercase text-sm font-semibold tracking-widest mb-2">
                Transaction échouée
              </p>

              {/* Message */}
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Le paiement n'a pas pu être traité
              </h2>

              {/* Button */}
              <button
                onClick={handleRetry}
                className="mt-2 px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Réessayer le paiement
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Paiement;