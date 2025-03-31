"use server";

import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";

const API_BASE_URL = "http://localhost:4000/api";

export async function reserveTicket(
  eventId: string,
  reservations: { ticketType: string; quantity: number }[]
) {
  try {
    // 1. Récupérer la session
    const session = await getServerSession(authOptions);
    if (!session?.user.accessToken) {
      throw new Error("Vous devez être connecté pour réserver");
    }

    // 2. Récupérer l'événement
    const eventRes = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (!eventRes.ok)
      throw new Error("Échec de la récupération de l'événement");
    const event = await eventRes.json();

    // 3. Préparer les items de commande
    const orderItems = await Promise.all(
      reservations.map(async ({ ticketType, quantity }) => {
        const ticket = event.tickets.find((t: any) => t.type === ticketType);
        if (!ticket) throw new Error(`Billet ${ticketType} non trouvé`);
        return {
          ticketId: ticket.ticket_id,
          quantity: Math.max(1, quantity),
        };
      })
    );

    // 4. Envoyer la commande avec authentification
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({ items: orderItems }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Échec de la création de commande");
    }

    const orderData = await res.json();
    return {
      success: true,
      orderId: orderData.order_id,
      message: "Réservation confirmée!",
    };
  } catch (error) {
    console.error("Erreur de réservation:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
