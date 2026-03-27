"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import PaiementModal from "./steps/Paiement";
import Confirmation from "./steps/Confirmation";
import Informations from "./steps/Informations";

declare global {
  interface Window {
    SumUpCard?: {
      mount: (options: {
        id: string;
        checkoutId: string;
        onResponse: (type: string, body: unknown) => void;
      }) => void;
    };
  }
}

interface Concert {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
}

interface TicketingModalProps {
  concert: Concert;
  onClose: () => void;
}

export function TicketingModal({ concert, onClose }: TicketingModalProps) {
  const t = useTranslations("ticketing");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    adult: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [step, setStep] = useState<"selection" | "payment" | "confirm">(
    "selection"
  );
  const ticketTypes: TicketType[] = [
    { id: "adult", name: t("adult"), price: concert.price },
  ];

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const hasTickets = Object.values(quantities).some((q) => q > 0);

  const handleCheckout = async () => {
    if (!hasTickets) {
      alert(t("selectTickets"));
      return;
    }
    setStep("payment");

    try {
      setLoading(true);
      setError("");
      setShowPayment(true);

      const selectedTickets = ticketTypes
        .filter((ticket) => (quantities[ticket.id] || 0) > 0)
        .map((ticket) => ({
          type: ticket.id,
          quantity: quantities[ticket.id] || 0,
        }));

      const response = await fetch("/api/sumup/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName,
          customerEmail: customerEmail,
          concertId: concert.id,
          concertTitle: concert.title,
          basePrice: concert.price,
          tickets: selectedTickets,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur lors de la création du checkout SumUp."
        );
      }

      if (!window.SumUpCard) {
        throw new Error("Le SDK SumUp n’est pas disponible.");
      }

      const container = document.getElementById("sumup-card");
      if (!container) {
        throw new Error("Conteneur de paiement introuvable.");
      }

      container.innerHTML = "";

      window.SumUpCard.mount({
        id: "sumup-card",
        checkoutId: data.checkoutId,
        onResponse: (type, body: any) => {
          console.log("Réponse du paiement SumUp:", { type, body });
          if (type === "success" && body.status === "PAID") {
            setStep("confirm");
          } else {
            setStep("payment");
          }
        },
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setShowPayment(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <p className="text-gray-600 mt-2">{concert.title}</p>
        </div>

        {step === "payment" && (
          <PaiementModal showPayment={showPayment} error={error} />
        )}

        {step === "selection" && (
          <Informations
            ticketTypes={ticketTypes}
            quantities={quantities}
            updateQuantity={updateQuantity}
            hasTickets={hasTickets}
            loading={loading}
            customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            customerName={customerName}
            setCustomerName={setCustomerName}
            handleCheckout={handleCheckout}
            error={error}
          />
        )}

        {step === "confirm" && <Confirmation />}
      </div>
    </div>
  );
}
