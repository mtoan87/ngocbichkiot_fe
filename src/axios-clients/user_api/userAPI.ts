import axiosClient from "../axiosClient";

const userApi = {
  //GET api
  getListUsers: (params?: any) => {
    const url = "/Users/GetUserPagination";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getUserByPhone: (params?: any) => {
    const url = "/Users/GetCustomerInfoByPhone";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  //POST api (multipart/form-data)
  createNewUser: (body: any) => {
    const url = "/Users/CreateUser";
    return axiosClient.post(url, body);
  },

  //POST api
  postSomeThingNor: (body: any) => {
    const url = "/api/v1/someThing";
    return axiosClient.post(url, body);
  },

  //PUT api
  putSomeThing: (body: any) => {
    const url = "/api/v1/someThing";
    return axiosClient.put(url, body);
  },

  //DELETE api
  deleteSomeThing: (id: string) => {
    const url = `/api/v1/someThing/${id}`;
    return axiosClient.delete(url);
  },

  //PATCH api
  patchSomeThing: (id: string, body: any) => {
    const url = `/api/v1/someThing/${id}`;
    return axiosClient.patch(url, body);
  },
};

export default userApi;
