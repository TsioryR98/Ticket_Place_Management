"use server";

const API_BASE_URL = "http://localhost:4000/api";

export async function reserveTicket(
  eventId: string,
  reservations: { ticketType: string; quantity: number }[]
) {
  try {
    // 1. Récupérer l'événement
    const eventRes = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!eventRes.ok)
      throw new Error("Échec de la récupération de l'événement");
    const event = await eventRes.json();

    // 2. Préparer les items de commande
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

    // 3. Envoyer la commande
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: orderItems }),
    });

    if (!res.ok) throw new Error("Échec de la création de commande");

    const orderData = await res.json();
    return {
      success: true,
      orderId: orderData.order_id,
      message: "Réservation confirmée!",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
