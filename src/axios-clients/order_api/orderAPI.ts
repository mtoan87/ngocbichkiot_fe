import axiosClient from "../axiosClient";

const orderApi = {
  //GET api
  getListOrder: (params?: any) => {
    const url = "/Orders/GetOrderPagination";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getOrderDetail: (id?: any) => {
    const url = `/Orders/GetOrderById/${id}`;
    return axiosClient.get(url);
  },

  checkOut: (id?: any, paymentMethod?: any) => {
    const url = `/Orders/CheckOut?orderId=${id}&paymentMethod=${paymentMethod}`;
    return axiosClient.get(url);
  },

  //POST api
  createOrder: (body: any) => {
    const url = "/Orders/CreateOrder";
    return axiosClient.post(url, body);
  },

   createOrderNoInfor: (body: any) => {
    const url = "/Orders/CreateOrderNoInfor";
    return axiosClient.post(url, body);
  },
  //PUT api
  updateOrder: (id: any, body: any) => {
    const url = `/Orders/UpdateOrder/${id}`;
    return axiosClient.put(url, body);
  },

  updateOrderStatus: (id: string, params?: any) => {
    return axiosClient.put(`/Orders/UpdateOrderStatus/${id}`, null, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
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

export default orderApi;
