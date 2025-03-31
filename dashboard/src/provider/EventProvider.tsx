import {
  CreateParams,
  CreateResult,
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  Identifier,
  RaRecord,
  QueryFunctionContext,
  UpdateParams,
  UpdateResult,
  DeleteParams,
  DeleteResult,
  DeleteManyParams,
  DeleteManyResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  UpdateManyParams,
  UpdateManyResult,
} from "react-admin";

import { fetchUtils } from "react-admin";

const urlAPI ="https://tickify-backend.onrender.com";
const httpClient = fetchUtils.fetchJson;

interface Event {
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

export const eventDataProvider: DataProvider = {
  // Dans votre EventProvider.ts
  getList: async function <RecordType extends RaRecord = any>(
    resource: string,
    params: GetListParams & QueryFunctionContext
  ): Promise<GetListResult<RecordType>> {
    try {
      const { page = 1, perPage = 6 } = params.pagination || {}; // 6 éléments par page
      const query = {
        page,
        per_page: perPage,
        ...params.filter,
      };

      const url = `${urlAPI}/api/${resource}?${fetchUtils.queryParameters(query)}`;
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const { json, headers } = await httpClient(url, {
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        method: "GET",
      });

      const total = Number(headers.get("X-Total-Count"));

      const data = json.map((event: Event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        price: event.price,
        availableTickets: event.availableTickets,
        organizer: event.organizer,
        category: event.category,
        image: event.image,
      }));

      return {
        data,
        total,
        pageInfo: {
          hasNextPage: page * perPage < total,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  },
  getOne: function <RecordType extends RaRecord = any>(
    resource: string,
    params: GetOneParams<RecordType> & QueryFunctionContext
  ): Promise<GetOneResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  getMany: function <RecordType extends RaRecord = any>(
    resource: string,
    params: GetManyParams<RecordType> & QueryFunctionContext
  ): Promise<GetManyResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  getManyReference: function <RecordType extends RaRecord = any>(
    resource: string,
    params: GetManyReferenceParams & QueryFunctionContext
  ): Promise<GetManyReferenceResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  update: function <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  updateMany: function <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateManyParams
  ): Promise<UpdateManyResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  create: function <
    RecordType extends Omit<RaRecord, "id"> = any,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
  >(
    resource: string,
    params: CreateParams
  ): Promise<CreateResult<ResultRecordType>> {
    throw new Error("Function not implemented.");
  },
  delete: function <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<DeleteResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  deleteMany: function <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteManyParams<RecordType>
  ): Promise<DeleteManyResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
};
