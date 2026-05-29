"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

type Preview = {
  status: "available" | "already_used";
  name: string;
  email: string;
  concertTitle: string;
  concertDate: string;
  concertTime: string;
  remaining: number;
  totalBought: number;
  expectedConcertDate: string;
};

type ScanResult = {
  status: "ok" | "already_used" | "not_found" | "invalid";
  name?: string;
  concertTitle?: string;
  concertDate?: string;
  remaining?: number;
  totalBought?: number;
  message?: string;
};

type ViewState =
  | { kind: "loading" }
  | { kind: "missing_token" }
  | { kind: "error"; message: string }
  | { kind: "preview"; data: Preview }
  | { kind: "validating"; data: Preview }
  | { kind: "result"; data: ScanResult };

function ScanPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketToken = searchParams.get("t");

  const [view, setView] = useState<ViewState>({ kind: "loading" });

  const fetchPreview = useCallback(async () => {
    if (!ticketToken) {
      setView({ kind: "missing_token" });
      return;
    }

    const adminToken =
      typeof window !== "undefined"
        ? localStorage.getItem("CDCBtoken")
        : null;

    if (!adminToken) {
      const redirect = `/admin/scan?t=${encodeURIComponent(ticketToken)}`;
      router.replace(`/admin/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/scan?t=${encodeURIComponent(ticketToken)}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.status === 401) {
        localStorage.removeItem("CDCBtoken");
        const redirect = `/admin/scan?t=${encodeURIComponent(ticketToken)}`;
        router.replace(`/admin/login?redirect=${encodeURIComponent(redirect)}`);
        return;
      }

      const data = (await res.json()) as Preview & { message?: string };

      if (!res.ok) {
        setView({
          kind: "error",
          message: data.message ?? "Billet invalide.",
        });
        return;
      }

      setView({ kind: "preview", data });
    } catch {
      setView({
        kind: "error",
        message: "Erreur réseau. Réessayez.",
      });
    }
  }, [router, ticketToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPreview();
  }, [fetchPreview]);

  const confirmScan = async () => {
    if (view.kind !== "preview") return;
    const adminToken = localStorage.getItem("CDCBtoken");
    if (!adminToken || !ticketToken) return;

    setView({ kind: "validating", data: view.data });

    try {
      const res = await fetch("/api/admin/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ticketToken }),
      });

      const data = (await res.json()) as ScanResult;
      setView({ kind: "result", data });
    } catch {
      setView({
        kind: "result",
        data: { status: "invalid", message: "Erreur réseau." },
      });
    }
  };

  const goAdmin = () => router.push("/admin");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Validation de billet
          </h1>
        </div>

        {view.kind === "loading" && (
          <p className="text-center text-slate-500">Chargement…</p>
        )}

        {view.kind === "missing_token" && (
          <p className="text-center text-red-600">
            Aucun billet à scanner. Token manquant dans l&apos;URL.
          </p>
        )}

        {view.kind === "error" && (
          <div className="space-y-4">
            <p className="text-center text-red-600">{view.message}</p>
            <button
              onClick={goAdmin}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Retour au panel
            </button>
          </div>
        )}

        {(view.kind === "preview" || view.kind === "validating") && (
          <PreviewCard
            preview={view.data}
            isSubmitting={view.kind === "validating"}
            onConfirm={confirmScan}
            onCancel={goAdmin}
          />
        )}

        {view.kind === "result" && (
          <ResultCard result={view.data} onClose={goAdmin} />
        )}
      </div>
    </main>
  );
}

function PreviewCard({
  preview,
  isSubmitting,
  onConfirm,
  onCancel,
}: {
  preview: Preview;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const alreadyUsed = preview.status === "already_used";
  const wrongDate =
    preview.expectedConcertDate &&
    preview.concertDate &&
    preview.expectedConcertDate !== preview.concertDate;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
        <Row label="Nom" value={preview.name} />
        <Row label="Concert" value={preview.concertTitle} />
        <Row
          label="Date"
          value={`${preview.concertDate} à ${preview.concertTime}`}
        />
        <Row
          label="Billets restants"
          value={`${preview.remaining} / ${preview.totalBought}`}
        />
      </div>

      {alreadyUsed && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Tous les billets de cette commande ont déjà été utilisés.
        </div>
      )}

      {wrongDate && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Ce billet est pour le {preview.expectedConcertDate}, pas pour
          aujourd&apos;hui.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting || alreadyUsed}
          className="flex-1 rounded-xl bg-[#D2232A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#AF2027] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Validation…" : "Valider le billet"}
        </button>
      </div>
    </div>
  );
}

function ResultCard({
  result,
  onClose,
}: {
  result: ScanResult;
  onClose: () => void;
}) {
  const isOk = result.status === "ok";
  const isAlreadyUsed = result.status === "already_used";

  let bgClass = "bg-red-50 border-red-200";
  let iconClass = "text-red-600";
  let title = "Billet invalide";
  let body = result.message ?? "Ce billet ne peut pas être validé.";

  if (isOk) {
    bgClass = "bg-green-50 border-green-200";
    iconClass = "text-green-600";
    title = "Billet validé";
    body = `Il reste ${result.remaining} / ${result.totalBought} billet(s) sur cette commande.`;
  } else if (isAlreadyUsed) {
    bgClass = "bg-orange-50 border-orange-200";
    iconClass = "text-orange-600";
    title = "Déjà utilisé";
    body = "Tous les billets de cette commande ont déjà été utilisés.";
  } else if (result.status === "not_found") {
    title = "Billet introuvable";
    body = "Aucune commande ne correspond à ce QR.";
  }

  return (
    <div className="space-y-5">
      <div
        className={`rounded-xl border px-5 py-6 text-center space-y-3 ${bgClass}`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
          {isOk ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-8 w-8 ${iconClass}`}
              aria-hidden
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-8 w-8 ${iconClass}`}
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          )}
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {result.name && (
          <p className="text-sm text-slate-700">{result.name}</p>
        )}
        <p className="text-sm text-slate-600">{body}</p>
      </div>

      <button
        onClick={onClose}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Retour au panel
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">Chargement…</p>
        </main>
      }
    >
      <ScanPageInner />
    </Suspense>
  );
}
