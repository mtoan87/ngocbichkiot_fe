import EditProduct from "@/container/product/EditProduct";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa sản phẩm",
  description:
    "Trang quản trị để chỉnh sửa thông tin sản phẩm, bao gồm tên, mô tả, giá cả và hình ảnh.",
};

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  return (
    <>
      <EditProduct id={id} />
    </>
  );
}
