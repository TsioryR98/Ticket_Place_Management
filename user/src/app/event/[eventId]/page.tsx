import { notFound } from "next/navigation";
<<<<<<< HEAD
import eventsData from "@/lib/events.json";
import { Event } from "@/types/event";
import EventClientComponent from "./EventClientComponent";
=======
import eventsData from "@/app/lib/events.json";
import { Event } from "@/app/types/event";
>>>>>>> feature/adminLogin

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = await params;

  // Simuler une récupération asynchrone des données
  const event: Event | undefined = eventsData.find((e) => e.id === eventId);

  if (!event) {
    return notFound();
  }

  // Passer les données au composant client
  return <EventClientComponent event={event} />;
}
