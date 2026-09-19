import axiosClient from "../axiosClient";

const authApi = {
  login: (body: any) => {
    const url = "/Authenticate/Login";
    return axiosClient.post(url, body);
  },
};

export default authApi;
