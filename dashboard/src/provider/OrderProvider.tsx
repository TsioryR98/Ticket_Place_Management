import {
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  Identifier,
  RaRecord,
  UpdateParams,
  UpdateResult,
} from 'react-admin';
import { fetchUtils } from 'react-admin';

const urlAPI = 'http://localhost:4000/api';
const httpClient = fetchUtils.fetchJson;

interface Order extends RaRecord {
  id: Identifier;
  user_id: Identifier;
  user_email?: string;
  total_amount: number;
  status_order: 'pending' | 'completed' | 'cancelled';
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

export const orderDataProvider: DataProvider = {
  getList: async (resource, params) => {
    try {
      const { eventId } = params.filter || {};
      const url = eventId ? `${urlAPI}/orders/event/${eventId}` : `${urlAPI}/orders/test/orders`;
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const { json } = await httpClient(url, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
        method: 'GET',
      });

      const mappedData = json.map((order: any) => ({
        id: order.order_id,
        user_id: order.user_id,
        user_email: order.user_email,
        total_amount: parseFloat(order.total_amount),
        status_order: order.status_order,
        created_at: order.created_at,
      }));

      return {
        data: mappedData,
        total: mappedData.length,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    try {
      const { json } = await httpClient(`${urlAPI}/orders/admin/${params.id}`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
        method: 'GET',
      });

      return {
        data: {
          id: json.order_id,
          user_id: json.user_id,
          user_email: json.user_email,
          total_amount: parseFloat(json.total_amount),
          status_order: json.status_order,
          created_at: json.created_at,
          items:
            json.items?.map((item: any) => ({
              order_item_id: item.order_item_id,
              ticket_id: item.ticket_id,
              quantity: item.quantity,
              price: parseFloat(item.price),
              ticket_type: item.ticket_type,
              event_title: item.event_title,
              event_date: item.event_date,
              event_location: item.event_location,
            })) || [],
        },
      };
    } catch (error) {
      console.error('Order fetch error:', {
        url: `${urlAPI}/orders/admin/${params.id}`,
        error: error.message,
        status: error.status,
        body: error.body,
      });
      throw new Error(
        error.status === 403 ? 'Admin access required' : 'Could not load order details',
      );
    }
  },

  update: async (resource, params) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const { json } = await httpClient(`${urlAPI}/orders/${params.id}`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
        method: 'PUT',
        body: JSON.stringify({ status: params.data.status_order }),
      });

      return {
        data: {
          id: json.order_id,
          ...json,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  // Méthodes minimales requises (implémentez selon vos besoins)
  create: () => Promise.resolve({ data: {} as any }),
  delete: () => Promise.resolve({ data: {} as any }),
  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  updateMany: () => Promise.resolve({ data: [] }),
  deleteMany: () => Promise.resolve({ data: [] }),
};
