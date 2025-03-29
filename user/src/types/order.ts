// types/order.ts
export type OrderItem = {
  order_item_id: string;
  ticket_id: string;
  quantity: number;
  price: number;
  ticket_type: string; // Ajouté pour l'affichage
  event_id?: string; // Optionnel si utile
  event_title?: string; // Pour la page de liste
  event_date?: string; // Pour le filtrage
  event_location?: string; // Pour l'affichage
  event_organizer?: string; // Pour l'affichage
};

export type Order = {
  order_id: string;
  user_id: string;
  total_amount: number;
  status_order: "pending" | "confirmed" | "cancelled";
  created_at: string;
  items: OrderItem[]; // Contient maintenant toutes les infos nécessaires
};
