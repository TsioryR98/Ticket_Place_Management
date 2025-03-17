"use server";

import eventsData from "@/app/lib/events.json";
import { Event } from "@/app/types/event";

export async function reserveTicket(
  eventId: string,
  ticketType: string,
  quantity: number
) {
  // Simuler un utilisateur connecté (on ajoutera l'authentification plus tard)
  const user = { id: "123", name: "Utilisateur Test" }; // Remplace par un vrai système d'auth plus tard
  if (!user) {
    return {
      success: false,
      message: "Vous devez être connecté pour réserver un billet.",
    };
  }

  // Trouver l'événement
  const event: Event | undefined = eventsData.find((e) => e.id === eventId);
  if (!event) {
    return { success: false, message: "Événement non trouvé." };
  }

  // Trouver le billet demandé
  const ticket = event.tickets.find((t) => t.type === ticketType);
  if (!ticket) {
    return { success: false, message: "Type de billet invalide." };
  }

  // Vérifier la disponibilité
  if (ticket.available < quantity) {
    return { success: false, message: "Stock insuffisant pour ce billet." };
  }

  // Mettre à jour la disponibilité (simulation, pas encore d'écriture dans le fichier)
  ticket.available -= quantity;

  // Retourner une confirmation
  return {
    success: true,
    message: `Réservation confirmée pour ${quantity} billet(s) ${ticketType}.`,
  };
}
