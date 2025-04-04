"use client";

import { useEffect, useState } from "react";
import { cancelReservation, getUserReservations } from "@/lib/api";
import { Order } from "@/types/order";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLoginModal } from "@/context/ModalContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ReservationList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const { loginOpenModal } = useLoginModal();

  const handleLoginClick = () => {
    loginOpenModal();
  };
  const session = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserReservations();
        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    if (session.status === "authenticated") {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [session.status]);

  if (session.status === "unauthenticated") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-16 p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 text-center"
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-5xl mb-4"
          >
            🎟️
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Accès à vos réservations
          </h2>
          <p className="text-gray-600">Connectez-vous pour gérer vos billets</p>
        </div>
        <motion.button
          whileHover={{
            scale: 1.03,
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLoginClick}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium shadow-md transition-all"
        >
          Se connecter
        </motion.button>
      </motion.div>
    );
  }

  const isEventUpcoming = (eventDateStr: string) => {
    const eventDate = new Date(eventDateStr);
    const currentDate = new Date();
    return eventDate >= currentDate;
  };

  const filteredOrders = orders
    .filter((order) => {
      const hasUpcomingEvents = order.items.some(
        (item) => item.event_date && isEventUpcoming(item.event_date)
      );
      if (filter === "upcoming") return hasUpcomingEvents;
      if (filter === "past") return !hasUpcomingEvents;
      return true;
    })
    .sort((a, b) => {
      const aDate = a.items[0]?.event_date
        ? new Date(a.items[0].event_date).getTime()
        : 0;
      const bDate = b.items[0]?.event_date
        ? new Date(b.items[0].event_date).getTime()
        : 0;
      return aDate - bDate;
    });

  async function handleCancel(orderId: string, ticketId: string) {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?"))
      return;

    try {
      const order = orders.find((o) => o.order_id === orderId);
      const item = order?.items.find((i) => i.ticket_id === ticketId);

      if (!item?.event_date) {
        throw new Error("Billet non trouvé");
      }

      if (new Date(item.event_date) < new Date()) {
        toast.error("Impossible d'annuler un événement passé");
        return;
      }

      await cancelReservation(orderId, ticketId);

      setOrders((prev) =>
        prev
          .map((order) =>
            order.order_id === orderId
              ? {
                  ...order,
                  items: order.items.filter((i) => i.ticket_id !== ticketId),
                  total_amount: order.total_amount - item.price * item.quantity,
                }
              : order
          )
          .filter((order) => order.items.length > 0)
      );

      toast.success("Annulation réussie !");
    } catch (error) {
      console.error("Erreur d'annulation:", error);
      toast.error(
        error instanceof Error
          ? error.message.includes("Billet")
            ? "Ce billet n'existe pas ou a déjà été annulé"
            : error.message
          : "Erreur lors de l'annulation"
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-600 font-medium">
          Chargement de vos réservations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto mt-12 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 text-red-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erreur de chargement
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              Réessayer
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
          },
        }}
        className="mb-10 text-center relative"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-900 mb-2 inline-block"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 12,
            delay: 0.2,
          }}
        >
          Mes Réservations
        </motion.h1>
        <motion.div
          className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-900 rounded-full mx-auto my-3"
          initial={{ width: 0 }}
          animate={{ width: "6rem" }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        <motion.p
          className="text-gray-600 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {filter === "upcoming"
            ? "Vos prochains événements"
            : filter === "past"
            ? "Vos événements passés"
            : "Toutes vos réservations"}
        </motion.p>
      </motion.div>

      <motion.div
        className="flex justify-center gap-3 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {["all", "upcoming", "past"].map((f, index) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => setFilter(f as any)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              filter === f
                ? "bg-gradient-to-r from-blue-600 to-indigo-900 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200"
            }`}
          >
            {f === "all" && "Toutes"}
            {f === "upcoming" && "À venir"}
            {f === "past" && "Passées"}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="p-8 text-center">
              <motion.div
                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 0, 0, 0, 0, 0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Aucune réservation trouvée
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === "upcoming"
                  ? "Vous n'avez pas de réservations à venir"
                  : filter === "past"
                  ? "Aucune réservation passée"
                  : "Vous n'avez pas encore de réservations"}
              </p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-900 hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Explorer les événements
                  <svg
                    className="ml-2 -mr-1 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-8 max-w-4xl mx-auto">
            {filteredOrders.map((order, orderIndex) => (
              <motion.div
                key={order.order_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  delay: 0.1 * orderIndex,
                }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Commande #{order.order_id.slice(0, 8).toUpperCase()}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Réservé le{" "}
                        {new Date(order.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => {
                    const eventDate = item.event_date
                      ? new Date(item.event_date)
                      : null;
                    const isUpcoming = eventDate && eventDate >= new Date();

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="p-6 group hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <motion.div
                                className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600"
                                whileHover={{
                                  scale: 1.1,
                                  rotate: [0, 5, -5, 0],
                                  transition: { duration: 0.5 },
                                }}
                              >
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                  />
                                </svg>
                              </motion.div>
                              <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                                  {item.event_title}
                                </h3>
                                <p className="text-gray-600">
                                  {item.quantity}x {item.ticket_type} •{" "}
                                  {item.price}€
                                </p>
                                <p className="font-bold text-gray-900 mt-1">
                                  {(item.price * item.quantity).toFixed(2)}€
                                </p>
                              </div>
                            </div>
                          </div>

                          {item.event_date && (
                            <div className="sm:text-right">
                              <motion.div
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
                                whileHover={{ scale: 1.05, y: -1 }}
                              >
                                <svg
                                  className="h-3 w-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(item.event_date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  }
                                )}
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {isUpcoming && (
                          <motion.button
                            whileHover={{
                              scale: 1.02,
                              backgroundColor: "#FEE2E2",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(order.order_id, item.ticket_id);
                            }}
                            className="mt-4 px-4 py-2 text-sm font-medium bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Annuler ce billet
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-700">
                      Total de la commande
                    </p>
                    <motion.p
                      className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {order.total_amount.toFixed(2)}€
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
