export type Ticket = {
  ticket_id: string;
  type: string;
  price: number;
  available: number;
  limitPerPerson: number;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  location: string;
  organizer: string;
  category: string;
  tickets: Ticket[];
  imagePath?: string; // Optionnel si vous voulez ajouter l'image
};
