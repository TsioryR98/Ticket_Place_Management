// src/provider/OrderProvider.tsx
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
} from "react-admin";
import { fetchUtils } from "react-admin";

const urlAPI = "http://localhost:4000/api";
const httpClient = fetchUtils.fetchJson;

interface Order extends RaRecord {
  id: Identifier;
  user_id: Identifier;
  total_amount: number;
  status_order: string;
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
      const url = eventId
        ? `${urlAPI}/orders/event/${eventId}`
        : `${urlAPI}/orders/test/orders`;
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const { json } = await httpClient(url, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }),
        method: "GET",
      });

      // Transformez les données pour React-admin
      const mappedData = json.map((order: any) => ({
        id: order.order_id,
        user_id: order.user_id,
        user_email: order.user_email, // Ajoutez cette ligne si disponible
        total_amount: parseFloat(order.total_amount),
        status_order: order.status_order,
        created_at: order.created_at,
      }));

      return {
        data: mappedData,
        total: mappedData.length,
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOne: async function <RecordType extends RaRecord = Order>(
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult<RecordType>> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const { json } = await httpClient(`${urlAPI}/${resource}/${params.id}`, {
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        method: "GET",
      });

      const mappedData = {
        id: json.order_id,
        user_id: json.user_id,
        total_amount: json.total_amount,
        status_order: json.status_order,
        created_at: json.created_at,
        items: json.items,
      };

      return {
        data: mappedData,
      };
    } catch (error) {
      throw error;
    }
  },

  update: async function <RecordType extends RaRecord = Order>(
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult<RecordType>> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const { json } = await httpClient(`${urlAPI}/${resource}/${params.id}`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }),
        method: "PUT",
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

  // Other methods can be implemented as needed
  create: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  delete: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  getMany: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  getManyReference: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  updateMany: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
  deleteMany: function (): Promise<any> {
    throw new Error("Function not implemented.");
  },
};
