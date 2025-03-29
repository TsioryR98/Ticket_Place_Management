// EventsGrid.tsx
import { Grid } from "@mui/material";
import { EventCard } from "./EventCard";
import { Event } from "../../type/Event";

interface EventsGridProps {
  events: Event[];
}

export const EventsGrid = ({ events = [] }: EventsGridProps) => {
  return (
    <Grid
      container
      spacing={3}
      sx={{
        padding: 3,
        justifyContent: "flex-start", // Alignement à gauche
      }}
    >
      {events.map((event) => (
        <Grid
          item
          key={event.id}
          xs={12}
          sm={6}
          md={6}
          lg={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "8px!important",
          }}
        >
          <EventCard event={event} />
        </Grid>
      ))}
    </Grid>
  );
};
