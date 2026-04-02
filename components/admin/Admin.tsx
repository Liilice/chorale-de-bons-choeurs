"use client";

import { useEffect, useMemo, useState } from "react";

type Ticket = {
  type: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  amount: number;
  checkoutId: string;
  concertId: number;
  concertTitle: string;
  createdAt: string;
  email: string;
  name: string;
  orderId: string;
  status: string;
  tickets: Ticket[];
};

const sortTickets = (tickets: Ticket[]) => {
  return [...tickets].sort((a, b) => {
    const aDone = a.quantity === 0 ? 1 : 0;
    const bDone = b.quantity === 0 ? 1 : 0;

    if (aDone !== bDone) {
      return aDone - bDone;
    }

    return a.type.localeCompare(b.type);
  });
};

const getRemainingTicketsCount = (order: Order) => {
  return order.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
};

const sortOrders = (orders: Order[]) => {
  return [...orders].sort((a, b) => {
    const aRemaining = getRemainingTicketsCount(a);
    const bRemaining = getRemainingTicketsCount(b);

    const aDone = aRemaining === 0 ? 1 : 0;
    const bDone = bRemaining === 0 ? 1 : 0;

    if (aDone !== bDone) {
      return aDone - bDone;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

const formatTicketType = (type: string) => {
  if (type === "adult") return "Adulte";
  if (type === "child") return "Enfant";
  return type;
};

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/admin/orders");

        if (!response.ok) {
          throw new Error("Impossible de charger les commandes.");
        }

        const data: Order[] = await response.json();

        const normalized = data.map((order) => ({
          ...order,
          tickets: sortTickets(order.tickets ?? []),
        }));

        setOrders(sortOrders(normalized));
      } catch (err) {
        setError("Erreur lors du chargement des commandes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDecrementTicket = (orderId: string, ticketIndex: number) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        const updatedTickets = order.tickets.map((ticket, index) => {
          if (index !== ticketIndex) {
            return ticket;
          }

          return {
            ...ticket,
            quantity: Math.max(0, ticket.quantity - 1),
          };
        });

        return {
          ...order,
          tickets: sortTickets(updatedTickets),
        };
      });

      return sortOrders(updatedOrders);
    });
  };

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => getRemainingTicketsCount(order) === 0
    ).length;
    const activeOrders = totalOrders - completedOrders;

    return {
      totalOrders,
      activeOrders,
      completedOrders,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-600">Chargement des commandes...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Panel administrateur
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Gérez les billets et suivez les commandes en temps réel.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total commandes</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.totalOrders}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Commandes actives</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.activeOrders}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Commandes terminées</p>
            <p className="mt-2 text-3xl font-bold text-slate-500">
              {stats.completedOrders}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {orders.map((order) => {
            const remaining = getRemainingTicketsCount(order);
            const isDone = remaining === 0;

            return (
              <section
                key={order.id}
                className={`rounded-3xl bg-white p-5 shadow-sm ring-1 transition ${
                  isDone
                    ? "opacity-75 ring-slate-200"
                    : "ring-slate-200 hover:ring-slate-300"
                }`}
              >
                <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">
                        {order.concertTitle}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isDone
                            ? "bg-slate-200 text-slate-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isDone ? "Terminée" : "En cours"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-800">Nom :</span>{" "}
                        {order.name}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Email :</span>{" "}
                        {order.email}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Statut :</span>{" "}
                        {order.status}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Date :</span>{" "}
                        {new Date(order.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200">
                    <p className="text-slate-500">Billets restants</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {remaining}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.tickets.map((ticket, index) => {
                    const ticketDone = ticket.quantity === 0;

                    return (
                      <div
                        key={`${order.id}-${ticket.type}-${index}`}
                        className={`flex flex-col gap-4 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between ${
                          ticketDone
                            ? "border-slate-200 bg-slate-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className={ticketDone ? "opacity-60" : ""}>
                          <p
                            className={`text-base font-semibold text-slate-900 ${
                              ticketDone ? "line-through" : ""
                            }`}
                          >
                            {formatTicketType(ticket.type)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {ticket.unitPrice} € / billet
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`min-w-[56px] text-center text-lg font-bold ${
                              ticketDone
                                ? "text-slate-400 line-through"
                                : "text-slate-900"
                            }`}
                          >
                            {ticket.quantity}
                          </div>

                          <button
                            type="button"
                            disabled={ticketDone}
                            onClick={() =>
                              handleDecrementTicket(order.id, index)
                            }
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            Décrémenter
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}