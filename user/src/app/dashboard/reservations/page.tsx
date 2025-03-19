"use client";

import { useState } from "react";
import { mockReservations } from "@/lib/mockReservations";

export default function ReservationList() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const currentDate = new Date();

  const filteredReservations = mockReservations.filter((reservation) => {
    const reservationDate = new Date(reservation.date);
    if (filter === "upcoming") {
      return reservationDate >= currentDate;
    }
    if (filter === "past") {
      return reservationDate < currentDate;
    }
    return true; // Retourne toutes les réservations si 'all' est sélectionné
  });

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white mt-4">
      <h2 className="text-xl font-semibold">Reservations</h2>

      <div className="mb-4">
        <button
          onClick={() => setFilter("all")}
          className="p-2 bg-blue-500 text-white rounded mr-2"
        >
          All
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className="p-2 bg-blue-500 text-white rounded mr-2"
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("past")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Past
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-200 mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Event</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Ticket</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Organizer</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((res) => {
            const reservationDate = new Date(res.date);
            const isUpcoming = reservationDate >= currentDate;
            return (
              <tr key={res.id} className="text-center">
                <td className="border p-2">{res.event}</td>
                <td className="border p-2">{res.date}</td>
                <td className="border p-2">{res.ticketType}</td>
                <td className="border p-2">{res.location}</td>
                <td className="border p-2">{res.organizer}</td>
                <td className="border p-2">
                  <button
                    className="p-2 bg-red-500 text-white rounded"
                    disabled={!isUpcoming} // Le bouton est désactivé si la réservation est passée
                    onClick={() => handleCancel(res.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  function handleCancel(reservationId: string) {
    // Logique d'annulation de la réservation ici
    console.log("Cancellation of reservation ID:", reservationId);
  }
}
