import { notFound } from "next/navigation";
import { Event } from "@/types/event";
import EventClientComponent from "./EventClientComponent";
import { fetchEventById } from "@/lib/api";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = await params;

  try {
    const event: Event = await fetchEventById(eventId);

    if (!event) {
      return notFound();
    }

    return <EventClientComponent event={event} />;
  } catch (error) {
    console.error("Error fetching event:", error);
    return notFound();
  }
}
