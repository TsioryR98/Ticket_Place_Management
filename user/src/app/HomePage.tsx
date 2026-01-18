'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Event } from '@/types/event';
import { fetchServerEvents } from '@/lib/api';
import EventCardHome from '@/components/event/EventCardHome';
import Pagination from '@/components/event/Pagination';
import FilterBar from '@/components/event/FilterBar';
import { parseISO, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Paramètres de pagination et filtres
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 12;
  const searchQuery = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  useEffect(() => {
    if (window.location.hash === '#events') {
      const eventsSection = document.getElementById('events');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  // Animation du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { events } = await fetchServerEvents({ limit: 1000 });
        setAllEvents(events);
      } catch (error) {
        console.error('Failed to load events', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrage des événements
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (
      currentPage !== 1 &&
      (params.get('category') !== category ||
        params.get('location') !== location ||
        params.get('search') !== searchQuery ||
        params.get('start') !== startDate ||
        params.get('end') !== endDate)
    ) {
      params.set('page', '1');
      router.replace(`?${params.toString()}`, { scroll: false });
    }

    if (allEvents.length > 0) {
      const filtered = allEvents.filter((event) => {
        const matchesSearch = searchQuery
          ? Object.values({
              title: event.title,
              description: event.description,
              location: event.location,
              organizer: event.organizer,
              category: event.category,
            }).some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;

        const matchesLocation = location
          ? event.location.toLowerCase().replace(/\s+/g, '-') === location.toLowerCase()
          : true;

        const matchesCategory =
          category && category !== 'all'
            ? event.category.toLowerCase().trim() === category.toLowerCase().trim()
            : true;

        let matchesDate = true;
        if (startDate && endDate) {
          const eventDate = parseISO(event.date);
          const start = parseISO(startDate);
          const end = parseISO(endDate);
          matchesDate = isWithinInterval(eventDate, { start, end });
        }

        return matchesSearch && matchesLocation && matchesCategory && matchesDate;
      });

      setFilteredEvents(filtered);
    }
  }, [allEvents, searchQuery, location, category, startDate, endDate]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const locations = [...new Set(allEvents.map((e) => e.location))].map((loc) => ({
    value: loc.toLowerCase().replace(/\s+/g, '-'),
    label: loc,
  }));

  const categories = [...new Set(allEvents.map((e) => e.category))];

  return (
    <div className="w-full">
      {/* Hero Section with Carousel */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-xl">
              Create <span className="text-blue-300">unforgettable</span> <br />
              memories
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 drop-shadow-md">
              Discover our exclusive events and book your tickets online
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 text-lg bg-white text-blue-900 hover:bg-blue-100 transition-all"
              onClick={() => {
                document.getElementById('events')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              Explore now
            </Button>
          </div>
        </div>

        {/* Custom Carousel with improved animation */}
        <div className="absolute inset-0">
          {allEvents.slice(0, 5).map((event, index) => {
            const imageNumber = (index % 4) + 1;
            const imagePath = `/events/event${imageNumber}.jpg`;

            return (
              <div
                key={`carousel-${event.id}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  zIndex: index === activeIndex ? 1 : 0,
                  transform: `scale(${index === activeIndex ? 1 : 1.02})`,
                  transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
                }}
              >
                <Image
                  src={imagePath}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                  quality={100}
                  style={{
                    transform: 'scale(1.01)',
                    transition: 'transform 1s ease-in-out',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Events Grid Section */}
      <section id="events" className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            selectedDateRange={{
              start: startDate ? parseISO(startDate) : null,
              end: endDate ? parseISO(endDate) : null,
            }}
            selectedLocation={location || ''}
            selectedCategory={category || 'all'}
            locations={locations}
            categories={categories}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {paginatedEvents.map((event) => (
                  <EventCardHome key={event.id} {...event} link={`/event/${event.id}`} />
                ))}
              </div>

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

      {/* Styles inline pour l'animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(1.02);
          }
          20% {
            opacity: 1;
            transform: scale(1);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}
