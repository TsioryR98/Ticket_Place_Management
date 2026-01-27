import {
  // src/provider/TicketProvider.tsx
  CreateParams,
  CreateResult,
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  Identifier,
  RaRecord,
  UpdateParams,
  UpdateResult,
  DeleteParams,
  DeleteResult,
} from 'react-admin';
import { fetchUtils } from 'react-admin';

const urlAPI = 'http://localhost:4000/api';
const httpClient = fetchUtils.fetchJson;

interface Ticket extends RaRecord {
  id: Identifier;
  eventId: Identifier;
  ticket_id: Identifier;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const ticketDataProvider: DataProvider = {
  getList: async function <RecordType extends RaRecord = Ticket>(
    resource: string,
    params: GetListParams,
  ): Promise<GetListResult<RecordType>> {
    try {
      const { eventId } = params.filter;
      if (!eventId) {
        throw new Error('eventId is required to fetch tickets');
      }

      const url = `${urlAPI}/events/${eventId}/tickets`;
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const { json } = await httpClient(url, {
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      });

      return {
        data: json.tickets,
        total: json.tickets.length,
      };
    } catch (error) {
      throw error;
    }
  },

  getOne: async function <RecordType extends RaRecord = Ticket>(
    resource: string,
    params: GetOneParams,
  ): Promise<GetOneResult<RecordType>> {
    try {
      const [eventId, ticketId] = params.id.toString().split('_');
      const url = `${urlAPI}/events/${eventId}/tickets/${ticketId}`;
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const { json: response } = await httpClient(url, {
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      });

      return {
        data: {
          ...response.ticket,
          id: `${eventId}_${ticketId}`,
        } as RecordType,
      };
    } catch (error) {
      throw error;
    }
  },

  create: async function <
    RecordType extends Omit<RaRecord, 'id'> = Ticket,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
  >(resource: string, params: CreateParams<RecordType>): Promise<CreateResult<ResultRecordType>> {
    try {
      const { eventId } = params.data;
      if (!eventId) {
        throw new Error('eventId is required to create a ticket');
      }

      const url = `${urlAPI}/events/${eventId}/tickets`;
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const { json: response } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      });

      return {
        data: {
          ...response.ticket,
          id: `${eventId}_${response.ticket.ticket_id}`,
        } as ResultRecordType,
      };
    } catch (error) {
      throw error;
    }
  },

  update: async function <RecordType extends RaRecord = Ticket>(
    resource: string,
    params: UpdateParams<RecordType>,
  ): Promise<UpdateResult<RecordType>> {
    try {
      const [eventId, ticketId] = params.id.toString().split('_');
      const url = `${urlAPI}/events/${eventId}/tickets/${ticketId}`;
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found in localStorage');
      }

      const { json: response } = await httpClient(url, {
        method: 'PUT',
        body: JSON.stringify(params.data),
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      });

      return {
        data: {
          ...response.ticket,
          id: `${eventId}_${ticketId}`,
        } as RecordType,
      };
    } catch (error) {
      throw error;
    }
  },

  delete: async function <RecordType extends RaRecord = Ticket>(
    resource: string,
    params: DeleteParams<RecordType>,
  ): Promise<DeleteResult<RecordType>> {
    try {
      const [eventId, ticketId] = params.id.toString().split('_');
      const url = `${urlAPI}/events/${eventId}/tickets/${ticketId}`;
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found in localStorage');
      }

      await httpClient(url, {
        method: 'DELETE',
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      });

      return {
        data: params.previousData as RecordType,
      };
    } catch (error) {
      throw error;
    }
  },

  // Méthodes non implémentées
  getMany: function <RecordType extends RaRecord = any>(): Promise<any> {
    throw new Error('Function not implemented.');
  },
  getManyReference: function <RecordType extends RaRecord = any>(): Promise<any> {
    throw new Error('Function not implemented.');
  },
  updateMany: function <RecordType extends RaRecord = any>(): Promise<any> {
    throw new Error('Function not implemented.');
  },
  deleteMany: function <RecordType extends RaRecord = any>(): Promise<any> {
    throw new Error('Function not implemented.');
  },
};
