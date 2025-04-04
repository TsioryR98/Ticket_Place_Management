"use client";

import { Event } from "@/types/event";
import Link from "next/link";

export default function EventList({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div key={event.id} className="border p-4 rounded-lg shadow-md">
          <Link href={`/event/${event.id}`}>
            <h2 className="text-xl font-bold">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <p className="mt-2">
              <strong>Date :</strong> {event.date}
            </p>
            <p>
              <strong>Location :</strong> {event.location}
            </p>
            <p>
              <strong>Tickets available :</strong>{" "}
              {event.tickets.reduce((sum, ticket) => sum + ticket.available, 0)}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
