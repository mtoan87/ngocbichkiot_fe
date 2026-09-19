import ManageOrderTable from "@/container/order/ManageOrderTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng",
  description:
    "Trang quản trị để quản lý đơn hàng, bao gồm xem, sửa và xóa đơn hàng.",
};

const ManageOrderPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <ManageOrderTable />
    </div>
  );
};

export default ManageOrderPage;
