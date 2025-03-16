import { Event } from "@/types/event";
import Link from "next/link";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold">{event.title}</h2>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <p className="mt-2">
        <strong>Date :</strong> {event.date} à {event.time}
      </p>
      <p>
        <strong>Lieu :</strong> {event.location}
      </p>
      <Link
        href={`/event/${event.id}`}
        className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded"
      >
        Voir les détails
      </Link>
    </div>
  );
}
