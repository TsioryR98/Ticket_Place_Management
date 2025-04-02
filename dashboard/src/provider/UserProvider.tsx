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

interface User extends RaRecord {
  id: Identifier; // Add the required 'id' property
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const urlAPI = "http://localhost:4000/api";
const httpClient = fetchUtils.fetchJson;

//DATA FOR USER IN admin Page
export const userDataProvider: DataProvider = {
  getList: async function <RecordType extends RaRecord = User>(
    resource: string,
    params: GetListParams & QueryFunctionContext
  ): Promise<GetListResult<RecordType>> {
    try {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const query = {
        page,
        per_page: perPage,
        ...params.filter,
      };
      const offset = (page - 1) * perPage;

      // get data with HTTPS and URL
      const url = `${urlAPI}/${resource}?${fetchUtils.queryParameters(query)}`;
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found in localStorage");
      }
      const { json, headers } = await httpClient(url, {
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        method: "GET",
      });

      //get X total count from header and cast Number
      const total = Number(headers.get("X-Total-Count"));
      const pageNumber = Math.ceil(total / perPage);

      const resultDataAdmin = json.map((item: any) => ({
        ...item,
        id: item.userId,
      }));

      //convert into id required by react admin
      const result: GetListResult = {
        data: resultDataAdmin.slice(offset, offset + perPage),
        total: total,
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

  getOne: async function <RecordType extends RaRecord = User>(
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
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        method: "GET",
      });

      const result: GetOneResult = {
        data: await {
          id: json.userId,
          ...json,
        },
      };

      return result;
    } catch (error) {
      throw error;
    }
  },

  update: function <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult<RecordType>> {
    throw new Error("Function not implemented.");
  },

  /*

  
      
      */
  delete: async function <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<DeleteResult<RecordType>> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      await httpClient(`${urlAPI}/${params.id}`, {
        method: "DELETE",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      });

      return { data: params.previousData ?? ({ id: params.id } as RecordType) };
    } catch (error) {
      throw error;
    }
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
  deleteMany: function <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteManyParams<RecordType>
  ): Promise<DeleteManyResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
};
