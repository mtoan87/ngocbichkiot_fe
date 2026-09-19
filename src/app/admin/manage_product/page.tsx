import ProductTable from "@/container/product/ProductTable";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm",
  description:
    "Trang quản trị để quản lý sản phẩm, bao gồm thêm, sửa và xóa sản phẩm.",
};

const ManageProductPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <ProductTable />
    </div>
  );
};

export default ManageProductPage;
