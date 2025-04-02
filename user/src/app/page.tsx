import EventCardHome from "@/components/event/EventCardHome";
import FilterBar from "@/components/event/FilterBar";
import { isWithinInterval, parseISO } from "date-fns";
import { Event } from "@/types/event";
import { fetchServerEvents } from "@/lib/api";

interface HomeProps {
  searchParams: {
    location?: string;
    category?: string;
    start?: string;
    end?: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function Home({ searchParams }: HomeProps) {
  const { location, category, start, end } = await searchParams;

  const selectedLocation = location;
  const selectedCategory = category === "all" ? undefined : category;
  const selectedDateRange = {
    start: start ? parseISO(start) : null,
    end: end ? parseISO(end) : null,
  };

  const events = await fetchServerEvents();

  const locations = [...new Set(events.map((event) => event.location))].map(
    (location) => ({
      value: location.toLowerCase().replace(/\s+/g, "-"),
      label: location,
    })
  );

  const categories = [...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) => {
    const eventDate = parseISO(event.date);
    const noFilterApplied =
      !selectedDateRange.start &&
      !selectedDateRange.end &&
      !selectedLocation &&
      !selectedCategory;

    if (noFilterApplied) return true;

    // Filtre par date
    const matchDate =
      selectedDateRange.start && selectedDateRange.end
        ? isWithinInterval(eventDate, {
            start: selectedDateRange.start,
            end: selectedDateRange.end,
          })
        : true;

    // Filtre par localisation
    const matchLocation = selectedLocation
      ? event.location.toLowerCase().replace(/\s+/g, "-") === selectedLocation
      : true;

    // Filtre par catégorie
    const matchCategory = selectedCategory
      ? event.category === selectedCategory
      : true;

    return matchDate && matchLocation && matchCategory;
  });

  return (
    <>
      <div className="landing_page h-[25vh] bg-blue-900"></div>
      <section id="events" className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            locations={locations}
            selectedDateRange={selectedDateRange}
            selectedCategory={selectedCategory || "all"} // "all" pour la valeur par défaut
            categories={categories}
            selectedLocation={selectedLocation}
          />

          {/* Liste des événements filtrés */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredEvents.map((event) => (
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
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">Aucun événement trouvé</h3>
              <p className="text-muted-foreground mt-2">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
