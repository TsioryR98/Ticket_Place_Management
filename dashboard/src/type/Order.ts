import { RaRecord, Identifier } from "react-admin";

export interface Order extends RaRecord {
  id: Identifier;
  user_id: Identifier;
  user_email?: string;
  total_amount: number;
  status_order: "pending" | "completed" | "cancelled";
  created_at: string;
  items: {
    order_item_id: Identifier;
    ticket_id: Identifier;
    quantity: number;
    price: number;
    ticket_type: string;
    event_title: string;
    event_date: string;
    event_location: string;
  }[];
}
