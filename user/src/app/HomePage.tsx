"use client";
import { useSearchParams } from "next/navigation";
import EventCardHome from "@/components/event/EventCardHome";
import Pagination from "@/components/event/Pagination";
import { fetchServerEvents } from "@/lib/api";
import { useEffect, useState } from "react";
import { Event } from "@/types/event"; // Importez votre type Event

export default function HomePage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]); // Spécifiez le type ici
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { events, total } = await fetchServerEvents({
          page: currentPage,
          limit: itemsPerPage,
        });
        setEvents(events);
        setTotalPages(Math.ceil(total / itemsPerPage));
      } catch (error) {
        console.error("Fetch error:", error);
        setEvents([]); // Fallback vide
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="landing_page h-[25vh] bg-blue-900"></div>
      <section id="events" className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {events.map((event) => (
              <li key={event.id} className="w-full h-full">
                <EventCardHome {...event} link={`/event/${event.id}`} />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/"
            />
          )}
        </div>
      </section>
    </>
  );
}
