import CreateProduct from "@/container/product/CreateProduct";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thêm sản phẩm mới",
  description:
    "Trang quản trị để thêm sản phẩm mới, bao gồm các thông tin như tên, mô tả, giá cả và hình ảnh.",
};

export default async function EditProductPage() {
  return (
    <>
      <CreateProduct />
    </>
  );
}
