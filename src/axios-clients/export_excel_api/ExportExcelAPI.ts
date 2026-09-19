import axiosFileClient from "@/axios-clients/axiosFileClient";

const exportApi = {
  exportExcelDateExport: (params: { fromDate: string; toDate: string }) => {
    const url = "/ExportToExcels/Exports";
    return axiosFileClient.get(url, { params });
  },
};

export default exportApi;
