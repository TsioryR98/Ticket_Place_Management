import { Event } from "@/types/event";

const API_BASE_URL = "http://localhost:4000/api"; // Adjust if your backend runs on a different port

export async function fetchEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

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

export async function fetchEventWithTickets(eventId: string): Promise<Event> {
  try {
    // Fetch event details
    const eventResponse = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!eventResponse.ok) throw new Error("Failed to fetch event");
    const event = await eventResponse.json();

    // Fetch tickets for this event
    const ticketsResponse = await fetch(
      `${API_BASE_URL}/events/${eventId}/tickets`
    );
    if (!ticketsResponse.ok) throw new Error("Failed to fetch tickets");
    const tickets = await ticketsResponse.json();

    // Transform data to match frontend types
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
