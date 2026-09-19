import DetailProduct from "@/container/product/DetailProduct";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm",
  description:
    "Trang quản trị để xem chi tiết sản phẩm, bao gồm các thông tin như tên, mô tả, giá cả và hình ảnh.",
};

export default async function DetailProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  return (
    <>
      <DetailProduct id={id} />
    </>
  );
}
