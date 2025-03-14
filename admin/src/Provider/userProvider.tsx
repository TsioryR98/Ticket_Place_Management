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
} from "react-admin";

import { fetchUtils } from "react-admin";
import queryString from "query-string";

interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  role: string;
  created_at: string;
}

const urlAPI = "http://localhost:4000/api/users";
const httpClient = fetchUtils.fetchJson;

//DATA FOR USER IN admin Page
export const userDataProvider: DataProvider = {
  getList: async function <RecordType extends RaRecord = any>(
    resource: string,
    params: GetListParams & QueryFunctionContext,
  ): Promise<GetListResult<RecordType>> {
    try {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const query = {
        page,
        perPage,
      };

      // get data with HTTPS and URL
      const url = `${urlAPI}?${queryString.stringify(query)}`;
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      //build headers
      const { json, headers } = await httpClient(url, {
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        method: "GET",
      });

      //convert into id required by react admin
      const data = json.map((user: User) => ({
        id: user.user_id,
        ...user, // Include all other user fields in User interface
      }));
      const total = json.total;
      return {
        data,
        total,
      };
    } catch (error) {
      throw error;
    }
  },

  /*
    
    */
  delete: async function <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>,
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

  getOne: function <RecordType extends RaRecord = any>(
    resource: string,
    params: GetOneParams<RecordType> & QueryFunctionContext,
  ): Promise<GetOneResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  update: function <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateParams,
  ): Promise<UpdateResult<RecordType>> {
    throw new Error("Function not implemented.");
  },
  create: function <
    RecordType extends Omit<RaRecord, "id"> = any,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
  >(
    resource: string,
    params: CreateParams,
  ): Promise<CreateResult<ResultRecordType>> {
    throw new Error("Function not implemented.");
  },
};
