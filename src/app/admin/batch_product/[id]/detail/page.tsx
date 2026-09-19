import TableBatchDetail from "@/container/ManageBatch/TableBatchDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết lô sản phẩm",
  description:
    "Trang quản trị để xem chi tiết lô sản phẩm, bao gồm thông tin về các sản phẩm trong lô, trạng thái và các thông tin liên quan khác.",
};

export default async function BatchDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  return (
    <>
      <TableBatchDetail id={id} />
    </>
  );
}
