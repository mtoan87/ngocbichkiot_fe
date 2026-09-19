export interface Category {
    id: string;
    name: string;
}
export interface CategoryListResponse {
    items: Category[];
    totalItemsCount: number;
    pageSize: number;
    totalPagesCount: number;
    pageIndex: number;
    next: boolean;
    previous: boolean;
}