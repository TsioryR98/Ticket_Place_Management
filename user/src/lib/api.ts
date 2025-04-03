import { Event } from "@/types/event";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { getSession } from "next-auth/react";

const API_BASE_URL = "http://localhost:4000/api";

// fetch all events
export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) throw new Error("Failed to fetch events");

    const data = await response.json();

    return data.map((event: any) => ({
      ...event,
      imagePath: event.images,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

// fetch event by id
export async function fetchEventById(eventId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

// fetch event
export async function fetchEventWithTickets(eventId: string): Promise<Event> {
  try {
    const eventResponse = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!eventResponse.ok) throw new Error("Failed to fetch event");
    const event = await eventResponse.json();

    const ticketsResponse = await fetch(
      `${API_BASE_URL}/events/${eventId}/tickets`
    );
    if (!ticketsResponse.ok) throw new Error("Failed to fetch tickets");
    const tickets = await ticketsResponse.json();

    return {
      id: event.event_id,
      title: event.title,
      description: event.descriptions,
      date: new Date(event.event_datetime).toISOString().split("T")[0],
      time: new Date(event.event_datetime).toLocaleTimeString(),
      location: event.locations,
      organizer: event.organizer,
      category: event.category,
      tickets: tickets.map((t: any) => ({
        type: t.types,
        price: t.price,
        available: t.available,
        limitPerPerson: t.limit_per_person,
      })),
    };
  } catch (error) {
    console.error("Error fetching event with tickets:", error);
    throw error;
  }
}

// get order by id
export async function getOrderById(orderId: string) {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/orders/${orderId}`);
    if (!res) return null;

    return await res.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

// get the user reservations
export async function getUserReservations() {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/orders`);
    if (!res) return []; // Retourne un tableau vide si non authentifié

    const orders = await res.json();
    return orders.map((order: any) => ({
      ...order,
      created_at: new Date(order.created_at),
      items: order.items.map((item: any) => ({
        ...item,
        price: Number(item.price),
        event_date: item.event_date ? new Date(item.event_date) : null,
      })),
    }));
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
}

// cancel reservation
export async function cancelReservation(orderId: string, ticketId: string) {
  try {
    const res = await fetchWithAuth(
      `${API_BASE_URL}/orders/${orderId}/items/${ticketId}`,
      {
        method: "DELETE",
      }
    );
    if (!res) return false; // Échec si non authentifié

    return await res.json();
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    throw error;
  }
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response | null> {
  const isServer = typeof window === "undefined";

  try {
    let session;

    if (isServer) {
      session = await getServerSession(authOptions);
    } else {
      const sessionRes = await fetch("/api/auth/session");
      if (!sessionRes.ok) return null;
      session = await sessionRes.json();
    }

    if (!session?.user?.accessToken) {
      return null; // Au lieu de throw une erreur
    }

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${session.user.accessToken}`);

    const response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Request failed");
    }

    return response;
  } catch (error) {
    console.error("FetchWithAuth error:", error);
    throw error;
  }
}

export async function fetchServerEvents(params?: {
  page?: number;
  limit?: number;
}): Promise<{ events: Event[]; total: number }> {
  try {
    const url = new URL(`${API_BASE_URL}/events`);
    if (params?.page) url.searchParams.append("page", params.page.toString());
    if (params?.limit)
      url.searchParams.append("perPage", params.limit.toString());

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch events");

    const total = parseInt(response.headers.get("X-Total-Count") || "0", 10);
    const data = await response.json();

    return {
      events: data.map((event: any) => ({
        ...event,
        imagePath: event.images || "/default-event.jpg",
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    const fallback = require("./events.json");
    return {
      events: fallback.slice(0, params?.limit || 12),
      total: fallback.length,
    };
  }
}
