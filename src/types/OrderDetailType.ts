interface Product {
  id: number;
  name: string;
  sellingPrice: number;
}

interface OrderInf {
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
  createDate: string | null;
}

export interface OrderDetailType {
  id: number;
  orderAmount: number;
  orderDate: string;
  orderStatus: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  paymentMethod: string | null;
  orderDetails: OrderInf[];
  logs: Log[];
}
