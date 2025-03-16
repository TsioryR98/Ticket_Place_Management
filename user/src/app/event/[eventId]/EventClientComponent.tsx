"use client"; // Nécessaire pour utiliser des hooks comme useState

import { useState } from "react";
import { Event } from "@/types/event";
import { reserveTicket } from "@/app/event/actions";

export default function EventClientComponent({ event }: { event: Event }) {
  // État pour gérer l'affichage du formulaire de réservation
  const [showReservationForm, setShowReservationForm] = useState(false);

  // État pour stocker les quantités sélectionnées pour chaque type de billet
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Gérer la soumission du formulaire de réservation
  const handleReservationSubmit = async (formData: FormData) => {
    // Préparer les réservations (type de billet + quantité)
    const reservations = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0) // Ne garder que les billets avec une quantité > 0
      .map(([ticketType, quantity]) => ({ ticketType, quantity }));

    // Soumettre chaque réservation
    for (const reservation of reservations) {
      const result = await reserveTicket(
        event.id,
        reservation.ticketType,
        reservation.quantity
      );
      if (result.success) {
        alert(
          `Réservation réussie pour ${reservation.quantity} billet(s) ${reservation.ticketType}.`
        );
      } else {
        alert(`Erreur pour ${reservation.ticketType}: ${result.message}`);
      }
    }

    // Masquer le formulaire après la réservation
    setShowReservationForm(false);
  };

  // Mettre à jour la quantité pour un type de billet spécifique
  const handleQuantityChange = (ticketType: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketType]: quantity,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{event.description}</p>

      <div className="mt-4">
        <p>
          <strong>Date :</strong> {event.date} à {event.time}
        </p>
        <p>
          <strong>Lieu :</strong> {event.location}
        </p>
        <p>
          <strong>Organisateur :</strong> {event.organizer}
        </p>
      </div>

      <h2 className="mt-6 text-xl font-semibold">Billets disponibles</h2>
      <table className="w-full mt-2 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Type</th>
            <th className="border p-2">Prix (€)</th>
            <th className="border p-2">Disponibilité</th>
            <th className="border p-2">Limite/personne</th>
          </tr>
        </thead>
        <tbody>
          {event.tickets.map((ticket) => (
            <tr key={ticket.type}>
              <td className="border p-2">{ticket.type}</td>
              <td className="border p-2">{ticket.price}</td>
              <td className="border p-2">{ticket.available}</td>
              <td className="border p-2">{ticket.limitPerPerson}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bouton "Réserver" */}
      <div className="mt-6">
        <button
          onClick={() => setShowReservationForm(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Réserver maintenant
        </button>
      </div>

      {/* Formulaire de réservation (affiché après avoir cliqué sur "Réserver") */}
      {showReservationForm && (
        <form
          action={handleReservationSubmit}
          className="mt-6 p-4 border rounded-lg bg-gray-50"
        >
          <h3 className="text-lg font-semibold mb-4">
            Formulaire de réservation
          </h3>

          {/* Liste des types de billets avec quantité */}
          {event.tickets.map((ticket) => (
            <div key={ticket.type} className="mb-4">
              <label
                htmlFor={`quantity-${ticket.type}`}
                className="block font-medium"
              >
                {ticket.type} (€{ticket.price}) :
              </label>
              <input
                type="number"
                id={`quantity-${ticket.type}`}
                name={`quantity-${ticket.type}`}
                value={quantities[ticket.type] || 0}
                onChange={(e) =>
                  handleQuantityChange(ticket.type, parseInt(e.target.value))
                }
                min="0"
                max={ticket.limitPerPerson}
                className="w-full p-2 border rounded"
              />
              <span className="text-sm text-gray-500">
                Limite : {ticket.limitPerPerson} par personne
              </span>
            </div>
          ))}

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Confirmer la réservation
            </button>
            <button
              type="button"
              onClick={() => setShowReservationForm(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
