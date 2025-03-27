"use server";

const API_BASE_URL = "http://localhost:4000/api";

export async function reserveTicket(
  eventId: string,
  ticketType: string,
  quantity: number
) {
  try {
    // 1. Récupérer l'événement avec les tickets complets
    const eventRes = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!eventRes.ok) throw new Error("Failed to fetch event");
    const event = await eventRes.json();

    // 2. Trouver le ticket complet
    const ticket = event.tickets.find((t: any) => t.type === ticketType);
    if (!ticket) throw new Error(`Ticket type ${ticketType} not found`);
    if (!ticket.ticket_id) throw new Error("Ticket ID is missing");

    // 3. Créer la commande
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            ticketId: ticket.ticket_id, // Utilisez le ticket_id
            quantity: quantity,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Échec de la réservation");
    }

    return { success: true, message: "Réservation confirmée!" };
  } catch (error) {
    console.error("Reservation error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
