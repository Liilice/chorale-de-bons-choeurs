"use client";

import { useEffect, useMemo, useState } from "react";

type Order = {
  id: string;
  concertDate: string;
  concertTime: string;
  concertTitle: string;
  createdAt: string;
  email: string;
  name: string;
  quantitiesBuy: number;
  quantities: number;
};

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectDate, setSelectDate] = useState<string>("");
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [filterDate, setFilterDate] = useState<string[]>();

  const groupedByDate = (data: Order[]) => {
    const grouped: Record<string, Order[]> = {};

    data.forEach((order) => {
      if (!grouped[order.concertDate]) {
        grouped[order.concertDate] = [];
      }
      grouped[order.concertDate].push(order);
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    setFilterDate(sortedDates);
    setSelectDate(sortedDates[1] || "");
    setOrders(grouped[sortedDates[1]] || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/ticketUsage");

        if (!response.ok) {
          throw new Error("Impossible de récupérer les commandes.");
        }

        const data = await response.json();
        setOrderData(data);
        groupedByDate(data);
      } catch {
        setError("Erreur lors du chargement des commandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aFinished = a.quantities === 0;
      const bFinished = b.quantities === 0;

      if (aFinished && !bFinished) return 1;
      if (!aFinished && bFinished) return -1;

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [orders]);

  const updateQuantity = async (orderId: string, newQuantity: number) => {
    const targetOrder = orders.find((order) => order.id === orderId);

    if (!targetOrder) {
      return;
    }

    const previousQuantity = targetOrder.quantities;

    setError("");
    setUpdatingId(orderId);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, quantities: newQuantity } : order
      )
    );

    try {
      const response = await fetch("/api/admin/ticketUsage", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          quantities: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour.");
      }
    } catch {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, quantities: previousQuantity }
            : order
        )
      );

      setError("La quantité n’a pas pu être mise à jour.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDecrement = async (orderId: string) => {
    const targetOrder = orders.find((order) => order.id === orderId);

    if (!targetOrder || targetOrder.quantities <= 0) {
      return;
    }

    await updateQuantity(orderId, targetOrder.quantities - 1);
  };

  const handleIncrement = async (orderId: string) => {
    const targetOrder = orders.find((order) => order.id === orderId);

    if (!targetOrder) {
      return;
    }

    if (targetOrder.quantities >= targetOrder.quantitiesBuy) {
      return;
    }

    await updateQuantity(orderId, targetOrder.quantities + 1);
  };

  const changeOrdersByDate = (date: string) => {
    setSelectDate(date);
    const newOrders = orderData.filter((order) => order.concertDate === date);
    setOrders(newOrders);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Panel administrateur
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Gestion des billets utilisés
            </p>
          </div>
        </div>

        {filterDate && (
          <div className="flex flex-wrap gap-3 mb-6">
            {filterDate.map((date) => (
              <button
                key={date}
                className={`
                px-4 py-2 rounded-xl text-sm font-medium transition
                border
                ${
                  selectDate === date
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }
              `}
              onClick={()=>changeOrdersByDate(date)}
              >
                {date}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Commandes</h2>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-sm text-slate-500">
              Chargement...
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-500">
              Aucune commande trouvée.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {sortedOrders.map((order) => {
                const isFinished = order.quantities === 0;
                const isUpdating = updatingId === order.id;
                const canIncrement = order.quantities < order.quantitiesBuy;

                return (
                  <div
                    key={order.id}
                    className={`flex flex-col gap-4 px-6 py-5 transition md:flex-row md:items-center md:justify-between ${
                      isFinished ? "bg-slate-50 opacity-70" : "bg-white"
                    }`}
                  >
                    <div
                      className={
                        isFinished ? "line-through text-slate-400" : ""
                      }
                    >
                      <p className="text-lg font-semibold text-slate-900">
                        {order.name}
                      </p>
                      <p className="text-sm text-slate-600">{order.email}</p>
                      <p className="mt-1 text-sm text-slate-700">
                        {order.concertTitle}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.concertDate} à {order.concertTime}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Créé le{" "}
                        {new Date(order.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`min-w-[110px] rounded-xl px-4 py-2 text-center text-sm font-semibold ${
                          isFinished
                            ? "bg-slate-200 text-slate-500"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.quantities}/{order.quantitiesBuy} billet
                        {order.quantitiesBuy > 1 ? "s" : ""}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDecrement(order.id)}
                        disabled={isFinished || isUpdating}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {isUpdating ? "..." : "-1 billet"}
                      </button>

                      {canIncrement && (
                        <button
                          type="button"
                          onClick={() => handleIncrement(order.id)}
                          disabled={isUpdating}
                          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          +1 billet
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Admin;
