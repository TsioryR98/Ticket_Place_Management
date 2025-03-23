"use client"
import Events from "../lib/events.json";
import EventCardHome from "@/components/event/EventCardHome";
import FilterBar from "@/components/event/FilterBar";
import {isWithinInterval, parseISO} from "date-fns";
import {useState} from "react";

export default function Home() {
    const locations = [...new Set(Events.map((event) => event.location))].map(location => ({
        value: location.toLowerCase().replace(/\s+/g, "-"),
        label: location
    }));
    const categories = [...new Set(Events.map((event) => event.category))];

    const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({ start: undefined, end: undefined });
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);



    const filteredEvents = Events.filter((event) => {
        const noFilterApplied = !selectedDateRange.start && !selectedDateRange.end && !selectedLocation && !selectedCategory;
        if (noFilterApplied) return true;

        const eventDate = parseISO(event.date);
        const matchDate =
            selectedDateRange.start !== undefined && selectedDateRange.end !== undefined
                ? isWithinInterval(eventDate, { start: selectedDateRange.start, end: selectedDateRange.end })
                : true;

        const matchLocation = selectedLocation ? event.location.toLowerCase().replace(/\s+/g, "-") === selectedLocation : true;
        const matchCategory = selectedCategory ? event.category === selectedCategory : true;

        return matchDate && matchLocation && matchCategory;
    });
  return (
    <>
      <div className="landing_page h-[25vh] bg-green-400"></div>
      <section id="events" className="flex items-center flex-col">
          <FilterBar locations={locations} selectedDateRange={selectedDateRange} selectedCategory={selectedCategory} categories={categories} selectedLocation={selectedLocation} setSelectedCategory={setSelectedCategory} setSelectedDateRange={setSelectedDateRange} setSelectedLocation={setSelectedLocation}/>
        <ul className="grid grid-cols-2 gap-8 px-8 mt-8">
            {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                        return (
                            <li key={event.id}>
                                <EventCardHome
                                    title={event.title}
                                    description={event.description}
                                    date={event.date}
                                    time={event.time}
                                    location={event.location}
                                    organizer={event.organizer}
                                    link={`/event/${event.id}`}
                                />
                            </li>
                        );
                    })
            ) : (
                <p className="text-center text-2xl font-semibold">No Event found.</p>
            )}

        </ul>
      </section>
    </>
  );
}
