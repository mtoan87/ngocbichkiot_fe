import LoadingAdminLayout from "@/app/admin/loading";
import DetailOrder from "@/container/order/DetailOrder";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng",
  description:
    "Trang quản trị để xem chi tiết đơn hàng, bao gồm các thông tin như sản phẩm, số lượng, giá cả và trạng thái đơn hàng.",
};

export default async function DetailOrderPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  return (
    <div>
      <React.Suspense fallback={<LoadingAdminLayout />}>
        <DetailOrder orderId={id} />
      </React.Suspense>
    </div>
  );
}
