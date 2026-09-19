export interface SourceOfProduct {
    id: string;
    name: string;
}
export interface SourceOfProductListResponse {
    items: SourceOfProduct[];
    totalItemsCount: number;
    pageSize: number;
    totalPagesCount: number;
    pageIndex: number;
    next: boolean;
    previous: boolean;
}