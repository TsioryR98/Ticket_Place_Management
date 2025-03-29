export type OrderItem = {
  order_item_id: string;
  order_id: string;
  ticket_id: string;
  quantity: number;
  price: number;
  created_at: string;
  ticket_type?: string;
  event_title?: string;
};

export type Order = {
  order_id: string;
  user_id: string;
  total_amount: number;
  status_order: "pending" | "completed" | "cancelled";
  created_at: string;
  items: OrderItem[];
};
