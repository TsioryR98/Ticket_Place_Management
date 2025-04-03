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

const urlAPI = "http://localhost:4000/api";
const httpClient = fetchUtils.fetchJson;

interface Event extends RaRecord {
  id: Identifier;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  imagePath: string;
}

export const eventDataProvider: DataProvider = {
  // Dans votre EventProvider.ts
  getList: async function <RecordType extends RaRecord = Event>(
    resource: string,
    params: GetListParams & QueryFunctionContext
  ): Promise<GetListResult<RecordType>> {
    try {
      const { page = 1, perPage = 6 } = params.pagination || {}; // 6 éléments par page
      const query = {
        page,
        perPage,
        ...params.filter,
      };

      const url = `${urlAPI}/${resource}?${fetchUtils.queryParameters(query)}`;
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const { json, headers } = await httpClient(url, {
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        method: "GET",
      });

      // json is from the API response database

      const total = Number(headers.get("X-Total-Count"));
      const pageNumber = Math.ceil(total / perPage);

      const mappedData = json.map((event: Event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        organizer: event.organizer,
        category: event.category,
        image: event.images, //images is from the API response
      }));

      const result: GetListResult = {
        data: mappedData, // already slice in back the data for pagination
        total,
        pageInfo: {
          hasNextPage: page < pageNumber,
          hasPreviousPage: page !== 1, //if page 1 no previous
        },
      };
      return result;
    } catch (error) {
      throw error;
    }
  },
  getOne: async function <RecordType extends RaRecord = Event>(
    resource: string,
    params: GetOneParams<RecordType> & QueryFunctionContext
  ): Promise<GetOneResult<RecordType>> {
    const { id } = params; // Correctly destructure the id

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const { json } = await httpClient(`${urlAPI}/${resource}/${id}`, {
        method: "GET",
      });
      const mappedData = {
        id: json.id,
        title: json.title,
        description: json.description,
        date: json.date,
        location: json.location,
        organizer: json.organizer,
        category: json.category,
        image: json.imagePath, //imagePath is from the API response
      };
      const result: GetOneResult = {
        data: mappedData,
      };
      return result;
    } catch (error) {
      throw error;
    }
  },
  update: async function <RecordType extends RaRecord = Event>(
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult<RecordType>> {
    const { id, data } = params;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      // Format the request body to match backend expectations
      const requestBody = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        category: data.category,
      };

      const { json } = await httpClient(`${urlAPI}/${resource}/${id}/update`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }),
        method: "PUT",
        body: JSON.stringify(requestBody),
      });

      const updatedData = {
        id: id,
        title: json.title,
        description: json.descriptions,
        date: new Date(json.event_datetime).toISOString().split("T")[0],
        time: new Date(json.event_datetime).toTimeString().split(" ")[0],
        location: json.locations,
        organizer: json.organizer,
        category: json.category,
      };

      const result: UpdateResult = {
        data: updatedData,
      };
      return result;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
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
