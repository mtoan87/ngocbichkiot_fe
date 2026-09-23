// axiosFileClient.ts
import axios from "axios";

const axiosFileClient = axios.create({
  baseURL: "http://ngocbichkiot.runasp.net/api",
  responseType: "blob", // 👈 Required for Excel
  headers: {
    "Content-Type": "application/json",
    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
});

axiosFileClient.interceptors.request.use((config) => {
  const userDataLocal = localStorage.getItem("userInfor");
  const userData = userDataLocal ? JSON.parse(userDataLocal) : null;
  if (userData) {
    config.headers.Authorization = `Bearer ${userData?.accessToken}`;
  }
  return config;
});

export default axiosFileClient;
