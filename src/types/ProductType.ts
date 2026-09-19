import { BatchDetail } from "./BatchType";
import { Category } from "./CategoryType";
import { SourceOfProduct } from "./SourceOfProduct";

export interface ProductImage {
  id?: string;
  urlPath: string;
}

export interface ProductLog {
  id: string;
  productId: string;
  quantity: number;
  type: string;
  name: string;
  phone: string;
  address: string;
  createDate: string;
}

export interface CreateProductFormInput {
  name: string;
  categoryId: number;
  //originalPrice: number;
  sellingPrice: number;
  userName: string;
  //phone: string;
  //address: string;
  importCosts: number;
  stockQuantity: number;
  unit: string;
  status: string;
  productImages: (File | string)[];
}

export interface EditProductFormInput {
  name: string;
  categoryId: number;
  //originalPrice: number;
  sellingPrice: number;
  importCosts: number;
  //stockQuantity: number;
  unit: string;
  status: string;
  productImages: (File | string)[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: number;
  category: Category;
  //originalPrice: number;
  sellingPrice: number;
  sourceOfProduct: SourceOfProduct;
  sourceOfProductId: number;
  importCosts: number;
  isDeleted: boolean;
  stockQuantity: number;
  status: string;
  unit: string;
  images: ProductImage[];
  logs: ProductLog[];
  createDate: string;
  batchDetails: BatchDetail[];
}

export interface ProductListResponse {
  items: Product[];
  totalItemsCount: number;
  pageSize: number;
  totalPagesCount: number;
  pageIndex: number;
  next: boolean;
  previous: boolean;
}
