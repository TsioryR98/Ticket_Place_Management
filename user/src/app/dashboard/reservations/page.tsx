"use client";

import { useEffect, useState } from "react";
import { getUserReservations } from "@/lib/api";
import { Order } from "@/types/order";
import Link from "next/link";

export default function ReservationList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // À remplacer par le vrai ID utilisateur (via NextAuth ou contexte)
        const userId = "11111111-1111-1111-1111-111111111111";
        const data = await getUserReservations(userId);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const currentDate = new Date();

  const filteredOrders = orders.filter((order) => {
    const eventDate = new Date(order.items[0]?.event_date || 0);
    if (filter === "upcoming") return eventDate >= currentDate;
    if (filter === "past") return eventDate < currentDate;
    return true;
  });

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mes Réservations</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-4 py-2 rounded ${
            filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          À venir
        </button>
        <button
          onClick={() => setFilter("past")}
          className={`px-4 py-2 rounded ${
            filter === "past" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Passées
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Aucune réservation trouvée</p>
          <Link
            href="/"
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Explorer les événements
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Commande #{order.order_id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {order.status_order === "confirmed"
                      ? "Confirmée"
                      : order.status_order === "cancelled"
                      ? "Annulée"
                      : "En attente"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {order.items.map((item, index) => {
                  const eventDate = new Date(item.event_date || 0);
                  const isUpcoming = eventDate >= currentDate;

                  return (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {item.quantity}x {item.ticket_type}
                          </p>
                          <p className="text-gray-600">{item.event_title}</p>
                        </div>
                        <p className="font-semibold">
                          {(item.price * item.quantity).toFixed(2)}€
                        </p>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>
                          {item.event_location} •{" "}
                          {eventDate.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                      {isUpcoming && order.status_order === "confirmed" && (
                        <button
                          onClick={() =>
                            handleCancel(order.order_id, item.ticket_id)
                          }
                          className="mt-2 text-sm text-red-500 hover:text-red-700"
                        >
                          Annuler ce billet
                        </button>
                      )}
                    </div>
                  );
                })}

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <p className="font-semibold">Total</p>
                  <p className="text-lg font-bold">
                    {typeof order.total_amount === "number"
                      ? order.total_amount.toFixed(2)
                      : Number(order.total_amount).toFixed(2)}
                    €
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  async function handleCancel(orderId: string, ticketId: string) {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?"))
      return;

    try {
      // TODO: Implémenter l'appel API d'annulation
      console.log(`Annulation: orderId=${orderId}, ticketId=${ticketId}`);

      // Mise à jour optimiste de l'interface
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                items: order.items.filter(
                  (item) => item.ticket_id !== ticketId
                ),
              }
            : order
        )
      );

      alert("Annulation effectuée avec succès");
    } catch (error) {
      alert("Erreur lors de l'annulation");
      console.error(error);
    }
  }
}
