// EventList.tsx
import { List, Pagination, useListContext } from "react-admin";
import { EventsGrid } from "../event/EventGrid";

export const EventList = () => {
  return (
    <List
      perPage={6} // 6 éléments par page
      pagination={<Pagination rowsPerPageOptions={[6, 12, 24]} />}
    >
      <EventListView />
    </List>
  );
};

const EventListView = () => {
  const { data, isLoading } = useListContext();

  if (isLoading) return <div>Chargement...</div>;

  return <EventsGrid events={data ?? []} />; //null or undefined check if not data
  // If data is null or undefined, return an empty array to avoid rendering errors
};
