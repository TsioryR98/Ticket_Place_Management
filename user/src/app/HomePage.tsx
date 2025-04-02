"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { fetchServerEvents } from "@/lib/api";
import EventCardHome from "@/components/event/EventCardHome";
import Pagination from "@/components/event/Pagination";
import FilterBar from "@/components/event/FilterBar";
import { parseISO, isWithinInterval } from "date-fns";

export default function HomePage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Paramètres de pagination
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 12;

  // Paramètres de filtre
  const searchQuery = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Charger tous les événements une fois
        const { events } = await fetchServerEvents({ limit: 1000 });
        setAllEvents(events);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (
      currentPage !== 1 &&
      (params.get("category") !== category ||
        params.get("location") !== location ||
        params.get("search") !== searchQuery ||
        params.get("start") !== startDate ||
        params.get("end") !== endDate)
    ) {
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    // Appliquer les filtres
    if (allEvents.length > 0) {
      const filtered = allEvents.filter((event) => {
        // Filtre de recherche
        const matchesSearch = searchQuery
          ? Object.values({
              title: event.title,
              description: event.description,
              location: event.location,
              organizer: event.organizer,
              category: event.category,
            }).some((value) =>
              value.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : true;

        // Filtre de localisation
        const matchesLocation = location
          ? event.location.toLowerCase().replace(/\s+/g, "-") ===
            location.toLowerCase()
          : true;

        // Filtre de catégorie
        const matchesCategory =
          category && category !== "all"
            ? event.category.toLowerCase().trim() ===
              category.toLowerCase().trim()
            : true;

        // Filtre de date
        let matchesDate = true;
        if (startDate && endDate) {
          const eventDate = parseISO(event.date);
          const start = parseISO(startDate);
          const end = parseISO(endDate);
          matchesDate = isWithinInterval(eventDate, { start, end });
        }

        return (
          matchesSearch && matchesLocation && matchesCategory && matchesDate
        );
      });

      setFilteredEvents(filtered);
    }
  }, [allEvents, searchQuery, location, category, startDate, endDate]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Extraire les locations et catégories uniques
  const locations = [...new Set(allEvents.map((e) => e.location))].map(
    (loc) => ({
      value: loc.toLowerCase().replace(/\s+/g, "-"),
      label: loc,
    })
  );

  const categories = [...new Set(allEvents.map((e) => e.category))];

  return (
    <>
      <div className="landing_page h-[25vh] bg-blue-900"></div>
      <section id="events" className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            selectedDateRange={{
              start: startDate ? parseISO(startDate) : null,
              end: endDate ? parseISO(endDate) : null,
            }}
            selectedLocation={location || ""}
            selectedCategory={category || "all"}
            locations={locations}
            categories={categories}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {paginatedEvents.map((event) => (
                  <EventCardHome
                    key={event.id}
                    {...event}
                    link={`/event/${event.id}`}
                  />
                ))}
              </ul>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/"
                  searchParams={{
                    search: searchQuery,
                    location,
                    category,
                    start: startDate,
                    end: endDate,
                  }}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
