import { SourceOfProduct, SourceOfProductListResponse } from "@/types/SourceOfProduct";
import axiosClient from "../axiosClient";

const sourceOfProductApi = {
    //GET source of product list
    getSourceList: (params?: any): Promise<SourceOfProductListResponse> => {
        const url = "Source/GetSourceOfProductPagination";
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //GET source of product by id
    getSourceById: (id: string, params?: any): Promise<SourceOfProduct> => {
        const url = `/Source/GetSourceOfProductById/${id}`;
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //GET source of product active
    getSourceActive: (params?: any): Promise<SourceOfProductListResponse> => {
        const url = "Source/GetSourceOfProductPagination?IsDeleted=false";
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //POST create source of product
    createSource: (body: any) => {
        const url = "Source/CreateSource";
        return axiosClient.post(url, body);
    },

    //PUT update source of product
    updateSource: (id: string, body: any) => {
        const url = `/Source/UpdateSourceOfProduct/${id}`;
        return axiosClient.put(url, body);
    },

    //PUT delete or enable source of product
    deleteOrEnable: (sourceOfProductId: number, isDeleted: number) => {
        const url = `/Source/DeleteOrEnable/${sourceOfProductId}/${isDeleted}`;
        return axiosClient.put(url);
    }
};

export default sourceOfProductApi;
