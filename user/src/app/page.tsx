import Events from "../lib/events.json"
import EventCardHome from "@/components/EventCardHome";

export default function Home() {
  return (
      <>
        <div className="landing_page h-[80vh] bg-red-700">

        </div>

          <section id="events" className="flex items-center flex-col">
              <div>
                  <h1>Search bar</h1>
              </div>

              <ul className="grid grid-cols-2 gap-8 px-8 mt-8">
                  {Events.map((event) => {
                      return (
                          <li key={event.id}>
                              <EventCardHome title={event.title} description={event.description} date={event.date} time={event.time} location={event.location} organizer={event.organizer} link={`/event/${event.id}`} />
                          </li>
                      )
                  })}
              </ul>
          </section>
      </>
  );
}
