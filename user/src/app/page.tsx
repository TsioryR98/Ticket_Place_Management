"use client";
import EventCardHome from "@/components/event/EventCardHome";
import FilterBar from "@/components/event/FilterBar";
import { isWithinInterval, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { fetchEvents } from "@/lib/api";
import { Event } from "@/types/event";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        console.log(
          "Events with images:",
          data.map((e: Event) => ({
            title: e.title,
            imagePath: e.imagePath,
          }))
        );
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const locations = [...new Set(events.map((event) => event.location))].map(
    (location) => ({
      value: location.toLowerCase().replace(/\s+/g, "-"),
      label: location,
    })
  );

  const categories = [...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) => {
    const noFilterApplied =
      !selectedDateRange.start &&
      !selectedDateRange.end &&
      !selectedLocation &&
      !selectedCategory;
    if (noFilterApplied) return true;

    const eventDate = parseISO(event.date);
    const matchDate =
      selectedDateRange.start !== null && selectedDateRange.end !== null
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

    return matchDate && matchLocation && matchCategory;
  });

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="landing_page h-[25vh] bg-green-400"></div>
      <section id="events" className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            locations={locations}
            selectedDateRange={selectedDateRange}
            selectedCategory={selectedCategory}
            categories={categories}
            selectedLocation={selectedLocation}
            setSelectedCategory={setSelectedCategory}
            setSelectedDateRange={setSelectedDateRange}
            setSelectedLocation={setSelectedLocation}
          />

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
        </div>
      </section>
    </>
  );
}
