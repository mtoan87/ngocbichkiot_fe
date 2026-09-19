export interface ProductImage {
  id: number;
  urlPath: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductBatch {
  id: number;
  name: string;
  sellingPrice: number;
  importCosts: number;
  unit: string;
  isDeleted: boolean;
  categoryId: number;
  status: string;
  createDate: string;
  category: ProductCategory;
  images: ProductImage[];
  logs: any[];
}
export interface Product {
  id: number;
  name: string;
  sellingPrice: number;
}
export interface SourceOfProduct {
  id: number;
  name: string;
}

export interface BatchDetail {
  id: number;
  batchId: number;
  productId: number;
  SourceOfProductId: number;
  remainingQuantity: number;
  daysUntilExpiration: number;
  createDate: string;
  expiredDate: string;
  isExpiredLogged: boolean;
  quantity: number;
  productDTO: Product;
  sourceOfProductDTO: SourceOfProduct;
}

export interface Batch {
  id: number;
  createDate: string;
  batchDetailDTOs: BatchDetail[];
}