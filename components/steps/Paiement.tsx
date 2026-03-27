const Paiement = ({
  showPayment,
  error
}: {
  showPayment: boolean;
  error:string;
}) => {
  return (
    showPayment && (
      <div>
        <div id="sumup-card" className="min-h-[120px]" />
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    )
  );
};

export default Paiement;
