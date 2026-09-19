export const OrderStatus = {
  PENDING: "Pending",
  FINISH: "Finish",
  CANCELED: "Canceled",
  PREPARED: "Prepared",
};

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
