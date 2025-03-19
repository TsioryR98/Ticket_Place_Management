import Events from "../lib/events.json";
<<<<<<< HEAD
import EventCardHome from "@/components/event/EventCardHome";
=======
import EventCardHome from "@/components/EventCardHome";
>>>>>>> userOnly

export default function Home() {
  return (
    <>
      <div className="landing_page h-[25vh] bg-green-400"></div>
      <section id="events" className="flex items-center flex-col">
        <ul className="grid grid-cols-2 gap-8 px-8 mt-8">
          {Events.map((event) => {
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
          })}
        </ul>
      </section>
    </>
  );
}
