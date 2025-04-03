// src/type/Order.ts
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status_order: "pending" | "completed" | "cancelled";
  created_at: string;
  items: {
    order_item_id: string;
    ticket_id: string;
    quantity: number;
    price: number;
    ticket_type: string;
    event_title: string;
    event_date: string;
    event_location: string;
  }[];
}
