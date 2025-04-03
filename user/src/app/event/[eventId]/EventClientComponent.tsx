"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { reserveTicket } from "@/app/event/actions";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Ticket,
  ChevronRight,
  Share2,
  X,
  AlertCircle,
} from "lucide-react";

export default function EventClientComponent({ event }: { event: Event }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // Effet pour détecter le scroll et afficher une barre flottante
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleReservationSubmit = async () => {
    // Vérifier si des tickets sont sélectionnés
    const hasTickets = Object.values(quantities).some((q) => q > 0);
    if (!hasTickets) {
      setReservationError("Veuillez sélectionner au moins un billet");
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    setIsSubmitting(true);
    setReservationError(null);

    try {
      const activeReservations = Object.entries(quantities)
        .filter(([_, q]) => q > 0)
        .map(([type, q]) => ({ ticketType: type, quantity: q }));

      const result = await reserveTicket(event.id, activeReservations);

      if (result.success && result.orderId) {
        window.location.href = `/dashboard/reservations/${result.orderId}`;
      } else {
        setReservationError(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (ticketType: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketType]: quantity,
    }));
  };

  const resetReservationForm = () => {
    setQuantities({});
    setShowReservationForm(false);
    setReservationError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calcul du total de la réservation
  const calculateTotal = () => {
    return event.tickets
      .reduce((total, ticket) => {
        return total + ticket.price * (quantities[ticket.type] || 0);
      }, 0)
      .toFixed(2);
  };

  // Calcul du nombre total de billets sélectionnés
  const totalTickets = Object.values(quantities).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  return (
    <>
      {/* Barre flottante qui apparaît au scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ${
          scrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 relative rounded-md overflow-hidden">
              <Image
                src={event.imagePath || "/api/placeholder/100/100"}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 truncate max-w-md">
              {event.title}
            </h3>
          </div>
          <button
            onClick={() => setShowReservationForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
          >
            Réserver
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* En-tête de l'événement avec image et détails principaux */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Image de l'événement */}
          <div className="w-full lg:w-3/5 relative h-[550px] overflow-hidden rounded-2xl shadow-2xl group">
            <Image
              src={event.imagePath || "/api/placeholder/800/600"}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-6 right-6 flex gap-3"></div>
            <div className="absolute bottom-6 left-6 border-2 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg">
              {event.category || "Événement"}
            </div>
          </div>

          {/* Détails de l'événement avec nouveaux logos */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {event.title}
              </h1>

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-yellow-50 rounded-full text-green-600">
                    <Calendar
                      size={24}
                      strokeWidth={2}
                      className="text-slate-500"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="p-3 bg-yellow-50 rounded-full text-purple-600">
                    <Clock
                      size={24}
                      strokeWidth={2}
                      className="text-slate-500"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Heure</p>
                    <p className="font-semibold text-gray-800">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="p-3 bg-yellow-50 rounded-full text-red-600">
                    <MapPin
                      size={24}
                      strokeWidth={2}
                      className="text-slate-500"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Lieu</p>
                    <p className="font-semibold text-gray-800">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="p-3 bg-yellow-50 rounded-full text-blue-600">
                    <User
                      size={24}
                      strokeWidth={2}
                      className="text-slate-500"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Organisateur
                    </p>
                    <p className="font-semibold text-gray-800">
                      {event.organizer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description de l'événement */}
        <div className="mb-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            À propos de cet événement
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              {event.description}
            </p>
          </div>
        </div>

        {/* Section des billets détaillée */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-indigo-600">
              <Ticket size={24} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Billets disponibles
            </h2>
          </div>

          {event.tickets && event.tickets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="py-5 px-6 text-left font-semibold text-gray-700 border-b">
                      Type
                    </th>
                    <th className="py-5 px-6 text-left font-semibold text-gray-700 border-b">
                      Prix
                    </th>
                    <th className="py-5 px-6 text-left font-semibold text-gray-700 border-b">
                      Disponibilité
                    </th>
                    <th className="py-5 px-6 text-left font-semibold text-gray-700 border-b">
                      Limite/personne
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {event.tickets.map((ticket, index) => (
                    <tr
                      key={ticket.type}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50/30 transition-colors duration-150`}
                    >
                      <td className="py-5 px-6 border-b border-gray-100 font-medium">
                        {ticket.type}
                      </td>
                      <td className="py-5 px-6 border-b border-gray-100 font-bold text-indigo-700">
                        {ticket.price} €
                      </td>
                      <td className="py-5 px-6 border-b border-gray-100">
                        {ticket.available > 10 ? (
                          <span className="text-green-600 font-medium flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                            {ticket.available} disponibles
                          </span>
                        ) : ticket.available > 0 ? (
                          <span className="text-orange-600 font-medium flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                            Plus que {ticket.available} !
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                            Épuisé
                          </span>
                        )}
                      </td>
                      <td className="py-5 px-6 border-b border-gray-100">
                        {ticket.limitPerPerson}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-xl">
              <p className="text-gray-500">
                Aucun billet disponible pour le moment.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowReservationForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-900 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 hover:shadow-xl flex items-center gap-2 text-lg"
            >
              <Ticket size={20} />
              <span>Réserver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire de réservation modal */}
      {showReservationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Réservation de billets
              </h3>
              <button
                onClick={resetReservationForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            {reservationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                <div className="p-1 rounded-full bg-red-100">
                  <AlertCircle size={18} />
                </div>
                <p>{reservationError}</p>
              </div>
            )}

            {/* Liste des types de billets avec quantité */}
            <div className="space-y-4 mb-8">
              <h4 className="font-medium text-gray-700 mb-3">
                Sélectionnez vos billets
              </h4>
              {event.tickets.map((ticket) => (
                <div
                  key={ticket.type}
                  className="p-5 border rounded-xl bg-white hover:border-indigo-200 transition-colors hover:shadow-md"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="font-semibold text-gray-900">
                        {ticket.type}
                      </span>
                      {ticket.available <= 10 && ticket.available > 0 && (
                        <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                          {ticket.available} restants
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-indigo-700">
                      {ticket.price} €
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Limite: {ticket.limitPerPerson} par personne
                    </span>

                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = quantities[ticket.type] || 0;
                          if (currentValue > 0) {
                            handleQuantityChange(ticket.type, currentValue - 1);
                          }
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-l-lg text-gray-600 transition-colors"
                        disabled={(quantities[ticket.type] || 0) === 0}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        id={`quantity-${ticket.type}`}
                        name={`quantity-${ticket.type}`}
                        value={quantities[ticket.type] || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (
                            !isNaN(value) &&
                            value >= 0 &&
                            value <= ticket.limitPerPerson
                          ) {
                            handleQuantityChange(ticket.type, value);
                          }
                        }}
                        min="0"
                        max={ticket.limitPerPerson}
                        className="w-14 h-9 text-center border-y focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = quantities[ticket.type] || 0;
                          if (currentValue < ticket.limitPerPerson) {
                            handleQuantityChange(ticket.type, currentValue + 1);
                          }
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-r-lg text-gray-600 transition-colors"
                        disabled={
                          (quantities[ticket.type] || 0) ===
                            ticket.limitPerPerson || ticket.available === 0
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total calculé */}
            <div className="border-t border-gray-200 pt-5 mb-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-indigo-700">{calculateTotal()} €</span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              {/* Bouton Annuler */}
              <button
                type="button"
                onClick={resetReservationForm}
                className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Annuler
              </button>

              {/* Bouton Confirmer */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleReservationSubmit}
                  className={`flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-blue-600 to-indigo-900 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                    totalTickets === 0
                      ? "cursor-not-allowed"
                      : "hover:shadow-lg"
                  }`}
                  style={{
                    cursor: totalTickets === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  <Ticket size={20} />
                  <span>Réserver</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
