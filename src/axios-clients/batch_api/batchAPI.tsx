import axiosClient from "../axiosClient";

const BatchAPI = {
  //GET api batch
  getBatchList: (params?: any) => {
    const url = "/Batch/GetBatchPagination?IsDescending=true";
    return axiosClient.get(url, {
      params,
    });
  },

  getBatchById: (id: string, params?: any) => {
    const url = `/Batch/GetBatchById/${id}`;
    return axiosClient.get(url, {
      params,
    });
  },

  //POST api
  CreateBatch: (params?: any) => {
    const url = "/Batch/CreateBatch";
    return axiosClient.post(url, params);
  },

  UpdateBatchDetailWhenCanNotSoldOut: (body?: any, params?: any) => {
    const url = "/BatchDetail/UpdateBatchStock";
    return axiosClient.put(url, body, { params });
  },
};

export default BatchAPI;
