import { Identifier } from "react-admin";

export interface Event {
  id: Identifier;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  organizer: string;
  category: string;
  image: string;
}
