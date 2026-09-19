import { Product, ProductListResponse } from "@/types/ProductType";
import axiosClient from "../axiosClient";
import { AxiosResponse } from "axios";

const productApi = {
    //GET api
    getProductList: (params?: any): Promise<ProductListResponse> => {
        const url = "/Products/GetProductPagination?IsDescending=true";
        return axiosClient.get(url, {
            params,
        });
    },
    getAvailableProductList: (params?: any): Promise<ProductListResponse> => {
        const url = "/Products/GetProductPagination?IsDeleted=false";
        return axiosClient.get(url, {
            params,
        });
    },
    getProductById: (id: string, params?: any): Promise<Product> => {
        const url = `/Products/GetProductById/${id}`;
        return axiosClient.get(url, {
            params,
        });
    },

    //POST api
    CreateProduct: (body: any) => {
        const url = "/Products/CreateProduct";
        return axiosClient.post<Product>(url, body);
    },

    //PUT api
    UpdateProduct: (id: string, body: any): Promise<Product> => {
        const url = `/Products/UpdateProduct/${id}`;
        return axiosClient.put(url, body);
    },

    UpdateProductQuantity: (id: string, body: any): Promise<{ message: string }> => {
        const url = `/Products/UpdateProductQuantity/${id}`;
        return axiosClient.put(url, body);
    },

    UpdateStock: (productId: string, quantity: number, type: string, body: any): Promise<{ message: string }> => {
        const url = `/Products/UpdateStock`;
        return axiosClient.put(url, body, {
            params: {
                productId,
                quantity,
                type,
            },
        });
    },

    DeleteOrEnable: (productId: string, isDeleted: number): Promise<{ message: string }> => {
        const url = `/Products/DeleteOrEnable`;
        return axiosClient.put(url, null, {
            params: {
                productId,
                isDeleted,
            },
        });
    },

    //DELETE api
    // deleteSomeThing: (id: string) => {
    //     const url = `/api/v1/someThing/${id}`;
    //     return axiosClient.delete(url);
    // },

    //PATCH api
    // patchSomeThing: (id: string, body: any) => {
    //     const url = `/api/v1/someThing/${id}`;
    //     return axiosClient.patch(url, body);
    // },
};

export default productApi;
