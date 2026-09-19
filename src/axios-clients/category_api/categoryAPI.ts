import { Category, CategoryListResponse } from "@/types/CategoryType";
import axiosClient from "../axiosClient";

const categoryApi = {
    //GET category list
    getCategoryList: (params?: any): Promise<CategoryListResponse> => {
        const url = "Category/GetCategoryPagination";
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //GET by id
    getCategoryById: (id: string, params?: any): Promise<Category> => {
        const url = `/Category/GetCategoryById/${id}`;
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //GET category active
    getCategoryActive: (params?: any): Promise<CategoryListResponse> => {
        const url = "Category/GetCategoryPagination?IsDeleted=false";
        return axiosClient.get(url, {
            params,
            paramsSerializer: {
                indexes: null, // by default: false
            },
        });
    },

    //POST create category
    createCategory: (body: any) => {
        const url = "/Category/CreateCategory";
        return axiosClient.post(url, body);
    },

    //PUT update category
    updateCategory: (id: string, body: any) => {
        const url = `/Category/UpdateCategory/${id}`;
        return axiosClient.put(url, body);
    },

    //PUT delete or enable category
    deleteOrEnable: (categoryId: number, isDeleted: number) => {
        const url = `/Category/DeleteOrEnable/${categoryId}/${isDeleted}`;
        return axiosClient.put(url);
    }
};

export default categoryApi;
