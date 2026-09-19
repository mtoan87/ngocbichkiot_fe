export interface Product {
  productId: number;
  productName: string;
  category: string;
  sellingPrice: number;
  totalQuantitySold: number;
  imageUrls: string[];
}

export interface YearlyRevenue {
  year: number;
  totalRevenue: number;
}

export interface MonthlyStats {
  month: number;
  orderCount: number;
  totalRevenue: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
}

export interface DashboardData {
  topSellingProducts: Product[];
  revenueByYears: YearlyRevenue[];
  monthlyOrderStats: MonthlyStats[];
  topCustomers: Customer[];
}
