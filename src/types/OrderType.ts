interface Product {
  id: number;
  name: string;
  sellingPrice: number;
}

interface OrderDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
}

interface Log {
  id: number;
  productId: number;
  quantity: number;
  type: string;
  createDate: string;
}

export interface Order {
  id: number;
  orderAmount: number;
  orderDate: string;
  orderStatus: string;
  name: string;
  phone: string;
  address: string;
  orderDetails: OrderDetail[];
  logs: Log[];
}
