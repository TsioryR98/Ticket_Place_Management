import EventCardHome from "@/components/event/EventCardHome";
import FilterBar from "@/components/event/FilterBar";
import { isWithinInterval, parseISO } from "date-fns";
import { Event } from "@/types/event";
import { fetchServerEvents } from "@/lib/api";
import Pagination from "@/components/event/Pagination";

interface HomeProps {
  searchParams: {
    location?: string;
    category?: string;
    start?: string;
    end?: string;
    search?: string;
    page?: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function Home({ searchParams }: HomeProps) {
  const { location, category, start, end, search, page = "1" } = searchParams;

  const currentPage = Number(page) || 1;
  const itemsPerPage = 12;

  const selectedLocation = location;
  const selectedCategory = category === "all" ? undefined : category;
  const selectedDateRange = {
    start: start ? parseISO(start) : null,
    end: end ? parseISO(end) : null,
  };

  const { events: allEvents, total } = await fetchServerEvents();

  const locations = [...new Set(allEvents.map((event) => event.location))].map(
    (location) => ({
      value: location.toLowerCase().replace(/\s+/g, "-"),
      label: location,
    })
  );

  const categories = [...new Set(allEvents.map((event) => event.category))];

  const filteredEvents = allEvents.filter((event) => {
    const eventDate = parseISO(event.date);
    const noFilterApplied =
      !selectedDateRange.start &&
      !selectedDateRange.end &&
      !selectedLocation &&
      !selectedCategory &&
      !search;

    if (noFilterApplied) return true;

    const matchSearch = search
      ? event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchDate =
      selectedDateRange.start && selectedDateRange.end
        ? isWithinInterval(eventDate, {
            start: selectedDateRange.start,
            end: selectedDateRange.end,
          })
        : true;

    const matchLocation = selectedLocation
      ? event.location.toLowerCase().replace(/\s+/g, "-") === selectedLocation
      : true;

    const matchCategory = selectedCategory
      ? event.category === selectedCategory
      : true;

    return matchSearch && matchDate && matchLocation && matchCategory;
  });

  const totalFiltered = filteredEvents.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="landing_page h-[25vh] bg-blue-900"></div>
      <section id="events" className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            locations={locations}
            selectedDateRange={selectedDateRange}
            selectedCategory={selectedCategory || "all"}
            categories={categories}
            selectedLocation={selectedLocation}
          />

          {/* Liste des événements filtrés ET paginés */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {paginatedEvents.map((event) => (
              <li key={event.id} className="w-full h-full">
                <EventCardHome
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  organizer={event.organizer}
                  link={`/event/${event.id}`}
                  imagePath={event.imagePath}
                />
              </li>
            ))}
          </ul>

          {/* Message si aucun résultat */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">Aucun événement trouvé</h3>
              <p className="text-muted-foreground mt-2">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/"
              searchParams={searchParams}
            />
          )}
        </div>
      </section>
    </>
  );
}
