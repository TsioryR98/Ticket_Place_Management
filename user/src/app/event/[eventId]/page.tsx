import { notFound } from "next/navigation";
import eventsData from "@/lib/events.json";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  tickets: {
    type: string;
    price: number;
    available: number;
    limitPerPerson: number;
  }[];
};

export default function EventPage({ params }: { params: { eventId: string } }) {
  const event: Event | undefined = eventsData.find(
    (e) => e.id === params.eventId
  );

  if (!event) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{event.description}</p>

      <div className="mt-4">
        <p>
          <strong>Date :</strong> {event.date} à {event.time}
        </p>
        <p>
          <strong>Lieu :</strong> {event.location}
        </p>
        <p>
          <strong>Organisateur :</strong> {event.organizer}
        </p>
      </div>

      <h2 className="mt-6 text-xl font-semibold">Billets disponibles</h2>
      <table className="w-full mt-2 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Type</th>
            <th className="border p-2">Prix (€)</th>
            <th className="border p-2">Disponibilité</th>
            <th className="border p-2">Limite/personne</th>
          </tr>
        </thead>
        <tbody>
          {event.tickets.map((ticket) => (
            <tr key={ticket.type}>
              <td className="border p-2">{ticket.type}</td>
              <td className="border p-2">{ticket.price}</td>
              <td className="border p-2">{ticket.available}</td>
              <td className="border p-2">{ticket.limitPerPerson}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
