export type Ticket = {
  type: string;
  price: number;
  available: number;
  limitPerPerson: number;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  tickets: Ticket[];
};
